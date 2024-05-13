import { Settings } from '../../dist/client';

export class PushSubscriptionSettings extends Settings {
    sync(settings: Settings): void {
    }

    toProtobuf(): Settings {
        return undefined;
    }

}
