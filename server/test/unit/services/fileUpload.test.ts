import { FileUploadService } from '../../../src/services/fileUpload';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../../../src/middlewares/errorHandler';

jest.mock('cloudinary');

describe('FileUploadService', () => {
  let fileUploadService: FileUploadService;

  beforeEach(() => {
    fileUploadService = new FileUploadService();
    jest.clearAllMocks();
  });

  it('should upload file successfully', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
      stream: null,
      destination: '',
      filename: 'test.jpg',
      path: '/tmp/test.jpg'
    };

    const mockCloudinaryResponse = {
      secure_url: 'https://example.com/test.jpg',
      public_id: 'test123'
    };

    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockCloudinaryResponse);

    const result = await fileUploadService.uploadFile(mockFile);

    expect(result).toEqual({
      url: mockCloudinaryResponse.secure_url,
      publicId: mockCloudinaryResponse.public_id
    });
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFile.path, {
      resource_type: 'auto'
    });
  });

  it('should handle file size validation', async () => {
    const mockLargeFile = {
      fieldname: 'file',
      originalname: 'large.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 11 * 1024 * 1024, // 11MB
      stream: null,
      destination: '',
      filename: 'large.jpg',
      path: '/tmp/large.jpg'
    };

    await expect(fileUploadService.uploadFile(mockLargeFile)).rejects.toThrow('File size exceeds limit');
  });

  it('should handle invalid file type', async () => {
    const mockInvalidFile = {
      fieldname: 'file',
      originalname: 'test.exe',
      encoding: '7bit',
      mimetype: 'application/x-msdownload',
      buffer: Buffer.from('test'),
      size: 1024,
      stream: null,
      destination: '',
      filename: 'test.exe',
      path: '/tmp/test.exe'
    };

    await expect(fileUploadService.uploadFile(mockInvalidFile)).rejects.toThrow('Invalid file type');
  });

  it('should handle cloudinary upload failure', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
      stream: null,
      destination: '',
      filename: 'test.jpg',
      path: '/tmp/test.jpg'
    };

    (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(new Error('Upload failed'));

    await expect(fileUploadService.uploadFile(mockFile)).rejects.toThrow('File upload failed');
  });

  it('should delete file successfully', async () => {
    const publicId = 'test123';

    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: 'ok' });

    await fileUploadService.deleteFile(publicId);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(publicId);
  });

  it('should handle file deletion failure', async () => {
    const publicId = 'test123';

    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    await expect(fileUploadService.deleteFile(publicId)).rejects.toThrow('File deletion failed');
  });
}); 