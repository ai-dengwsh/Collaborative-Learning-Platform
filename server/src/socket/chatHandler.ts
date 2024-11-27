import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { Chat } from '../models/Chat';
import { AuthenticatedSocket } from '../types/socket';

interface MessageData {
  content: string;
  roomId: string;
  attachments?: Array<{
    url: string;
    public_id: string;
    name: string;
  }>;
}

export const handleChat = (io: Server, socket: AuthenticatedSocket) => {
  // 获取用户信息
  const userId = socket.user?._id;
  const username = socket.user?.username;

  if (!userId || !username) {
    socket.disconnect();
    return;
  }

  // 加入聊天室
  socket.on('joinRoom', async (roomId: string) => {
    try {
      const chat = await Chat.findById(roomId);
      if (!chat) {
        socket.emit('error', { message: '聊天室不存在' });
        return;
      }

      socket.join(roomId);
      
      // 通知其他用户
      socket.to(roomId).emit('userJoined', {
        userId: userId.toString(),
        username,
        message: `${username} 加入了聊天室`
      });

    } catch (error) {
      socket.emit('error', { message: '加入聊天室失败' });
    }
  });

  // 离开聊天室
  socket.on('leaveRoom', async (roomId: string) => {
    try {
      socket.leave(roomId);
      
      // 通知其他用户
      socket.to(roomId).emit('userLeft', {
        userId: userId.toString(),
        username,
        message: `${username} 离开了聊天室`
      });

    } catch (error) {
      socket.emit('error', { message: '离开聊天室失败' });
    }
  });

  // 发送消息
  socket.on('sendMessage', async (data: MessageData) => {
    try {
      const { content, roomId, attachments } = data;

      const message = await Chat.findByIdAndUpdate(
        roomId,
        {
          $push: {
            messages: {
              content,
              sender: userId,
              attachments,
              createdAt: new Date()
            }
          }
        },
        { new: true }
      );

      if (!message) {
        socket.emit('error', { message: '发送消息失败' });
        return;
      }

      // 广播消息给聊天室所有成员
      io.to(roomId).emit('newMessage', {
        content,
        sender: {
          _id: userId,
          username
        },
        attachments,
        createdAt: new Date()
      });

    } catch (error) {
      socket.emit('error', { message: '发送消息失败' });
    }
  });

  // 正在输入
  socket.on('typing', (roomId: string) => {
    socket.to(roomId).emit('userTyping', {
      userId: userId.toString(),
      username
    });
  });

  // 停止输入
  socket.on('stopTyping', (roomId: string) => {
    socket.to(roomId).emit('userStopTyping', {
      userId: userId.toString(),
      username
    });
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log(`User ${username} disconnected`);
  });
}; 