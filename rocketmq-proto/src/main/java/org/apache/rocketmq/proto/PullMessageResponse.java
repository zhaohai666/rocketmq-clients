// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: rocketmq.proto

package org.apache.rocketmq.proto;

/**
 * Protobuf type {@code rocketmq.rpc.api.PullMessageResponse}
 */
public final class PullMessageResponse extends
    com.google.protobuf.GeneratedMessageV3 implements
    // @@protoc_insertion_point(message_implements:rocketmq.rpc.api.PullMessageResponse)
    PullMessageResponseOrBuilder {
private static final long serialVersionUID = 0L;
  // Use PullMessageResponse.newBuilder() to construct.
  private PullMessageResponse(com.google.protobuf.GeneratedMessageV3.Builder<?> builder) {
    super(builder);
  }
  private PullMessageResponse() {
    messages_ = java.util.Collections.emptyList();
  }

  @java.lang.Override
  @SuppressWarnings({"unused"})
  protected java.lang.Object newInstance(
      UnusedPrivateParameter unused) {
    return new PullMessageResponse();
  }

  @java.lang.Override
  public final com.google.protobuf.UnknownFieldSet
  getUnknownFields() {
    return this.unknownFields;
  }
  private PullMessageResponse(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    this();
    if (extensionRegistry == null) {
      throw new java.lang.NullPointerException();
    }
    int mutable_bitField0_ = 0;
    com.google.protobuf.UnknownFieldSet.Builder unknownFields =
        com.google.protobuf.UnknownFieldSet.newBuilder();
    try {
      boolean done = false;
      while (!done) {
        int tag = input.readTag();
        switch (tag) {
          case 0:
            done = true;
            break;
          case 8: {

            suggestBrokerId_ = input.readInt64();
            break;
          }
          case 16: {

            nextBeginOffset_ = input.readInt64();
            break;
          }
          case 24: {

            minOffset_ = input.readInt64();
            break;
          }
          case 32: {

            maxOffset_ = input.readInt64();
            break;
          }
          case 42: {
            if (!((mutable_bitField0_ & 0x00000001) != 0)) {
              messages_ = new java.util.ArrayList<org.apache.rocketmq.proto.MessageExt>();
              mutable_bitField0_ |= 0x00000001;
            }
            messages_.add(
                input.readMessage(org.apache.rocketmq.proto.MessageExt.parser(), extensionRegistry));
            break;
          }
          default: {
            if (!parseUnknownField(
                input, unknownFields, extensionRegistry, tag)) {
              done = true;
            }
            break;
          }
        }
      }
    } catch (com.google.protobuf.InvalidProtocolBufferException e) {
      throw e.setUnfinishedMessage(this);
    } catch (java.io.IOException e) {
      throw new com.google.protobuf.InvalidProtocolBufferException(
          e).setUnfinishedMessage(this);
    } finally {
      if (((mutable_bitField0_ & 0x00000001) != 0)) {
        messages_ = java.util.Collections.unmodifiableList(messages_);
      }
      this.unknownFields = unknownFields.build();
      makeExtensionsImmutable();
    }
  }
  public static final com.google.protobuf.Descriptors.Descriptor
      getDescriptor() {
    return org.apache.rocketmq.proto.ACS.internal_static_rocketmq_rpc_api_PullMessageResponse_descriptor;
  }

  @java.lang.Override
  protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internalGetFieldAccessorTable() {
    return org.apache.rocketmq.proto.ACS.internal_static_rocketmq_rpc_api_PullMessageResponse_fieldAccessorTable
        .ensureFieldAccessorsInitialized(
            org.apache.rocketmq.proto.PullMessageResponse.class, org.apache.rocketmq.proto.PullMessageResponse.Builder.class);
  }

  public static final int SUGGEST_BROKER_ID_FIELD_NUMBER = 1;
  private long suggestBrokerId_;
  /**
   * <code>int64 suggest_broker_id = 1;</code>
   * @return The suggestBrokerId.
   */
  @java.lang.Override
  public long getSuggestBrokerId() {
    return suggestBrokerId_;
  }

  public static final int NEXT_BEGIN_OFFSET_FIELD_NUMBER = 2;
  private long nextBeginOffset_;
  /**
   * <code>int64 next_begin_offset = 2;</code>
   * @return The nextBeginOffset.
   */
  @java.lang.Override
  public long getNextBeginOffset() {
    return nextBeginOffset_;
  }

  public static final int MIN_OFFSET_FIELD_NUMBER = 3;
  private long minOffset_;
  /**
   * <code>int64 min_offset = 3;</code>
   * @return The minOffset.
   */
  @java.lang.Override
  public long getMinOffset() {
    return minOffset_;
  }

  public static final int MAX_OFFSET_FIELD_NUMBER = 4;
  private long maxOffset_;
  /**
   * <code>int64 max_offset = 4;</code>
   * @return The maxOffset.
   */
  @java.lang.Override
  public long getMaxOffset() {
    return maxOffset_;
  }

  public static final int MESSAGES_FIELD_NUMBER = 5;
  private java.util.List<org.apache.rocketmq.proto.MessageExt> messages_;
  /**
   * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
   */
  @java.lang.Override
  public java.util.List<org.apache.rocketmq.proto.MessageExt> getMessagesList() {
    return messages_;
  }
  /**
   * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
   */
  @java.lang.Override
  public java.util.List<? extends org.apache.rocketmq.proto.MessageExtOrBuilder> 
      getMessagesOrBuilderList() {
    return messages_;
  }
  /**
   * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
   */
  @java.lang.Override
  public int getMessagesCount() {
    return messages_.size();
  }
  /**
   * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
   */
  @java.lang.Override
  public org.apache.rocketmq.proto.MessageExt getMessages(int index) {
    return messages_.get(index);
  }
  /**
   * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
   */
  @java.lang.Override
  public org.apache.rocketmq.proto.MessageExtOrBuilder getMessagesOrBuilder(
      int index) {
    return messages_.get(index);
  }

  private byte memoizedIsInitialized = -1;
  @java.lang.Override
  public final boolean isInitialized() {
    byte isInitialized = memoizedIsInitialized;
    if (isInitialized == 1) return true;
    if (isInitialized == 0) return false;

    memoizedIsInitialized = 1;
    return true;
  }

  @java.lang.Override
  public void writeTo(com.google.protobuf.CodedOutputStream output)
                      throws java.io.IOException {
    if (suggestBrokerId_ != 0L) {
      output.writeInt64(1, suggestBrokerId_);
    }
    if (nextBeginOffset_ != 0L) {
      output.writeInt64(2, nextBeginOffset_);
    }
    if (minOffset_ != 0L) {
      output.writeInt64(3, minOffset_);
    }
    if (maxOffset_ != 0L) {
      output.writeInt64(4, maxOffset_);
    }
    for (int i = 0; i < messages_.size(); i++) {
      output.writeMessage(5, messages_.get(i));
    }
    unknownFields.writeTo(output);
  }

  @java.lang.Override
  public int getSerializedSize() {
    int size = memoizedSize;
    if (size != -1) return size;

    size = 0;
    if (suggestBrokerId_ != 0L) {
      size += com.google.protobuf.CodedOutputStream
        .computeInt64Size(1, suggestBrokerId_);
    }
    if (nextBeginOffset_ != 0L) {
      size += com.google.protobuf.CodedOutputStream
        .computeInt64Size(2, nextBeginOffset_);
    }
    if (minOffset_ != 0L) {
      size += com.google.protobuf.CodedOutputStream
        .computeInt64Size(3, minOffset_);
    }
    if (maxOffset_ != 0L) {
      size += com.google.protobuf.CodedOutputStream
        .computeInt64Size(4, maxOffset_);
    }
    for (int i = 0; i < messages_.size(); i++) {
      size += com.google.protobuf.CodedOutputStream
        .computeMessageSize(5, messages_.get(i));
    }
    size += unknownFields.getSerializedSize();
    memoizedSize = size;
    return size;
  }

  @java.lang.Override
  public boolean equals(final java.lang.Object obj) {
    if (obj == this) {
     return true;
    }
    if (!(obj instanceof org.apache.rocketmq.proto.PullMessageResponse)) {
      return super.equals(obj);
    }
    org.apache.rocketmq.proto.PullMessageResponse other = (org.apache.rocketmq.proto.PullMessageResponse) obj;

    if (getSuggestBrokerId()
        != other.getSuggestBrokerId()) return false;
    if (getNextBeginOffset()
        != other.getNextBeginOffset()) return false;
    if (getMinOffset()
        != other.getMinOffset()) return false;
    if (getMaxOffset()
        != other.getMaxOffset()) return false;
    if (!getMessagesList()
        .equals(other.getMessagesList())) return false;
    if (!unknownFields.equals(other.unknownFields)) return false;
    return true;
  }

  @java.lang.Override
  public int hashCode() {
    if (memoizedHashCode != 0) {
      return memoizedHashCode;
    }
    int hash = 41;
    hash = (19 * hash) + getDescriptor().hashCode();
    hash = (37 * hash) + SUGGEST_BROKER_ID_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashLong(
        getSuggestBrokerId());
    hash = (37 * hash) + NEXT_BEGIN_OFFSET_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashLong(
        getNextBeginOffset());
    hash = (37 * hash) + MIN_OFFSET_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashLong(
        getMinOffset());
    hash = (37 * hash) + MAX_OFFSET_FIELD_NUMBER;
    hash = (53 * hash) + com.google.protobuf.Internal.hashLong(
        getMaxOffset());
    if (getMessagesCount() > 0) {
      hash = (37 * hash) + MESSAGES_FIELD_NUMBER;
      hash = (53 * hash) + getMessagesList().hashCode();
    }
    hash = (29 * hash) + unknownFields.hashCode();
    memoizedHashCode = hash;
    return hash;
  }

  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      java.nio.ByteBuffer data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      java.nio.ByteBuffer data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      com.google.protobuf.ByteString data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      com.google.protobuf.ByteString data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(byte[] data)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      byte[] data,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws com.google.protobuf.InvalidProtocolBufferException {
    return PARSER.parseFrom(data, extensionRegistry);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseDelimitedFrom(java.io.InputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseDelimitedFrom(
      java.io.InputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseDelimitedWithIOException(PARSER, input, extensionRegistry);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      com.google.protobuf.CodedInputStream input)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input);
  }
  public static org.apache.rocketmq.proto.PullMessageResponse parseFrom(
      com.google.protobuf.CodedInputStream input,
      com.google.protobuf.ExtensionRegistryLite extensionRegistry)
      throws java.io.IOException {
    return com.google.protobuf.GeneratedMessageV3
        .parseWithIOException(PARSER, input, extensionRegistry);
  }

  @java.lang.Override
  public Builder newBuilderForType() { return newBuilder(); }
  public static Builder newBuilder() {
    return DEFAULT_INSTANCE.toBuilder();
  }
  public static Builder newBuilder(org.apache.rocketmq.proto.PullMessageResponse prototype) {
    return DEFAULT_INSTANCE.toBuilder().mergeFrom(prototype);
  }
  @java.lang.Override
  public Builder toBuilder() {
    return this == DEFAULT_INSTANCE
        ? new Builder() : new Builder().mergeFrom(this);
  }

  @java.lang.Override
  protected Builder newBuilderForType(
      com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
    Builder builder = new Builder(parent);
    return builder;
  }
  /**
   * Protobuf type {@code rocketmq.rpc.api.PullMessageResponse}
   */
  public static final class Builder extends
      com.google.protobuf.GeneratedMessageV3.Builder<Builder> implements
      // @@protoc_insertion_point(builder_implements:rocketmq.rpc.api.PullMessageResponse)
      org.apache.rocketmq.proto.PullMessageResponseOrBuilder {
    public static final com.google.protobuf.Descriptors.Descriptor
        getDescriptor() {
      return org.apache.rocketmq.proto.ACS.internal_static_rocketmq_rpc_api_PullMessageResponse_descriptor;
    }

    @java.lang.Override
    protected com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
        internalGetFieldAccessorTable() {
      return org.apache.rocketmq.proto.ACS.internal_static_rocketmq_rpc_api_PullMessageResponse_fieldAccessorTable
          .ensureFieldAccessorsInitialized(
              org.apache.rocketmq.proto.PullMessageResponse.class, org.apache.rocketmq.proto.PullMessageResponse.Builder.class);
    }

    // Construct using org.apache.rocketmq.proto.PullMessageResponse.newBuilder()
    private Builder() {
      maybeForceBuilderInitialization();
    }

    private Builder(
        com.google.protobuf.GeneratedMessageV3.BuilderParent parent) {
      super(parent);
      maybeForceBuilderInitialization();
    }
    private void maybeForceBuilderInitialization() {
      if (com.google.protobuf.GeneratedMessageV3
              .alwaysUseFieldBuilders) {
        getMessagesFieldBuilder();
      }
    }
    @java.lang.Override
    public Builder clear() {
      super.clear();
      suggestBrokerId_ = 0L;

      nextBeginOffset_ = 0L;

      minOffset_ = 0L;

      maxOffset_ = 0L;

      if (messagesBuilder_ == null) {
        messages_ = java.util.Collections.emptyList();
        bitField0_ = (bitField0_ & ~0x00000001);
      } else {
        messagesBuilder_.clear();
      }
      return this;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.Descriptor
        getDescriptorForType() {
      return org.apache.rocketmq.proto.ACS.internal_static_rocketmq_rpc_api_PullMessageResponse_descriptor;
    }

    @java.lang.Override
    public org.apache.rocketmq.proto.PullMessageResponse getDefaultInstanceForType() {
      return org.apache.rocketmq.proto.PullMessageResponse.getDefaultInstance();
    }

    @java.lang.Override
    public org.apache.rocketmq.proto.PullMessageResponse build() {
      org.apache.rocketmq.proto.PullMessageResponse result = buildPartial();
      if (!result.isInitialized()) {
        throw newUninitializedMessageException(result);
      }
      return result;
    }

    @java.lang.Override
    public org.apache.rocketmq.proto.PullMessageResponse buildPartial() {
      org.apache.rocketmq.proto.PullMessageResponse result = new org.apache.rocketmq.proto.PullMessageResponse(this);
      int from_bitField0_ = bitField0_;
      result.suggestBrokerId_ = suggestBrokerId_;
      result.nextBeginOffset_ = nextBeginOffset_;
      result.minOffset_ = minOffset_;
      result.maxOffset_ = maxOffset_;
      if (messagesBuilder_ == null) {
        if (((bitField0_ & 0x00000001) != 0)) {
          messages_ = java.util.Collections.unmodifiableList(messages_);
          bitField0_ = (bitField0_ & ~0x00000001);
        }
        result.messages_ = messages_;
      } else {
        result.messages_ = messagesBuilder_.build();
      }
      onBuilt();
      return result;
    }

    @java.lang.Override
    public Builder clone() {
      return super.clone();
    }
    @java.lang.Override
    public Builder setField(
        com.google.protobuf.Descriptors.FieldDescriptor field,
        java.lang.Object value) {
      return super.setField(field, value);
    }
    @java.lang.Override
    public Builder clearField(
        com.google.protobuf.Descriptors.FieldDescriptor field) {
      return super.clearField(field);
    }
    @java.lang.Override
    public Builder clearOneof(
        com.google.protobuf.Descriptors.OneofDescriptor oneof) {
      return super.clearOneof(oneof);
    }
    @java.lang.Override
    public Builder setRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field,
        int index, java.lang.Object value) {
      return super.setRepeatedField(field, index, value);
    }
    @java.lang.Override
    public Builder addRepeatedField(
        com.google.protobuf.Descriptors.FieldDescriptor field,
        java.lang.Object value) {
      return super.addRepeatedField(field, value);
    }
    @java.lang.Override
    public Builder mergeFrom(com.google.protobuf.Message other) {
      if (other instanceof org.apache.rocketmq.proto.PullMessageResponse) {
        return mergeFrom((org.apache.rocketmq.proto.PullMessageResponse)other);
      } else {
        super.mergeFrom(other);
        return this;
      }
    }

    public Builder mergeFrom(org.apache.rocketmq.proto.PullMessageResponse other) {
      if (other == org.apache.rocketmq.proto.PullMessageResponse.getDefaultInstance()) return this;
      if (other.getSuggestBrokerId() != 0L) {
        setSuggestBrokerId(other.getSuggestBrokerId());
      }
      if (other.getNextBeginOffset() != 0L) {
        setNextBeginOffset(other.getNextBeginOffset());
      }
      if (other.getMinOffset() != 0L) {
        setMinOffset(other.getMinOffset());
      }
      if (other.getMaxOffset() != 0L) {
        setMaxOffset(other.getMaxOffset());
      }
      if (messagesBuilder_ == null) {
        if (!other.messages_.isEmpty()) {
          if (messages_.isEmpty()) {
            messages_ = other.messages_;
            bitField0_ = (bitField0_ & ~0x00000001);
          } else {
            ensureMessagesIsMutable();
            messages_.addAll(other.messages_);
          }
          onChanged();
        }
      } else {
        if (!other.messages_.isEmpty()) {
          if (messagesBuilder_.isEmpty()) {
            messagesBuilder_.dispose();
            messagesBuilder_ = null;
            messages_ = other.messages_;
            bitField0_ = (bitField0_ & ~0x00000001);
            messagesBuilder_ = 
              com.google.protobuf.GeneratedMessageV3.alwaysUseFieldBuilders ?
                 getMessagesFieldBuilder() : null;
          } else {
            messagesBuilder_.addAllMessages(other.messages_);
          }
        }
      }
      this.mergeUnknownFields(other.unknownFields);
      onChanged();
      return this;
    }

    @java.lang.Override
    public final boolean isInitialized() {
      return true;
    }

    @java.lang.Override
    public Builder mergeFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws java.io.IOException {
      org.apache.rocketmq.proto.PullMessageResponse parsedMessage = null;
      try {
        parsedMessage = PARSER.parsePartialFrom(input, extensionRegistry);
      } catch (com.google.protobuf.InvalidProtocolBufferException e) {
        parsedMessage = (org.apache.rocketmq.proto.PullMessageResponse) e.getUnfinishedMessage();
        throw e.unwrapIOException();
      } finally {
        if (parsedMessage != null) {
          mergeFrom(parsedMessage);
        }
      }
      return this;
    }
    private int bitField0_;

    private long suggestBrokerId_ ;
    /**
     * <code>int64 suggest_broker_id = 1;</code>
     * @return The suggestBrokerId.
     */
    @java.lang.Override
    public long getSuggestBrokerId() {
      return suggestBrokerId_;
    }
    /**
     * <code>int64 suggest_broker_id = 1;</code>
     * @param value The suggestBrokerId to set.
     * @return This builder for chaining.
     */
    public Builder setSuggestBrokerId(long value) {
      
      suggestBrokerId_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>int64 suggest_broker_id = 1;</code>
     * @return This builder for chaining.
     */
    public Builder clearSuggestBrokerId() {
      
      suggestBrokerId_ = 0L;
      onChanged();
      return this;
    }

    private long nextBeginOffset_ ;
    /**
     * <code>int64 next_begin_offset = 2;</code>
     * @return The nextBeginOffset.
     */
    @java.lang.Override
    public long getNextBeginOffset() {
      return nextBeginOffset_;
    }
    /**
     * <code>int64 next_begin_offset = 2;</code>
     * @param value The nextBeginOffset to set.
     * @return This builder for chaining.
     */
    public Builder setNextBeginOffset(long value) {
      
      nextBeginOffset_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>int64 next_begin_offset = 2;</code>
     * @return This builder for chaining.
     */
    public Builder clearNextBeginOffset() {
      
      nextBeginOffset_ = 0L;
      onChanged();
      return this;
    }

    private long minOffset_ ;
    /**
     * <code>int64 min_offset = 3;</code>
     * @return The minOffset.
     */
    @java.lang.Override
    public long getMinOffset() {
      return minOffset_;
    }
    /**
     * <code>int64 min_offset = 3;</code>
     * @param value The minOffset to set.
     * @return This builder for chaining.
     */
    public Builder setMinOffset(long value) {
      
      minOffset_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>int64 min_offset = 3;</code>
     * @return This builder for chaining.
     */
    public Builder clearMinOffset() {
      
      minOffset_ = 0L;
      onChanged();
      return this;
    }

    private long maxOffset_ ;
    /**
     * <code>int64 max_offset = 4;</code>
     * @return The maxOffset.
     */
    @java.lang.Override
    public long getMaxOffset() {
      return maxOffset_;
    }
    /**
     * <code>int64 max_offset = 4;</code>
     * @param value The maxOffset to set.
     * @return This builder for chaining.
     */
    public Builder setMaxOffset(long value) {
      
      maxOffset_ = value;
      onChanged();
      return this;
    }
    /**
     * <code>int64 max_offset = 4;</code>
     * @return This builder for chaining.
     */
    public Builder clearMaxOffset() {
      
      maxOffset_ = 0L;
      onChanged();
      return this;
    }

    private java.util.List<org.apache.rocketmq.proto.MessageExt> messages_ =
      java.util.Collections.emptyList();
    private void ensureMessagesIsMutable() {
      if (!((bitField0_ & 0x00000001) != 0)) {
        messages_ = new java.util.ArrayList<org.apache.rocketmq.proto.MessageExt>(messages_);
        bitField0_ |= 0x00000001;
       }
    }

    private com.google.protobuf.RepeatedFieldBuilderV3<
        org.apache.rocketmq.proto.MessageExt, org.apache.rocketmq.proto.MessageExt.Builder, org.apache.rocketmq.proto.MessageExtOrBuilder> messagesBuilder_;

    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public java.util.List<org.apache.rocketmq.proto.MessageExt> getMessagesList() {
      if (messagesBuilder_ == null) {
        return java.util.Collections.unmodifiableList(messages_);
      } else {
        return messagesBuilder_.getMessageList();
      }
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public int getMessagesCount() {
      if (messagesBuilder_ == null) {
        return messages_.size();
      } else {
        return messagesBuilder_.getCount();
      }
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public org.apache.rocketmq.proto.MessageExt getMessages(int index) {
      if (messagesBuilder_ == null) {
        return messages_.get(index);
      } else {
        return messagesBuilder_.getMessage(index);
      }
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder setMessages(
        int index, org.apache.rocketmq.proto.MessageExt value) {
      if (messagesBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        ensureMessagesIsMutable();
        messages_.set(index, value);
        onChanged();
      } else {
        messagesBuilder_.setMessage(index, value);
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder setMessages(
        int index, org.apache.rocketmq.proto.MessageExt.Builder builderForValue) {
      if (messagesBuilder_ == null) {
        ensureMessagesIsMutable();
        messages_.set(index, builderForValue.build());
        onChanged();
      } else {
        messagesBuilder_.setMessage(index, builderForValue.build());
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder addMessages(org.apache.rocketmq.proto.MessageExt value) {
      if (messagesBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        ensureMessagesIsMutable();
        messages_.add(value);
        onChanged();
      } else {
        messagesBuilder_.addMessage(value);
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder addMessages(
        int index, org.apache.rocketmq.proto.MessageExt value) {
      if (messagesBuilder_ == null) {
        if (value == null) {
          throw new NullPointerException();
        }
        ensureMessagesIsMutable();
        messages_.add(index, value);
        onChanged();
      } else {
        messagesBuilder_.addMessage(index, value);
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder addMessages(
        org.apache.rocketmq.proto.MessageExt.Builder builderForValue) {
      if (messagesBuilder_ == null) {
        ensureMessagesIsMutable();
        messages_.add(builderForValue.build());
        onChanged();
      } else {
        messagesBuilder_.addMessage(builderForValue.build());
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder addMessages(
        int index, org.apache.rocketmq.proto.MessageExt.Builder builderForValue) {
      if (messagesBuilder_ == null) {
        ensureMessagesIsMutable();
        messages_.add(index, builderForValue.build());
        onChanged();
      } else {
        messagesBuilder_.addMessage(index, builderForValue.build());
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder addAllMessages(
        java.lang.Iterable<? extends org.apache.rocketmq.proto.MessageExt> values) {
      if (messagesBuilder_ == null) {
        ensureMessagesIsMutable();
        com.google.protobuf.AbstractMessageLite.Builder.addAll(
            values, messages_);
        onChanged();
      } else {
        messagesBuilder_.addAllMessages(values);
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder clearMessages() {
      if (messagesBuilder_ == null) {
        messages_ = java.util.Collections.emptyList();
        bitField0_ = (bitField0_ & ~0x00000001);
        onChanged();
      } else {
        messagesBuilder_.clear();
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public Builder removeMessages(int index) {
      if (messagesBuilder_ == null) {
        ensureMessagesIsMutable();
        messages_.remove(index);
        onChanged();
      } else {
        messagesBuilder_.remove(index);
      }
      return this;
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public org.apache.rocketmq.proto.MessageExt.Builder getMessagesBuilder(
        int index) {
      return getMessagesFieldBuilder().getBuilder(index);
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public org.apache.rocketmq.proto.MessageExtOrBuilder getMessagesOrBuilder(
        int index) {
      if (messagesBuilder_ == null) {
        return messages_.get(index);  } else {
        return messagesBuilder_.getMessageOrBuilder(index);
      }
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public java.util.List<? extends org.apache.rocketmq.proto.MessageExtOrBuilder> 
         getMessagesOrBuilderList() {
      if (messagesBuilder_ != null) {
        return messagesBuilder_.getMessageOrBuilderList();
      } else {
        return java.util.Collections.unmodifiableList(messages_);
      }
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public org.apache.rocketmq.proto.MessageExt.Builder addMessagesBuilder() {
      return getMessagesFieldBuilder().addBuilder(
          org.apache.rocketmq.proto.MessageExt.getDefaultInstance());
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public org.apache.rocketmq.proto.MessageExt.Builder addMessagesBuilder(
        int index) {
      return getMessagesFieldBuilder().addBuilder(
          index, org.apache.rocketmq.proto.MessageExt.getDefaultInstance());
    }
    /**
     * <code>repeated .rocketmq.rpc.api.MessageExt messages = 5;</code>
     */
    public java.util.List<org.apache.rocketmq.proto.MessageExt.Builder> 
         getMessagesBuilderList() {
      return getMessagesFieldBuilder().getBuilderList();
    }
    private com.google.protobuf.RepeatedFieldBuilderV3<
        org.apache.rocketmq.proto.MessageExt, org.apache.rocketmq.proto.MessageExt.Builder, org.apache.rocketmq.proto.MessageExtOrBuilder> 
        getMessagesFieldBuilder() {
      if (messagesBuilder_ == null) {
        messagesBuilder_ = new com.google.protobuf.RepeatedFieldBuilderV3<
            org.apache.rocketmq.proto.MessageExt, org.apache.rocketmq.proto.MessageExt.Builder, org.apache.rocketmq.proto.MessageExtOrBuilder>(
                messages_,
                ((bitField0_ & 0x00000001) != 0),
                getParentForChildren(),
                isClean());
        messages_ = null;
      }
      return messagesBuilder_;
    }
    @java.lang.Override
    public final Builder setUnknownFields(
        final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.setUnknownFields(unknownFields);
    }

    @java.lang.Override
    public final Builder mergeUnknownFields(
        final com.google.protobuf.UnknownFieldSet unknownFields) {
      return super.mergeUnknownFields(unknownFields);
    }


    // @@protoc_insertion_point(builder_scope:rocketmq.rpc.api.PullMessageResponse)
  }

  // @@protoc_insertion_point(class_scope:rocketmq.rpc.api.PullMessageResponse)
  private static final org.apache.rocketmq.proto.PullMessageResponse DEFAULT_INSTANCE;
  static {
    DEFAULT_INSTANCE = new org.apache.rocketmq.proto.PullMessageResponse();
  }

  public static org.apache.rocketmq.proto.PullMessageResponse getDefaultInstance() {
    return DEFAULT_INSTANCE;
  }

  private static final com.google.protobuf.Parser<PullMessageResponse>
      PARSER = new com.google.protobuf.AbstractParser<PullMessageResponse>() {
    @java.lang.Override
    public PullMessageResponse parsePartialFrom(
        com.google.protobuf.CodedInputStream input,
        com.google.protobuf.ExtensionRegistryLite extensionRegistry)
        throws com.google.protobuf.InvalidProtocolBufferException {
      return new PullMessageResponse(input, extensionRegistry);
    }
  };

  public static com.google.protobuf.Parser<PullMessageResponse> parser() {
    return PARSER;
  }

  @java.lang.Override
  public com.google.protobuf.Parser<PullMessageResponse> getParserForType() {
    return PARSER;
  }

  @java.lang.Override
  public org.apache.rocketmq.proto.PullMessageResponse getDefaultInstanceForType() {
    return DEFAULT_INSTANCE;
  }

}

