import { Request, Response } from 'express';
import { Server } from 'socket.io';
import * as chatServer from '@/socket/chat';
import { chatMockRequest, chatMockResponse, messageDataMock } from '@/root/mocks/chat.mock';
import { existingUser } from '@/root/mocks/user.mock';
import { authUserPayload } from '@/root/mocks/auth.mocks';
import { MessageCache } from '@/service/redis/chat.cache';
import { Update } from '../update-chat-message';
import { chatQueue } from '@/service/queues/chat.queue';

jest.useFakeTimers();
jest.mock('@/service/queues/base.queue');
jest.mock('@/service/redis/chat.cache');

Object.defineProperties(chatServer, {
  socketIOChatObject: {
    value: new Server(),
    writable: true
  }
});

describe('Update', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('message', () => {
    it('should send correct json response from redis cache', async () => {
      const req: Request = chatMockRequest(
        {},
        {
          senderId: `${existingUser._id}`,
          receiverId: '60263f14648fed5246e322d8'
        },
        authUserPayload
      ) as Request;
      const res: Response = chatMockResponse();
      jest.spyOn(MessageCache.prototype, 'updateChatMessages').mockResolvedValue(messageDataMock);
      jest.spyOn(chatServer.socketIOChatObject, 'emit');

      await Update.prototype.message(req, res);
      expect(chatServer.socketIOChatObject.emit).toHaveBeenCalledTimes(2);
      expect(chatServer.socketIOChatObject.emit).toHaveBeenCalledWith('message read', messageDataMock);
      expect(chatServer.socketIOChatObject.emit).toHaveBeenCalledWith('chat list', messageDataMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Message marked as read'
      });
    });

    it('should call chatQueue addChatJob', async () => {
      const req: Request = chatMockRequest(
        {},
        {
          senderId: `${existingUser._id}`,
          receiverId: '60263f14648fed5246e322d8'
        },
        authUserPayload
      ) as Request;
      const res: Response = chatMockResponse();
      jest.spyOn(MessageCache.prototype, 'updateChatMessages').mockResolvedValue(messageDataMock);
      jest.spyOn(chatQueue, 'addChatJob');

      await Update.prototype.message(req, res);
      expect(chatQueue.addChatJob).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Message marked as read'
      });
    });
  });
});
