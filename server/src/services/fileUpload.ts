import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { AppError } from '../middlewares/errorHandler';
import { Express } from 'express';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export class FileUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  private validateFile(file: Express.Multer.File) {
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError('File size exceeds limit', 400);
    }

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new AppError('Invalid file type', 400);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      this.validateFile(file);

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto'
      });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('File upload failed', 500);
    }
  }

  async deleteFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new AppError('File deletion failed', 500);
    }
  }
}

// 创建Cloudinary存储实例
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'learning-platform',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'ppt', 'pptx'],
    resource_type: 'auto'
  }
}); 