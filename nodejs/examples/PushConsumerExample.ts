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

import { ClientConfiguration, SessionCredentials } from '../src/client';
import { FilterExpression, MessageListener, PushConsumerBuilder } from '../src/consumer';
import { MessageView } from '../src/message';
import { FilterType } from '../src/proto/apache/rocketmq/v2/definition_pb';

async function example() {
  // Create client configuration
  const clientConfiguration = new ClientConfiguration({
    endpoints: 'localhost:8081', // Replace with your actual endpoints
    namespace: 'your-namespace', // Replace with your namespace
    sessionCredentials: new SessionCredentials('your-access-key', 'your-secret-key', 'your-security-token'),
    requestTimeout: 3000,
    sslEnabled: false,
  });

  // Create filter expressions for subscription
  const subscriptionExpressions = {
    'your-topic': new FilterExpression('your-tag', FilterType.TAG),
  };

  // Create message listener
  const messageListener: MessageListener = async (messageView: MessageView) => {
    console.log(`Received message: ${messageView.messageId}, body: ${messageView.body.toString()}`);
    // Process the message
    // Ack the message after processing
  };

  try {
    // Create push consumer using builder
    const consumer = await new PushConsumerBuilder()
      .setClientConfiguration(clientConfiguration)
      .setConsumerGroup('your-consumer-group')
      .setSubscriptionExpressions(subscriptionExpressions)
      .setMessageListener(messageListener)
      .setMaxCacheMessageCount(1000)
      .setMaxCacheMessageSizeInBytes(64 * 1024 * 1024) // 64MB
      .setConsumptionThreadCount(20)
      .build();

    console.log('Push consumer started successfully');

    // You can dynamically subscribe/unsubscribe
    await consumer.subscribe('another-topic', new FilterExpression('another-tag', FilterType.TAG));
    await consumer.unsubscribe('another-topic');

    // Get consumer group
    console.log(`Consumer group: ${consumer.getConsumerGroup()}`);

    // Get subscription expressions
    const expressions = consumer.getSubscriptionExpressions();
    console.log(`Subscribed to ${expressions.size} topics`);

    // Gracefully shutdown when needed
    // await consumer.close();
  } catch (error) {
    console.error('Error creating push consumer:', error);
  }
}

// Run the example
example().catch(console.error);