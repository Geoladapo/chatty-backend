import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { IReactionDocument, IReactionsJob } from '../interfaces/reaction.interface';
import { ReactionCache } from '@/service/redis/reaction.cache';
import { reactionQueue } from '@/service/queues/reaction.queue';

const reactionCache: ReactionCache = new ReactionCache();

export class Add {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { userTo, postId, type, previousReaction, postReactioin, profilePicture } = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avataColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as IReactionDocument;

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReactioin, type, previousReaction);

    const databaseReactionData: IReactionsJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      type,
      previousReaction,
      reactionObject
    };
    reactionQueue.addReactionJob('addReactionToDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' });
  }
}
