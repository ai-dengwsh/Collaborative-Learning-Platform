import { User } from './index';

export interface Message {
  id: string;
  content: string;
  sender: User;
  roomId: string;
  createdAt: string;
  attachments?: {
    url: string;
    public_id: string;
    name: string;
  }[];
}

export interface ChatRoom {
  id: string;
  name: string;
  courseId: string;
  participants: User[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  activeRoom: ChatRoom | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

// Socket.IO 事件类型
export interface ServerToClientEvents {
  newMessage: (message: Message) => void;
  userJoined: (data: { userId: string; username: string; message: string }) => void;
  userLeft: (data: { userId: string; username: string; message: string }) => void;
  userTyping: (data: { userId: string; username: string }) => void;
  userStopTyping: (data: { userId: string; username: string }) => void;
  error: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (data: { content: string; roomId: string; attachments?: Array<{ url: string; public_id: string; name: string; }> }) => void;
  typing: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
} 