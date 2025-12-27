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

import { ILogger } from '../client';
import { MessageView } from '../message';
import { ConsumeService } from './ConsumeService';

export class FifoConsumeService implements ConsumeService {
  constructor(
    private readonly clientId: string,
    private readonly messageListener: (messageView: MessageView) => Promise< void >,
    private readonly logger: ILogger,
  ) { }

  async consume(messageView: MessageView): Promise< void > {
    try {
      this.logger.info('FIFO consume message, clientId=%s, messageId=%s, messageGroup=%s',
        this.clientId, messageView.messageId, messageView.messageGroup);
      await this.messageListener(messageView);
    } catch (error) {
      this.logger.error('Failed to consume FIFO message, clientId=%s, messageId=%s, messageGroup=%s, error=%s',
        this.clientId, messageView.messageId, messageView.messageGroup, error);
      throw error;
    }
  }
}
