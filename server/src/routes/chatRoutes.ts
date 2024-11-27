import express from 'express';
import {
  getCourseRooms,
  createRoom,
  getRoomMessages,
  joinRoom,
  leaveRoom,
  deleteRoom
} from '../controllers/chatController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 聊天室路由
router.get('/rooms/course/:courseId', getCourseRooms);
router.post('/rooms', createRoom);
router.get('/rooms/:roomId/messages', getRoomMessages);
router.post('/rooms/:roomId/join', joinRoom);
router.post('/rooms/:roomId/leave', leaveRoom);
router.delete('/rooms/:roomId', deleteRoom);

export default router; 