import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from '@/service/redis/chat.cache';
import { socketIOChatObject } from '@/socket/chat';
import { Request, Response } from 'express';
import { IMessageData } from '../interfaces/chat.interfaces';
import { chatQueue } from '@/service/queues/chat.queue';
import { joiValidation } from '@/root/shared/globals/decorators/joi-validation.decorators';
import { markChatSchema } from '../schemes/chat';

const messageCache: MessageCache = new MessageCache();

export class Update {
  @joiValidation(markChatSchema)
  public async message(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.body;
    const updatedMessage: IMessageData = await messageCache.updateChatMessages(`${senderId}`, `${receiverId}`);
    socketIOChatObject.emit('message read', updatedMessage);
    socketIOChatObject.emit('chat list', updatedMessage);
    chatQueue.addChatJob('markMessagesAsReadInDB', {
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId)
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Message marked as read' });
  }
}
