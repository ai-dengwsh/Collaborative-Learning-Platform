import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress } from '@mui/material';
import { uploadFile } from '../../services/upload';

interface FileUploadProps {
  onUploadSuccess: (fileInfo: { url: string; publicId: string }) => void;
  onUploadError: (error: string) => void;
}

interface UploadResponse {
  status: string;
  data: {
    url: string;
    publicId: string;
  };
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = React.useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadFile(formData);
      if (response.status === 'success' && response.data) {
        onUploadSuccess({
          url: response.data.url,
          publicId: response.data.publicId
        });
      } else {
        onUploadError('上传失败');
      }
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : '上传失败');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover'
        }
      }}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <CircularProgress />
      ) : (
        <Typography>
          {isDragActive
            ? '将文件拖放到此处'
            : '点击或拖放文件到此处上传'}
        </Typography>
      )}
    </Box>
  );
}; 