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
import { ClientType, Resource, Settings as SettingsPB } from '../../proto/apache/rocketmq/v2/definition_pb';
import { Subscription, SubscriptionEntry } from '../../proto/apache/rocketmq/v2/service_pb';
import { FilterExpression } from './FilterExpression';
import { Settings } from '../client/Settings';
import { Endpoints } from '../route';

export class PushSubscriptionSettings extends Settings {
  private fifo = false;
  private receiveBatchSize = 32;
  private longPollingTimeout = 30000; // 30 seconds in milliseconds
  private readonly groupName: string;
  private readonly subscriptionExpressions: Map<string, FilterExpression>;

  constructor(
    namespace: string,
    clientId: string,
    endpoints: Endpoints,
    groupName: string,
    requestTimeout: number,
    subscriptionExpressions: Map<string, FilterExpression>,
  ) {
    super(namespace, clientId, ClientType.PUSH_CONSUMER, endpoints, requestTimeout);
    this.groupName = groupName;
    this.subscriptionExpressions = subscriptionExpressions;
  }

  isFifo(): boolean {
    return this.fifo;
  }

  getReceiveBatchSize(): number {
    return this.receiveBatchSize;
  }

  getLongPollingTimeout(): number {
    return this.longPollingTimeout;
  }

  toProtobuf(): SettingsPB {
    const settings = new SettingsPB();
    settings.setAccessPoint(this.accessPoint.toProtobuf());
    settings.setClientType(this.clientType);
    
    const duration = new Duration();
    duration.setSeconds(Math.floor(this.requestTimeout / 1000));
    settings.setRequestTimeout(duration);
    
    // Add subscription settings
    const subscriptionEntries: SubscriptionEntry[] = [ ];
    for (const [ topic, filterExpression ] of this.subscriptionExpressions.entries()) {
      const topicResource = new Resource();
      topicResource.setResourceNamespace(this.namespace);
      topicResource.setName(topic);
      
      const expression = new FilterExpressionPB();
      expression.setExpression(filterExpression.expression);
      expression.setType(filterExpression.filterType);
      
      const subscriptionEntry = new SubscriptionEntry();
      subscriptionEntry.setTopic(topicResource);
      subscriptionEntry.setExpression(expression);
      subscriptionEntries.push(subscriptionEntry);
    }
    
    const subscription = new Subscription();
    const groupResource = new Resource();
    groupResource.setResourceNamespace(this.namespace);
    groupResource.setName(this.groupName);
    subscription.setGroup(groupResource);
    subscription.setSubscriptionsList(subscriptionEntries);
    subscription.setFifo(this.fifo);
    subscription.setReceiveBatchSize(this.receiveBatchSize);
    
    const longPollingTimeoutDuration = new Duration();
    longPollingTimeoutDuration.setSeconds(Math.floor(this.longPollingTimeout / 1000));
    subscription.setLongPollingTimeout(longPollingTimeoutDuration);
    
    settings.setSubscription(subscription);
    return settings;
  }

  sync(settings: SettingsPB): void {

    // Implementation for syncing settings from server
    // This would typically update local settings based on server response
    const subscription = settings.getSubscription();
    if (subscription) {
      this.fifo = subscription.getFifo();
      this.receiveBatchSize = subscription.getReceiveBatchSize();
      
      const longPollingTimeout = subscription.getLongPollingTimeout();
      if (longPollingTimeout) {
        this.longPollingTimeout = longPollingTimeout.getSeconds() * 1000 + 
                                  Math.floor(longPollingTimeout.getNanos() / 1000000);
      }
    }
  }
}