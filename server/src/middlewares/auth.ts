import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { verifyToken, extractToken } from '../utils/jwt';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) 获取token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new AppError('请先登录！', 401));
    }

    const token = extractToken(authHeader);

    // 2) 验证token
    const decoded = verifyToken(token);

    // 3) 检查用户是否仍然存在
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('此token对应的用户不存在', 401));
    }

    // 4) 将用户信息添加到请求对象中
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('认证失败', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('您没有权限执行此操作', 403));
    }
    next();
  };
}; 