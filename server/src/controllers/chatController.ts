import { Request, Response } from 'express';
import { ChatRoom } from '../models/ChatRoom';
import { Course } from '../models/Course';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../middlewares/errorHandler';

// 获取课程的聊天室
export const getCourseRooms = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const rooms = await ChatRoom.find({ courseId })
    .populate('participants', 'username avatar')
    .sort('-updatedAt');

  res.status(200).json({
    status: 'success',
    data: {
      rooms
    }
  });
});

// 创建聊天室
export const createRoom = catchAsync(async (req: Request, res: Response) => {
  const { name, courseId } = req.body;

  // 检查课程是否存在
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 检查是否为课程教师
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('只有课程教师可以创建聊天室', 403);
  }

  const room = await ChatRoom.create({
    name,
    courseId,
    participants: [req.user._id]
  });

  await room.populate('participants', 'username avatar');

  res.status(201).json({
    status: 'success',
    data: {
      room
    }
  });
});

// 获取聊天室消息
export const getRoomMessages = catchAsync(async (req: Request, res: Response) => {
  const room = await ChatRoom.findById(req.params.roomId)
    .populate('messages.sender', 'username avatar')
    .select('messages');

  if (!room) {
    throw new AppError('未找到该聊天室', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      messages: room.messages
    }
  });
});

// 加入聊天室
export const joinRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await ChatRoom.findById(req.params.roomId);

  if (!room) {
    throw new AppError('未找到该聊天室', 404);
  }

  // 检查是否已经在聊天室中
  if (room.participants.includes(req.user._id)) {
    throw new AppError('您已经在聊天室中', 400);
  }

  room.participants.push(req.user._id);
  await room.save();

  res.status(200).json({
    status: 'success',
    message: '成功加入聊天室'
  });
});

// 离开聊天室
export const leaveRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await ChatRoom.findById(req.params.roomId);

  if (!room) {
    throw new AppError('未找到该聊天室', 404);
  }

  // 检查是否在聊天室中
  if (!room.participants.includes(req.user._id)) {
    throw new AppError('您不在聊天室中', 400);
  }

  room.participants = room.participants.filter(
    participant => participant.toString() !== req.user._id.toString()
  );
  await room.save();

  res.status(200).json({
    status: 'success',
    message: '成功离开聊天室'
  });
});

// 删除聊天室
export const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await ChatRoom.findById(req.params.roomId);

  if (!room) {
    throw new AppError('未找到该聊天室', 404);
  }

  // 检查权限
  const course = await Course.findById(room.courseId);
  if (!course) {
    throw new AppError('未找到相关课程', 404);
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('只有课程教师可以删除聊天室', 403);
  }

  await room.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 