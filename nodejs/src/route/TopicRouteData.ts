import { MessageQueue as MessageQueuePB } from '../../proto/apache/rocketmq/v2/definition_pb';
import { Endpoints } from './Endpoints';
import { MessageQueue } from './MessageQueue';

export class TopicRouteData {
  readonly messageQueues: MessageQueue[] = [];

  constructor(messageQueues: MessageQueuePB[]) {
    for (const mq of messageQueues) {
      this.messageQueues.push(new MessageQueue(mq));
    }
  }

  getTotalEndpoints() {
    const endpointsMap = new Map<string, Endpoints>();
    for (const mq of this.messageQueues) {
      endpointsMap.set(mq.broker.endpoints.facade, mq.broker.endpoints);
    }
    return Array.from(endpointsMap.values());
  }

  pickEndpointsToQueryAssignments() {
    // MASTER_BROKER_ID = 0 in Java client
    const MASTER_BROKER_ID = 0;
    
    // Simple round-robin selection
    const candidateBrokers: { [key: string]: { endpoints: Endpoints, index: number } } = {};
    
    for (let i = 0; i < this.messageQueues.length; i++) {
      const mq = this.messageQueues[i];
      const broker = mq.broker;
      
      // Check if it's a master broker
      if (broker.id !== MASTER_BROKER_ID) {
        continue;
      }
      
      // Check if broker has readable permission (simplified check)
      // In Permission enum: NONE=0, READ=1, WRITE=2, READ_WRITE=3
      if (mq.permission === 0) { // NONE
        continue;
      }
      
      const endpointsFacade = broker.endpoints.facade;
      if (!candidateBrokers[endpointsFacade]) {
        candidateBrokers[endpointsFacade] = {
          endpoints: broker.endpoints,
          index: i
        };
      }
    }
    
    const candidates = Object.values(candidateBrokers);
    if (candidates.length === 0) {
      throw new Error('Failed to pick endpoints to query assignment');
    }
    
    // Pick one randomly
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex].endpoints;
  }
}