import { Socket } from 'socket.io';
import { Types } from 'mongoose';
import { ServerToClientEvents, ClientToServerEvents } from './chat';

export interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  user?: {
    _id: Types.ObjectId;
    username: string;
    email: string;
  };
} 