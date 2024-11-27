import axios from 'axios';

export interface UploadResponse {
  status: string;
  data: {
    url: string;
    publicId: string;
  };
}

export const uploadFile = async (formData: FormData): Promise<UploadResponse> => {
  const response = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}; 