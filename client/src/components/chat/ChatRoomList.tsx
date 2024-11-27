import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  ListItemButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setActiveRoom, clearActiveRoom } from '../../store/slices/chatSlice';
import { getCourseRooms, createRoom, deleteRoom } from '../../services/chat';
import { ChatRoom } from '../../types/chat';

interface ChatRoomListProps {
  courseId: string;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ courseId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeRoom } = useSelector((state: RootState) => state.chat);
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    fetchRooms();
  }, [courseId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getCourseRooms(courseId);
      if (response.status === 'success' && response.data) {
        setRooms(response.data.rooms);
      }
    } catch (err: any) {
      setError(err.message || '获取聊天室列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom({
        name: newRoomName,
        courseId
      });

      if (response.status === 'success' && response.data) {
        setRooms(prev => [...prev, response.data.room]);
        setOpenDialog(false);
        setNewRoomName('');
      }
    } catch (err: any) {
      setError(err.message || '创建聊天室失败');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRoom(roomId);
      setRooms(prev => prev.filter(room => room.id !== roomId));
      if (activeRoom?.id === roomId) {
        dispatch(clearActiveRoom());
      }
    } catch (err: any) {
      setError(err.message || '删除聊天室失败');
    }
  };

  if (loading) {
    return <Typography>加载中...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">聊天室列表</Typography>
        {user?.role === 'teacher' && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            新建聊天室
          </Button>
        )}
      </Box>

      <List>
        {rooms.map((room) => (
          <ListItemButton
            key={room.id}
            selected={activeRoom?.id === room.id}
            onClick={() => dispatch(setActiveRoom(room))}
          >
            <ListItemText primary={room.name} />
            {user?.role === 'teacher' && (
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRoom(room.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItemButton>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>新建聊天室</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="聊天室名称"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleCreateRoom} disabled={!newRoomName.trim()}>
            创建
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatRoomList; 