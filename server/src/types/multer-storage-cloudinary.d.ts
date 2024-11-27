declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
  import { Request } from 'express';

  export interface CloudinaryStorageOptions {
    cloudinary: any;
    params: {
      folder?: string;
      format?: string;
      public_id?: (req: Request, file: Express.Multer.File) => string;
      transformation?: any[];
      allowed_formats?: string[];
      resource_type?: string;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File>) => void): void;
    _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error) => void): void;
  }
} 