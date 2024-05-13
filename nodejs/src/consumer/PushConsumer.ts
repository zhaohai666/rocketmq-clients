import { FilterExpression } from '../../dist';

export interface PushConsumer {
    getConsumerGroup(): String;
    getSubscriptionExpressions(): Map<String, FilterExpression>;
    subscribe(topic: String, filterExpression: FilterExpression);
    unsubscribe(topic: String): PushConsumer;
    close(): void;
}
