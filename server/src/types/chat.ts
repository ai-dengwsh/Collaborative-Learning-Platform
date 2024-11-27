import { Types } from 'mongoose';

export interface IMessage {
  content: string;
  sender: Types.ObjectId;
  attachments?: Array<{
    url: string;
    public_id: string;
    name: string;
  }>;
  createdAt: Date;
}

export interface IChatRoom {
  name: string;
  courseId: Types.ObjectId;
  participants: Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServerToClientEvents {
  newMessage: (message: {
    content: string;
    sender: {
      _id: Types.ObjectId;
      username: string;
    };
    attachments?: Array<{
      url: string;
      public_id: string;
      name: string;
    }>;
    createdAt: Date;
  }) => void;
  userJoined: (data: { userId: string; username: string; message: string }) => void;
  userLeft: (data: { userId: string; username: string; message: string }) => void;
  userTyping: (data: { userId: string; username: string }) => void;
  userStopTyping: (data: { userId: string; username: string }) => void;
  error: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (data: {
    content: string;
    roomId: string;
    attachments?: Array<{
      url: string;
      public_id: string;
      name: string;
    }>;
  }) => void;
  typing: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
} 