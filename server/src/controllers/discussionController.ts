import { Request, Response } from 'express';
import { Discussion } from '../models/Discussion';
import { Course } from '../models/Course';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../middlewares/errorHandler';

// 创建讨论
export const createDiscussion = catchAsync(async (req: Request, res: Response) => {
  const { title, content, courseId, tags, isAnnouncement } = req.body;

  // 检查课程是否存在
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 如果是公告，检查是否为教师
  if (isAnnouncement && course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('只有课程教师可以发布公告', 403);
  }

  const discussion = await Discussion.create({
    title,
    content,
    course: courseId,
    author: req.user._id,
    tags,
    isAnnouncement: isAnnouncement || false
  });

  res.status(201).json({
    status: 'success',
    data: {
      discussion
    }
  });
});

// 获取课程的所有讨论
export const getCourseDiscussions = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { type } = req.query; // 'all', 'announcements', 'discussions'

  let query = { course: courseId };
  if (type === 'announcements') {
    query = { ...query, isAnnouncement: true };
  } else if (type === 'discussions') {
    query = { ...query, isAnnouncement: false };
  }

  const discussions = await Discussion.find(query)
    .populate('author', 'username avatar')
    .sort('-isPinned -createdAt');

  res.status(200).json({
    status: 'success',
    results: discussions.length,
    data: {
      discussions
    }
  });
});

// 获取单个讨论
export const getDiscussion = catchAsync(async (req: Request, res: Response) => {
  const discussion = await Discussion.findById(req.params.id)
    .populate('author', 'username avatar')
    .populate('replies.author', 'username avatar')
    .populate('course', 'title');

  if (!discussion) {
    throw new AppError('未找到该讨论', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      discussion
    }
  });
});

// 回复讨论
export const replyToDiscussion = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    throw new AppError('未找到该讨论', 404);
  }

  discussion.replies.push({
    content,
    author: req.user._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: []
  });

  await discussion.save();

  res.status(200).json({
    status: 'success',
    message: '回复成功'
  });
});

// 点赞/取消点赞讨论
export const toggleLikeDiscussion = catchAsync(async (req: Request, res: Response) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    throw new AppError('未找到该讨论', 404);
  }

  const userIdStr = req.user._id.toString();
  const likeIndex = discussion.likes.findIndex(id => id.toString() === userIdStr);

  if (likeIndex === -1) {
    discussion.likes.push(req.user._id);
  } else {
    discussion.likes.splice(likeIndex, 1);
  }

  await discussion.save();

  res.status(200).json({
    status: 'success',
    message: likeIndex === -1 ? '点赞成功' : '取消点赞成功'
  });
});

// 点赞/取消点赞回复
export const toggleLikeReply = catchAsync(async (req: Request, res: Response) => {
  const { id, replyId } = req.params;
  const discussion = await Discussion.findById(id);

  if (!discussion) {
    throw new AppError('未找到该讨论', 404);
  }

  const reply = discussion.replies.id(replyId);
  if (!reply) {
    throw new AppError('未找到该回复', 404);
  }

  const userIdStr = req.user._id.toString();
  const likeIndex = reply.likes.findIndex(id => id.toString() === userIdStr);

  if (likeIndex === -1) {
    reply.likes.push(req.user._id);
  } else {
    reply.likes.splice(likeIndex, 1);
  }

  await discussion.save();

  res.status(200).json({
    status: 'success',
    message: likeIndex === -1 ? '点赞成功' : '取消点赞成功'
  });
});

// 置顶/取消置顶讨论
export const togglePinDiscussion = catchAsync(async (req: Request, res: Response) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    throw new AppError('未找到该讨论', 404);
  }

  // 检查权限
  const course = await Course.findById(discussion.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('只有课程教师可以置顶/取消置顶讨论', 403);
  }

  discussion.isPinned = !discussion.isPinned;
  await discussion.save();

  res.status(200).json({
    status: 'success',
    message: discussion.isPinned ? '置顶成功' : '取消置顶成功'
  });
}); 