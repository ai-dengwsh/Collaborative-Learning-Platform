import { useEffect, useState } from 'react';
import { Socket as ClientSocket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../types';
import { initializeSocket, disconnectSocket } from '../services/chat';

const useSocket = () => {
  const [socket, setSocket] = useState<ClientSocket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = initializeSocket(token);
    setSocket(socket);

    return () => {
      disconnectSocket(socket);
    };
  }, []);

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leaveRoom', roomId);
    }
  };

  const sendMessage = (data: { content: string; roomId: string; attachments?: Array<{ url: string; public_id: string; name: string; }> }) => {
    if (socket) {
      socket.emit('sendMessage', data);
    }
  };

  const subscribeToMessages = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on('newMessage', callback);
    }
  };

  const unsubscribeFromMessages = (callback: (message: Message) => void) => {
    if (socket) {
      socket.off('newMessage', callback);
    }
  };

  return socket as ClientSocket<ServerToClientEvents, ClientToServerEvents>;
}; 