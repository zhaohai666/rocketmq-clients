# Thin Client for Apache RocketMQ

[![构建状态]( http://aone-api.alibaba-inc.com/ak/testservice/api/badge/query?pipelineId=2898551&type=构建状态)](https://aone.alibaba-inc.com/pipeline/build/info?id=2898551)

## Getting Started

Add dependency to your `pom.xml`, and replace the `${rocketmq.version}` by the latest version.

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-thin-client-shaded</artifactId>
    <version>${rocketmq.version}</version>
</dependency>
```

You may need a shaded client in most case, but we also provided the no-shaded client.

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-thin-client</artifactId>
    <!-- What you should pay extra attention to is that
         the no-shaded client depends on a no-shaded slf4j,
         which may clash with other project.-->
    <version>${rocketmq.version}</version>
</dependency>
```

We provide the simplest demo to help you to quick start, please refer to the `rocketmq-example` module.

## Introduction

The current repository is a thin SDK for rocketmq based on [gRPC](https://grpc.io/), which replaces the communication
layer of the fat SDK.

## Requirements

<table>
  <tr>
    <td><b>Build required:</b></td>
    <td><b>Java 11 or later</b></td>
  </tr>
  <tr>
    <td><b>Runtime required:</b></td>
    <td><b>Java 6 or later</b></td>
  </tr>
</table>

## Build

The latest thin SDK support Java6 or higher. In order to achieve this goal, we customize gRPC and Protocol Buffer, it
could be referred below:

* [Customized gRPC](http://gitlab.alibaba-inc.com/rocketmq-client/grpc-java)
* [Customized Protocol Buffer](http://gitlab.alibaba-inc.com/rocketmq-client/protobuf)
* [Customized openTelemetry](http://gitlab.alibaba-inc.com/rocketmq-client/opentelemetry-java)

We have shaded and deployed all customized third-party jars to inner maven repository of Alibaba group, refer to:

* [Rocketmq deps](http://gitlab.alibaba-inc.com/rocketmq-client/rocketmq-java-deps)

Now you can compile the project by executing the script below:

```bash
mvn clean package
```

Sometimes you may need to release a version whose bytecode version is 52.0 (Java 8), please add `-P mustang-forbidden`
in your command.

## About logging system

We use logback as our logging system and redirect log of gRPC to logback as well.

To prevent the clash of configuration file while both of rocketmq client and standard logback is introduced in the same
project, we shaded a new logback, which using `rocketmq.logback.xml/rocketmq.logback-test.xml/rocketmq.logback.groovy`
instead of `logback.xml/logback-test.xml/logback.groovy` as its configuration file.

## License

[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) Copyright (C) Apache Software Foundation

## CI/CD