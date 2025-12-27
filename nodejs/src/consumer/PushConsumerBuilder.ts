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

import { ClientConfiguration } from '../client';
import { FilterExpression } from './FilterExpression';
import { MessageListener } from './MessageListener';
import { PushConsumer } from './PushConsumer';
import { PushConsumerOptions } from './PushConsumerOptions';

export interface PushConsumerBuilderInterface {
  /**
   * Set the client configuration for the consumer.
   * @param clientConfiguration client's configuration.
   * @returns the consumer builder instance.
   */
  setClientConfiguration(clientConfiguration: ClientConfiguration): PushConsumerBuilderInterface;

  /**
   * Set the load balancing group for the consumer.
   * @param consumerGroup consumer load balancing group.
   * @returns the consumer builder instance.
   */
  setConsumerGroup(consumerGroup: string): PushConsumerBuilderInterface;

  /**
   * Add FilterExpression for consumer.
   * @param subscriptionExpressions subscriptions to add.
   * @returns the consumer builder instance.
   */
  setSubscriptionExpressions(subscriptionExpressions: Record<string, FilterExpression>): PushConsumerBuilderInterface;

  /**
   * Register message listener, all messages meet the subscription expression would across listener here.
   * @param listener message listener.
   * @returns the consumer builder instance.
   */
  setMessageListener(listener: MessageListener): PushConsumerBuilderInterface;

  /**
   * Set the maximum number of messages cached locally.
   * @param count message count.
   * @returns the consumer builder instance.
   */
  setMaxCacheMessageCount(count: number): PushConsumerBuilderInterface;

  /**
   * Set the maximum bytes of messages cached locally.
   * @param bytes message size.
   * @returns the consumer builder instance.
   */
  setMaxCacheMessageSizeInBytes(bytes: number): PushConsumerBuilderInterface;

  /**
   * Set the consumption thread count in parallel.
   * @param count thread count.
   * @returns the consumer builder instance.
   */
  setConsumptionThreadCount(count: number): PushConsumerBuilderInterface;

  /**
   * Set enable fifo consume accelerator. If enabled, the consumer will consume messages in parallel by messageGroup,
   * it may increase the probability of repeatedly consuming the same message.
   * @param enableFifoConsumeAccelerator enable fifo parallel processing.
   * @returns the consumer builder instance.
   */
  setEnableFifoConsumeAccelerator(enableFifoConsumeAccelerator: boolean): PushConsumerBuilderInterface;

  /**
   * Enable or disable message interceptor filtering functionality.
   * When enabled, it supports client-side message filtering by message interceptors.
   * @param enableMessageInterceptorFiltering whether to enable message interceptor filtering
   * @returns the consumer builder instance.
   */
  setEnableMessageInterceptorFiltering(enableMessageInterceptorFiltering: boolean): PushConsumerBuilderInterface;

  /**
   * Finalize the build of PushConsumer and start.
   * This method will block until the push consumer starts successfully.
   * Especially, if this method is invoked more than once, different push consumers will be created and started.
   * @returns the push consumer instance.
   */
  build(): Promise<PushConsumer>;
}

export class PushConsumerBuilder implements PushConsumerBuilderInterface {
  private clientConfiguration?: ClientConfiguration;
  private consumerGroup?: string;
  private subscriptionExpressions: Record<string, FilterExpression> = {};
  private messageListener?: MessageListener;
  private maxCacheMessageCount?: number;
  private maxCacheMessageSizeInBytes?: number;
  private consumptionThreadCount?: number;
  private enableFifoConsumeAccelerator: boolean = false;
  private enableMessageInterceptorFiltering: boolean = false;

  setClientConfiguration(clientConfiguration: ClientConfiguration): PushConsumerBuilderInterface {
    this.clientConfiguration = clientConfiguration;
    return this;
  }

  setConsumerGroup(consumerGroup: string): PushConsumerBuilderInterface {
    this.consumerGroup = consumerGroup;
    return this;
  }

  setSubscriptionExpressions(subscriptionExpressions: Record<string, FilterExpression>): PushConsumerBuilderInterface {
    this.subscriptionExpressions = { ...subscriptionExpressions };
    return this;
  }

  setMessageListener(listener: MessageListener): PushConsumerBuilderInterface {
    this.messageListener = listener;
    return this;
  }

  setMaxCacheMessageCount(count: number): PushConsumerBuilderInterface {
    this.maxCacheMessageCount = count;
    return this;
  }

  setMaxCacheMessageSizeInBytes(bytes: number): PushConsumerBuilderInterface {
    this.maxCacheMessageSizeInBytes = bytes;
    return this;
  }

  setConsumptionThreadCount(count: number): PushConsumerBuilderInterface {
    this.consumptionThreadCount = count;
    return this;
  }

  setEnableFifoConsumeAccelerator(enableFifoConsumeAccelerator: boolean): PushConsumerBuilderInterface {
    this.enableFifoConsumeAccelerator = enableFifoConsumeAccelerator;
    return this;
  }

  setEnableMessageInterceptorFiltering(enableMessageInterceptorFiltering: boolean): PushConsumerBuilderInterface {
    this.enableMessageInterceptorFiltering = enableMessageInterceptorFiltering;
    return this;
  }

  async build(): Promise<PushConsumer> {
    if (!this.clientConfiguration) {
      throw new Error('Client configuration is required');
    }
    if (!this.consumerGroup) {
      throw new Error('Consumer group is required');
    }
    if (!this.messageListener) {
      throw new Error('Message listener is required');
    }

    const options: PushConsumerOptions = {
      clientConfiguration: this.clientConfiguration,
      consumerGroup: this.consumerGroup,
      subscriptionExpressions: this.subscriptionExpressions,
      messageListener: this.messageListener,
      maxCacheMessageCount: this.maxCacheMessageCount,
      maxCacheMessageSizeInBytes: this.maxCacheMessageSizeInBytes,
      consumptionThreadCount: this.consumptionThreadCount,
    };

    const consumer = new PushConsumer(options);
    await consumer.startup();
    return consumer;
  }
}