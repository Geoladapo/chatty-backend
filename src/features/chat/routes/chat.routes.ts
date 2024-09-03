import { authMiddleware } from '@/root/shared/globals/helpers/auth-middleware';
import express, { Router } from 'express';
import { Add } from '../controllers/add-chat-message';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/chat/message', authMiddleware.checkAuthentication, Add.prototype.meesage);
    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
