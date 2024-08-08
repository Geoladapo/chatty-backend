import { IFollowers } from '@/root/features/followers/interfaces/follower.interface';
import { Server, Socket } from 'socket.io';

export let socketIOFollowerObject: Server;

export class SocketIOFollowerHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOFollowerObject = io;
  }

  public listen(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.io.on('connection', (socket: Socket) => {
      socket.on('unfollow user', (data: IFollowers) => {
        this.io.emit('update like', data);
      });
    });
  }
}
