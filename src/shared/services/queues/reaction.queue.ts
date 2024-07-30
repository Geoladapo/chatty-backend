import { reactionWorker } from '@/worker/reaction.worker';
import { BaseQueue } from './base.queue';
import { IReactionsJob } from '@/root/features/reactions/interfaces/reaction.interface';

class ReactionQueue extends BaseQueue {
  constructor() {
    super('reactions');
    this.processJob('addReactionToDB', 5, reactionWorker.addReactionToDB);
    this.processJob('removeReactionFromDB', 5, reactionWorker.removeReactionFromDB);
  }

  public addReactionJob(name: string, data: IReactionsJob): void {
    this.addJob(name, data);
  }
}

export const reactionQueue: ReactionQueue = new ReactionQueue();
