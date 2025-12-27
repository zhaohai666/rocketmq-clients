/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Duration } from 'google-protobuf/google/protobuf/duration_pb';
import { ClientType, Resource } from '../../proto/apache/rocketmq/v2/definition_pb';
import {
  AckMessageEntry,
  AckMessageRequest,
  ChangeInvisibleDurationRequest,
  ForwardMessageToDeadLetterQueueRequest,
  HeartbeatRequest,
  NotifyClientTerminationRequest,
  QueryAssignmentRequest,
  TelemetryCommand,
  VerifyMessageCommand,
  VerifyMessageResult,
} from '../../proto/apache/rocketmq/v2/service_pb';
import { ClientException, StatusChecker } from '../exception';
import { ClientConfiguration, ILogger } from '../client';
import { MessageView } from '../message';
import { Endpoints, MessageQueue } from '../route';
import { Consumer } from './Consumer';
import { FilterExpression } from './FilterExpression';
import { PushConsumerOptions } from './PushConsumerOptions';
import { PushSubscriptionSettings } from './PushSubscriptionSettings';
import { ProcessQueue } from './ProcessQueue';
import { ConsumeService } from './ConsumeService';
import { StandardConsumeService } from './StandardConsumeService';
import { FifoConsumeService } from './FifoConsumeService';

interface Assignments {
  getAssignmentList(): Assignment[];
}

class Assignment {
  constructor(readonly messageQueue: MessageQueue) {}
}

export class PushConsumer extends Consumer {
  private static readonly ASSIGNMENT_SCAN_SCHEDULE_DELAY = 1000; // 1 second
  private static readonly ASSIGNMENT_SCAN_SCHEDULE_PERIOD = 5000; // 5 seconds

  readonly #subscriptionExpressions = new Map< string, FilterExpression >();
  readonly #messageListener: (messageView: MessageView) => Promise< void >;
  readonly #maxCacheMessageCount: number;
  readonly #maxCacheMessageSizeInBytes: number;
  readonly #pushSubscriptionSettings: PushSubscriptionSettings;
  
  readonly #cacheAssignments = new Map< string, Assignments >();
  readonly #processQueueTable = new Map< string, ProcessQueue >();
  #consumeService?: ConsumeService;
  
  #assignmentScanTimer?: NodeJS.Timeout;
  #receiveMessageCancellationRequested = false;
  #ackMessageCancellationRequested = false;
  #changeInvisibleDurationCancellationRequested = false;
  #forwardToDeadLetterQueueCancellationRequested = false;

  constructor(options: PushConsumerOptions) {
    // Call super with client configuration and consumer group
    super({
      endpoints: options.clientConfiguration.endpoints,
      namespace: options.clientConfiguration.namespace,
      sessionCredentials: options.clientConfiguration.sessionCredentials,
      requestTimeout: options.clientConfiguration.requestTimeout,
      sslEnabled: options.clientConfiguration.sslEnabled,
      consumerGroup: options.consumerGroup,
    });
    
    this.#messageListener = options.messageListener;
    this.#maxCacheMessageCount = options.maxCacheMessageCount ?? 1024;
    this.#maxCacheMessageSizeInBytes = options.maxCacheMessageSizeInBytes ?? 64 * 1024 * 1024; // 64MB
    
    // Copy subscription expressions
    for (const [ topic, filterExpression ] of Object.entries(options.subscriptionExpressions)) {
      this.#subscriptionExpressions.set(topic, filterExpression);
    }
    
    this.#pushSubscriptionSettings = new PushSubscriptionSettings(
      this.namespace,
      this.clientId,
      this.endpoints,
      this.consumerGroup,
      this.requestTimeout,
      this.#subscriptionExpressions,
    );
  }

  async startup(): Promise<void> {
    this.logger.info('Begin to start the rocketmq push consumer, clientId=%s', this.clientId);
    await super.startup();
    this.#consumeService = this.createConsumerService();
    this.scheduleAssignmentsScan();
    this.logger.info('The rocketmq push consumer starts successfully, clientId=%s', this.clientId);
  }

  async shutdown(): Promise<void> {
    this.logger.info('Begin to shutdown the rocketmq push consumer, clientId=%s', this.clientId);
    
    // Cancel all ongoing operations
    this.#receiveMessageCancellationRequested = true;
    this.#ackMessageCancellationRequested = true;
    this.#changeInvisibleDurationCancellationRequested = true;
    this.#forwardToDeadLetterQueueCancellationRequested = true;
    
    if (this.#assignmentScanTimer) {
      clearInterval(this.#assignmentScanTimer);
    }
    
    // Shutdown parent
    await super.shutdown();
    
    this.logger.info('Shutdown the rocketmq push consumer successfully, clientId=%s', this.clientId);
  }

  private createConsumerService(): ConsumeService {
    if (this.#pushSubscriptionSettings.isFifo()) {
      this.logger.info('Create FIFO consume service, consumerGroup=%s, clientId=%s', 
        this.consumerGroup, this.clientId);
      return new FifoConsumeService(this.clientId, this.#messageListener, this.logger);
    }
    
    this.logger.info('Create standard consume service, consumerGroup=%s, clientId=%s', 
      this.consumerGroup, this.clientId);
    return new StandardConsumeService(this.clientId, this.#messageListener, this.logger);
  }



  private scheduleAssignmentsScan(): void {
    this.#assignmentScanTimer = setInterval(() => {
      this.scanAssignments().catch(err => {
        this.logger.error('Failed to scan assignments: %s', err.message);
      });
    }, PushConsumer.ASSIGNMENT_SCAN_SCHEDULE_PERIOD);
    
    // Run the first scan after a delay
    setTimeout(() => {
      this.scanAssignments().catch(err => {
        this.logger.error('Failed to scan assignments: %s', err.message);
      });
    }, PushConsumer.ASSIGNMENT_SCAN_SCHEDULE_DELAY);
  }

  private async scanAssignments(): Promise<void> {
    try {
      this.logger.info('Start to scan assignments periodically, clientId=%s', this.clientId);
      
      for (const [topic, filterExpression] of this.#subscriptionExpressions.entries()) {
        const existed = this.#cacheAssignments.get(topic);
        try {
          const latest = await this.queryAssignment(topic);
          
          if (latest.getAssignmentList().length === 0) {
            if (!existed || existed.getAssignmentList().length === 0) {
              this.logger.info('Acquired empty assignments from remote, would scan later, topic=%s, clientId=%s', 
                topic, this.clientId);
              continue;
            }
            
            this.logger.info('Attention!!! acquired empty assignments from remote, but existed assignments are not empty, topic=%s, clientId=%s',
              topic, this.clientId);
          }
          
          if (!this.equalsAssignments(latest, existed)) {
            this.logger.info('Assignments of topic=%s has changed, clientId=%s', topic, this.clientId);
            this.syncProcessQueue(topic, latest, filterExpression);
            this.#cacheAssignments.set(topic, latest);
            continue;
          }
          
          this.logger.info('Assignments of topic=%s remain the same, clientId=%s', topic, this.clientId);
          // Process queue may be dropped, need to be synchronized anyway.
          this.syncProcessQueue(topic, latest, filterExpression);
        } catch (error) {
          this.logger.error('Exception raised while scanning the assignments, topic=%s, clientId=%s, error=%s', 
            topic, this.clientId, error);
        }
      }
    } catch (error) {
      this.logger.error('Exception raised while scanning the assignments for all topics, clientId=%s, error=%s', 
        this.clientId, error);
    }
  }

  private equalsAssignments(assignments1?: Assignments, assignments2?: Assignments): boolean {
    if (!assignments1 && !assignments2) return true;
    if (!assignments1 || !assignments2) return false;
    
    const list1 = assignments1.getAssignmentList();
    const list2 = assignments2.getAssignmentList();
    
    if (list1.length !== list2.length) return false;
    
    // Simple comparison - in a real implementation you might need a more robust comparison
    return JSON.stringify(list1) === JSON.stringify(list2);
  }

  private syncProcessQueue(topic: string, assignments: Assignments, filterExpression: FilterExpression): void {
    const latest = new Set<string>();
    const assignmentList = assignments.getAssignmentList();
    for (const assignment of assignmentList) {
      latest.add(assignment.messageQueue.queueId.toString());
    }

    const activeMqs = new Set<string>();
    for (const [ mqId, pq ] of this.#processQueueTable.entries()) {
      const mq = pq.getMessageQueue();
      if (topic !== mq.topic) {
        continue;
      }

      if (!latest.has(mqId)) {
        this.logger.info('Drop message queue according to the latest assignment list, mq=%s, clientId=%s',
          mq, this.clientId);
        this.dropProcessQueue(mqId);
        continue;
      }

      if (pq.isExpired()) {
        this.logger.warn('Drop message queue because it is expired, mq=%s, clientId=%s',
          mq, this.clientId);
        this.dropProcessQueue(mqId);
        continue;
      }
      activeMqs.add(mqId);
    }

    for (const assignment of assignmentList) {
      const mqId = assignment.messageQueue.queueId.toString();
      if (activeMqs.has(mqId)) {
        continue;
      }
      const processQueue = this.createProcessQueue(assignment.messageQueue, filterExpression);
      if (processQueue) {
        this.logger.info('Start to fetch message from remote, mq=%s, clientId=%s',
          assignment.messageQueue, this.clientId);
        processQueue.fetchMessageImmediately();
      }
    }
  }

  private async queryAssignment(topic: string): Promise<Assignments> {
    const endpoints = await this.pickEndpointsToQueryAssignments(topic);
    const request = this.wrapQueryAssignmentRequest(topic);
    const response = await this.rpcClientManager.queryAssignment(endpoints, request, this.requestTimeout);
    const status = response.getResponse().getStatus();
    if (status) {
      StatusChecker.check(status.toObject());
    }
    
    const assignmentList = response.getResponse().getAssignmentsList().map(pbAssignment => {
      const mq = new MessageQueue(pbAssignment.getMessageQueue()!);
      return new Assignment(mq);
    });
    
    return {
      getAssignmentList: () => assignmentList,
    };
  }

  private async pickEndpointsToQueryAssignments(topic: string): Promise<Endpoints> {
    const topicRouteData = await this.getRouteData(topic);
    return topicRouteData.pickEndpointsToQueryAssignments();
  }

  private wrapQueryAssignmentRequest(topic: string): QueryAssignmentRequest {
    const topicResource = new Resource();
    topicResource.setResourceNamespace(this.namespace);
    topicResource.setName(topic);
    
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.consumerGroup);
    
    const request = new QueryAssignmentRequest();
    request.setTopic(topicResource);
    request.setGroup(groupResource);
    request.setEndpoints(this.endpoints.toProtobuf());
    return request;
  }

  /**
   * Drops the ProcessQueue by message queue id.
   * @param mqId The message queue id
   */
  private dropProcessQueue(mqId: string): void {
    const processQueue = this.#processQueueTable.get(mqId);
    if (processQueue) {
      processQueue.drop();
      this.#processQueueTable.delete(mqId);
    }
  }

  /**
   * Creates a process queue and adds it into the process queue table.
   * @param mq The message queue
   * @param filterExpression The filter expression of the topic
   * @returns A process queue or null if already exists
   */
  private createProcessQueue(mq: MessageQueue, filterExpression: FilterExpression): ProcessQueue | null {
    if (this.#processQueueTable.has(mq.queueId.toString())) {
      return null;
    }
    
    const processQueue = new ProcessQueue(
      this,
      mq,
      filterExpression,
      this.logger,
      {
        receiveMessageCancelled: () => this.#receiveMessageCancellationRequested,
        ackMessageCancelled: () => this.#ackMessageCancellationRequested,
        changeInvisibleDurationCancelled: () => this.#changeInvisibleDurationCancellationRequested,
        forwardToDeadLetterQueueCancelled: () => this.#forwardToDeadLetterQueueCancellationRequested,
      },
    );
    
    this.#processQueueTable.set(mq.queueId.toString(), processQueue);
    return processQueue;
  }

  async ackMessage(messageView: MessageView): Promise<void> {
    if (!this.isRunning()) {
      throw new Error('Push consumer is not running');
    }

    const request = this.wrapAckMessageRequest(messageView);
    const invocation = await this.rpcClientManager.ackMessage(
      messageView.endpoints, 
      request,
      this.requestTimeout,
    );
    
    const response = invocation.getResponse();
    if (response.getStatus()) {
      StatusChecker.check(response.getStatus()!.toObject());
    }
  }

  protected getTopics(): Iterable<string> {
    return this.#subscriptionExpressions.keys();
  }

  protected wrapHeartbeatRequest(): HeartbeatRequest {
    const request = new HeartbeatRequest();
    request.setClientType(ClientType.PUSH_CONSUMER);
    
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.consumerGroup);
    request.setGroup(groupResource);
    
    return request;
  }

  protected wrapChangeInvisibleDuration(
    messageView: MessageView,
    invisibleDuration: number,
  ): ChangeInvisibleDurationRequest {
    const topicResource = new Resource();
    topicResource.setResourceNamespace(this.namespace);
    topicResource.setName(messageView.topic);
    
    const duration = new Duration();
    duration.setSeconds(Math.floor(invisibleDuration / 1000));
    duration.setNanos((invisibleDuration % 1000) * 1000000);
    
    const request = new ChangeInvisibleDurationRequest();
    request.setTopic(topicResource);
    
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.consumerGroup);
    request.setGroup(groupResource);
    
    request.setReceiptHandle(messageView.receiptHandle);
    request.setInvisibleDuration(duration);
    request.setMessageId(messageView.messageId);
    return request;
  }

  protected wrapAckMessageRequest(messageView: MessageView): AckMessageRequest {
    const topicResource = new Resource();
    topicResource.setResourceNamespace(this.namespace);
    topicResource.setName(messageView.topic);
    
    const entry = new AckMessageEntry();
    entry.setMessageId(messageView.messageId);
    entry.setReceiptHandle(messageView.receiptHandle);
    
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.consumerGroup);
    
    const request = new AckMessageRequest();
    request.setGroup(groupResource);
    request.setTopic(topicResource);
    request.addEntries(entry);
    return request;
  }

  protected wrapForwardMessageToDeadLetterQueueRequest(messageView: MessageView): ForwardMessageToDeadLetterQueueRequest {
    const topicResource = new Resource();
    topicResource.setResourceNamespace(this.namespace);
    topicResource.setName(messageView.topic);
    
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.consumerGroup);
    
    const request = new ForwardMessageToDeadLetterQueueRequest();
    request.setGroup(groupResource);
    request.setTopic(topicResource);
    request.setReceiptHandle(messageView.receiptHandle);
    request.setMessageId(messageView.messageId);
    request.setDeliveryAttempt(messageView.deliveryAttempt ?? 0);
    const retryPolicy = this.getRetryPolicy();
    request.setMaxDeliveryAttempts(retryPolicy ? retryPolicy.getMaxAttempts() : 0);
    return request;
  }

  protected onTopicRouteDataUpdated0(topic: string, topicRouteData: any): void {
    // Implementation can be added if needed
  }

  public onVerifyMessageCommand(endpoints: Endpoints, command: VerifyMessageCommand): void {
    // Handle message verification command from server
    const nonce = command.getNonce();
    // In a real implementation, you would extract the message and pass it to the consume service
    // For now, we'll just send a mock response
    /*
    const verifyMessageResult = new VerifyMessageResult();
    verifyMessageResult.setNonce(nonce);
    
    const status = new apache.rocketmq.v2.Status();
    status.setCode(apache.rocketmq.v2.Code.OK); // or FAILED_TO_CONSUME_MESSAGE
    
    const telemetryCommand = new TelemetryCommand();
    telemetryCommand.setVerifyMessageResult(verifyMessageResult);
    telemetryCommand.setStatus(status);
    
    // Send response back to server
    // this.telemetry(endpoints, telemetryCommand);
    */
  }

  protected wrapNotifyClientTerminationRequest(): NotifyClientTerminationRequest {
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.consumerGroup);
    
    const request = new NotifyClientTerminationRequest();
    request.setGroup(groupResource);
    return request;
  }

  private getQueueSize(): number {
    return this.#processQueueTable.size;
  }

  private cacheMessageBytesThresholdPerQueue(): number {
    const size = this.getQueueSize();
    // All process queues are removed, no need to cache messages.
    return size <= 0 ? 0 : Math.max(1, Math.floor(this.#maxCacheMessageSizeInBytes / size));
  }

  private cacheMessageCountThresholdPerQueue(): number {
    const size = this.getQueueSize();
    // All process queues are removed, no need to cache messages.
    if (size <= 0) {
      return 0;
    }

    return Math.max(1, Math.floor(this.#maxCacheMessageCount / size));
  }

  protected getSettings() {
    return this.#pushSubscriptionSettings;
  }

  /**
   * Gets the load balancing group for the consumer.
   */
  getConsumerGroup(): string {
    return this.consumerGroup;
  }

  getPushConsumerSettings(): PushSubscriptionSettings {
    return this.#pushSubscriptionSettings;
  }

  /**
   * Lists the existing subscription expressions in the push consumer.
   */
  getSubscriptionExpressions(): Map<string, FilterExpression> {
    return new Map(this.#subscriptionExpressions);
  }

  private getRetryPolicy() {
    return this.#pushSubscriptionSettings.getRetryPolicy();
  }

  getConsumeService(): ConsumeService | undefined {
    return this.#consumeService;
  }

  /**
   * Add subscription expression dynamically.
   * @param topic The topic to subscribe
   * @param filterExpression The filter expression
   * @returns Push consumer instance
   */
  async subscribe(topic: string, filterExpression: FilterExpression): Promise<PushConsumer> {
    if (!this.isRunning()) {
      throw new Error('Push consumer is not running');
    }

    await this.getRouteData(topic);
    this.#subscriptionExpressions.set(topic, filterExpression);
    return this;
  }

  /**
   * Remove subscription expression dynamically by topic.
   * It stops the backend task to fetch messages from the server, and besides that, 
   * the locally cached message whose topic was removed before would not be delivered 
   * to MessageListener anymore.
   * Nothing occurs if the specified topic does not exist in subscription expressions of the push consumer.
   * @param topic The topic to remove the subscription
   * @returns Push consumer instance
   */
  async unsubscribe(topic: string): Promise<PushConsumer> {
    if (!this.isRunning()) {
      throw new Error('Push consumer is not running');
    }

    this.#subscriptionExpressions.delete(topic);
    return this;
  }

  /**
   * Internal method to add subscription expression dynamically.
   * @param topic The topic to subscribe
   * @param filterExpression The filter expression
   */
  async addSubscription(topic: string, filterExpression: FilterExpression): Promise<void> {
    if (!this.isRunning()) {
      throw new Error('Push consumer is not running');
    }

    await this.getRouteData(topic);
    this.#subscriptionExpressions.set(topic, filterExpression);
  }

  /**
   * Internal method to remove subscription expression dynamically by topic.
   * @param topic The topic to unsubscribe
   */
  removeSubscription(topic: string): void {
    if (!this.isRunning()) {
      throw new Error('Push consumer is not running');
    }

    this.#subscriptionExpressions.delete(topic);
  }

  /**
   * Close the push consumer and release all related resources.
   * Once push consumer is closed, it could not be started once again.
   * We maintained an FSM (finite-state machine) to record the different states for each push consumer.
   */
  async close(): Promise<void> {
    await this.shutdown();
  }
}