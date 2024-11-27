import { Socket as ClientSocket } from 'socket.io-client';
import { Manager } from 'socket.io-client';
import { Message, ChatRoom, ServerToClientEvents, ClientToServerEvents } from '../types/chat';
import api from './api';
import { ApiResponse } from '../types';

let socket: ClientSocket<ServerToClientEvents, ClientToServerEvents> | null = null;

// 初始化Socket.IO连接
export const initializeSocket = (token: string) => {
  if (!socket) {
    const manager = new Manager(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      autoConnect: true,
      auth: {
        token
      }
    });

    socket = manager.socket('/') as ClientSocket<ServerToClientEvents, ClientToServerEvents>;

    // 设置事件监听器
    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });
  }
  return socket;
};

// 断开Socket.IO连接
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// 加入聊天室
export const joinRoom = (roomId: string) => {
  if (socket) {
    socket.emit('joinRoom', roomId);
  }
};

// 离开聊天室
export const leaveRoom = (roomId: string) => {
  if (socket) {
    socket.emit('leaveRoom', roomId);
  }
};

// 发送消息
export const sendMessage = (data: { content: string; roomId: string; attachments?: Array<{ url: string; public_id: string; name: string; }> }) => {
  if (socket) {
    socket.emit('sendMessage', data);
  }
};

// 发送正在输入状态
export const sendTyping = (roomId: string) => {
  if (socket) {
    socket.emit('typing', roomId);
  }
};

// 发送停止输入状态
export const sendStopTyping = (roomId: string) => {
  if (socket) {
    socket.emit('stopTyping', roomId);
  }
};

// API调用
// 获取课程的聊天室
export const getCourseRooms = async (courseId: string): Promise<ApiResponse<{ rooms: ChatRoom[] }>> => {
  return api.get(`/chat/rooms/course/${courseId}`);
};

// 获取聊天室消息历史
export const getRoomMessages = async (roomId: string): Promise<ApiResponse<{ messages: Message[] }>> => {
  return api.get(`/chat/rooms/${roomId}/messages`);
};

// 创建新聊天室
export const createRoom = async (data: { name: string; courseId: string }): Promise<ApiResponse<{ room: ChatRoom }>> => {
  return api.post('/chat/rooms', data);
};

// 删除聊天室
export const deleteRoom = async (roomId: string): Promise<ApiResponse<null>> => {
  return api.delete(`/chat/rooms/${roomId}`);
}; 