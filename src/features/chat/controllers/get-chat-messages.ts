import { MessageCache } from '@/service/redis/chat.cache';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { IMessageData } from '../interfaces/chat.interfaces';
import { chatService } from '@/service/db/chat.service';

const messageCache: MessageCache = new MessageCache();

export class Get {
  public async conversationList(req: Request, res: Response): Promise<void> {
    let list: IMessageData[] = [];
    const cachedList: IMessageData[] = await messageCache.getUserConversationList(`${req.currentUser!.userId}`);
    if (cachedList.length) {
      list = cachedList;
    } else {
      list = await chatService.getUserConversationList(new mongoose.Types.ObjectId(req.currentUser!.userId));
    }

    res.status(HTTP_STATUS.OK).json({ message: 'User conversation list', list });
  }
}
