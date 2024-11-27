import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Badge
} from '@mui/material';
import { Send, AttachFile } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addMessage, setError } from '../../store/slices/chatSlice';
import { sendMessage, sendTyping, sendStopTyping } from '../../services/chat';
import { Message } from '../../types/chat';
import { FileUpload } from '../common/FileUpload';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ChatRoom: React.FC = () => {
  const dispatch = useDispatch();
  const { activeRoom, messages, loading } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [newMessage, setNewMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!activeRoom || !user || !newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage,
        roomId: activeRoom.id,
      };

      await sendMessage(messageData);
      setNewMessage('');
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleTyping = () => {
    if (!activeRoom) return;

    sendTyping(activeRoom.id);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      sendStopTyping(activeRoom.id);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleFileUpload = async (files: Array<{ url: string; public_id: string; name: string }>) => {
    if (!activeRoom || !user) return;

    try {
      const messageData = {
        content: '发送了文件',
        roomId: activeRoom.id,
        attachments: files
      };

      await sendMessage(messageData);
      setShowUpload(false);
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  if (!activeRoom) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h6" color="textSecondary">
          请选择一个聊天室
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">{activeRoom.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {activeRoom.participants.length} 位参与者
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={message.sender.username} src={message.sender.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography component="span" variant="body1">
                        {message.sender.username}
                      </Typography>
                      <Typography component="span" variant="caption" color="textSecondary">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: zhCN
                        })}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {message.content}
                      </Typography>
                      {message.attachments && message.attachments.length > 0 && (
                        <Box mt={1}>
                          {message.attachments.map((file, index) => (
                            <Box key={index} mb={1}>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                <Typography variant="body2" color="primary">
                                  {file.name}
                                </Typography>
                              </a>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
              {index < messages.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {showUpload && (
        <Box sx={{ p: 2 }}>
          <FileUpload
            multiple
            maxFiles={5}
            onUploadSuccess={handleFileUpload}
            onUploadError={(error) => dispatch(setError(error))}
          />
        </Box>
      )}

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => setShowUpload(!showUpload)}>
            <Badge color="primary" variant="dot" invisible={!showUpload}>
              <AttachFile />
            </Badge>
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onKeyUp={handleTyping}
            multiline
            maxRows={4}
            sx={{ mx: 1 }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatRoom; 