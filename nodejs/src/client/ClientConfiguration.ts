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

import { SessionCredentials } from './SessionCredentials';

export interface ClientConfigurationOptions {
  endpoints: string;
  sessionCredentials?: SessionCredentials;
  requestTimeout?: number;
  sslEnabled?: boolean;
  namespace?: string;
  maxStartupAttempts?: number;
}

export class ClientConfiguration {
  readonly endpoints: string;
  readonly sessionCredentials?: SessionCredentials;
  readonly requestTimeout: number;
  readonly sslEnabled: boolean;
  readonly namespace: string;
  readonly maxStartupAttempts: number;

  constructor(options: ClientConfigurationOptions) {
    this.endpoints = options.endpoints;
    this.sessionCredentials = options.sessionCredentials;
    this.requestTimeout = options.requestTimeout ?? 3000; // default 3 seconds
    this.sslEnabled = options.sslEnabled ?? false;
    this.namespace = options.namespace ?? '';
    this.maxStartupAttempts = options.maxStartupAttempts ?? 3;
  }

  static newBuilder(): ClientConfigurationBuilder {
    return new ClientConfigurationBuilder();
  }
}

export class ClientConfigurationBuilder {
  private endpoints?: string;
  private sessionCredentials?: SessionCredentials;
  private requestTimeout?: number;
  private sslEnabled: boolean = false;
  private namespace?: string;
  private maxStartupAttempts: number = 3;

  setEndpoints(endpoints: string): ClientConfigurationBuilder {
    this.endpoints = endpoints;
    return this;
  }

  setSessionCredentials(sessionCredentials: SessionCredentials): ClientConfigurationBuilder {
    this.sessionCredentials = sessionCredentials;
    return this;
  }

  setRequestTimeout(requestTimeout: number): ClientConfigurationBuilder {
    this.requestTimeout = requestTimeout;
    return this;
  }

  setSslEnabled(sslEnabled: boolean): ClientConfigurationBuilder {
    this.sslEnabled = sslEnabled;
    return this;
  }

  setNamespace(namespace: string): ClientConfigurationBuilder {
    this.namespace = namespace;
    return this;
  }

  setMaxStartupAttempts(maxStartupAttempts: number): ClientConfigurationBuilder {
    this.maxStartupAttempts = maxStartupAttempts;
    return this;
  }

  build(): ClientConfiguration {
    if (!this.endpoints) {
      throw new Error('Endpoints is required');
    }

    return new ClientConfiguration({
      endpoints: this.endpoints,
      sessionCredentials: this.sessionCredentials,
      requestTimeout: this.requestTimeout,
      sslEnabled: this.sslEnabled,
      namespace: this.namespace,
      maxStartupAttempts: this.maxStartupAttempts,
    });
  }
}