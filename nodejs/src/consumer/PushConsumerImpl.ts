import { PushConsumer } from './PushConsumer';
import { Consumer, FilterExpression } from '../../dist';
import { ConsumerOptions } from './Consumer';
import { HeartbeatRequest, NotifyClientTerminationRequest } from '../../proto/apache/rocketmq/v2/service_pb';
import { Settings } from '../client';

export class PushConsumerImpl extends Consumer implements ConsumerOptions, PushConsumer {

    #consumptionOkQuantity: 0;
    #consumptionErrorQuantity: 0;


    close(): void {
    }

    getConsumerGroup(): String {
        return '';
    }

    getSubscriptionExpressions(): Map<String, FilterExpression> {
        return undefined;
    }

    subscribe(topic: String, filterExpression: FilterExpression) {
    }

    unsubscribe(topic: String): PushConsumer {
        return undefined;
    }

    consumerGroup: string;
    endpoints: string;
    private #private;

    protected getSettings(): Settings {
        return undefined;
    }

    protected wrapHeartbeatRequest(): HeartbeatRequest {
        return undefined;
    }

    protected wrapNotifyClientTerminationRequest(): NotifyClientTerminationRequest {
        return undefined;
    }

}
