// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: rocketmq.proto

package org.apache.rocketmq.proto;

public interface UpdateConsumerOffsetRequestOrBuilder extends
    // @@protoc_insertion_point(interface_extends:rocketmq.rpc.api.UpdateConsumerOffsetRequest)
    com.google.protobuf.MessageOrBuilder {

  /**
   * <code>string broker_name = 1;</code>
   * @return The brokerName.
   */
  java.lang.String getBrokerName();
  /**
   * <code>string broker_name = 1;</code>
   * @return The bytes for brokerName.
   */
  com.google.protobuf.ByteString
      getBrokerNameBytes();

  /**
   * <code>string topic = 2;</code>
   * @return The topic.
   */
  java.lang.String getTopic();
  /**
   * <code>string topic = 2;</code>
   * @return The bytes for topic.
   */
  com.google.protobuf.ByteString
      getTopicBytes();

  /**
   * <code>string consumer_group = 3;</code>
   * @return The consumerGroup.
   */
  java.lang.String getConsumerGroup();
  /**
   * <code>string consumer_group = 3;</code>
   * @return The bytes for consumerGroup.
   */
  com.google.protobuf.ByteString
      getConsumerGroupBytes();

  /**
   * <code>int32 queue_id = 4;</code>
   * @return The queueId.
   */
  int getQueueId();

  /**
   * <code>int64 commit_offset = 5;</code>
   * @return The commitOffset.
   */
  long getCommitOffset();

  /**
   * <pre>
   * For case of broadcasting
   * </pre>
   *
   * <code>string client_id = 6;</code>
   * @return The clientId.
   */
  java.lang.String getClientId();
  /**
   * <pre>
   * For case of broadcasting
   * </pre>
   *
   * <code>string client_id = 6;</code>
   * @return The bytes for clientId.
   */
  com.google.protobuf.ByteString
      getClientIdBytes();
}
