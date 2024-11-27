import React, { useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearActiveRoom } from '../store/slices/chatSlice';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatRoom from '../components/chat/ChatRoom';
import { initializeSocket, disconnectSocket } from '../services/chat';

const Chat: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    if (token) {
      const socket = initializeSocket(token);

      return () => {
        disconnectSocket();
        dispatch(clearActiveRoom());
      };
    }
  }, [token, dispatch, courseId]);

  if (!courseId) {
    return <Navigate to="/courses" />;
  }

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)' }}>
      <Grid item xs={12} md={4} lg={3}>
        <Paper sx={{ height: '100%', overflow: 'auto' }}>
          <ChatRoomList courseId={courseId} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <ChatRoom />
      </Grid>
    </Grid>
  );
};

export default Chat; 