import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../middlewares/errorHandler';
import { generateToken } from '../utils/jwt';

// 用户注册
export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  // 检查用户是否已存在
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new AppError('用户名或邮箱已被注册', 400);
  }

  // 创建新用户
  const user = await User.create({
    username,
    email,
    password,
    role: role || 'student'
  });

  // 生成token
  const token = generateToken(user);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
});

// 用户登录
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 检查是否提供了邮箱和密码
  if (!email || !password) {
    throw new AppError('请提供邮箱和密码', 400);
  }

  // 查找用户
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('邮箱或密码错误', 401);
  }

  // 生成token
  const token = generateToken(user);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
});

// 获取当前用户信息
export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        bio: req.user.bio
      }
    }
  });
});

// 更新用户信息
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { username, avatar, bio } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { username, avatar, bio },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError('未找到用户', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio
      }
    }
  });
});

// 获取用户列表（仅管理员）
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
}); 