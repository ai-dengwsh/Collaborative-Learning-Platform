import multer from 'multer';
import { storage } from '../services/fileUpload';
import { AppError } from '../middlewares/errorHandler';
import { Request } from 'express';

const fileSize = 10 * 1024 * 1024; // 10MB

// 文件类型过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('不支持的文件类型', 400));
  }
};

// 创建Multer实例
export const upload = multer({
  storage: storage as multer.StorageEngine,
  limits: { fileSize },
  fileFilter
}); 