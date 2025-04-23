import { Application } from 'express';
import { postRoutes } from '@/post/routes/postRoutes';
import { chatRoutes } from '@/chat/routes/chat.routes';
import { healthRoutes } from '@/user/routes/health.routes';
import { reactionRoutes } from '@/reaction/routes/reaction-routes';
import { commentRoutes } from '@/comment/routes/commentsRoutes';
import { followerRoutes } from '@/follower/routes/followerRoutes';
import { notificationRoutes } from '@/notification/routes/notificationRoutes';
import { serverAdapter } from '@/service/queues/base.queue';
import { authRoutes } from '@/auth/routes/authRoutes';
import { currentUserRoutes } from '@/auth/routes/currentRoutes';
import { authMiddleware } from '@/global/helpers/auth-middleware';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use('', healthRoutes.health());
    app.use('', healthRoutes.env());
    app.use('', healthRoutes.instance());
    app.use('', healthRoutes.fiboRoutes());

    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoutes());

    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
    app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
  };
  routes();
};
