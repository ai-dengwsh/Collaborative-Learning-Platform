import { Request, Response } from 'express';
import { catchAsync } from '../middlewares/errorHandler';
import { FileUploadService } from '../services/fileUpload';
import { AppError } from '../middlewares/errorHandler';

const fileUploadService = new FileUploadService();

// 上传单个文件
export const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('请选择要上传的文件', 400);
  }

  const result = await fileUploadService.uploadFile(req.file);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// 删除文件
export const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new AppError('缺少文件ID', 400);
  }

  await fileUploadService.deleteFile(publicId);

  res.status(200).json({
    status: 'success',
    message: '文件删除成功'
  });
}); 