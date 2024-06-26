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

import { ClientType, Settings as SettingsPB } from '../../proto/apache/rocketmq/v2/definition_pb';
import { Endpoints } from '../route/Endpoints';
import { RetryPolicy } from '../retry';

export abstract class Settings {
  protected readonly namespace: string;
  protected readonly clientId: string;
  protected readonly clientType: ClientType;
  protected readonly accessPoint: Endpoints;
  protected retryPolicy?: RetryPolicy;
  protected readonly requestTimeout: number;

  constructor(namespace: string, clientId: string, clientType: ClientType, accessPoint: Endpoints, requestTimeout: number, retryPolicy?: RetryPolicy) {
    this.clientId = clientId;
    this.namespace = namespace;
    this.clientType = clientType;
    this.accessPoint = accessPoint;
    this.retryPolicy = retryPolicy;
    this.requestTimeout = requestTimeout;
  }

  abstract toProtobuf(): SettingsPB;

  abstract sync(settings: SettingsPB): void;

  getRetryPolicy() {
    return this.retryPolicy;
  }
}
