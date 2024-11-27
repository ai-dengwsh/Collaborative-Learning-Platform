import api from './api';
import { User, ApiResponse } from '../types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  username: string;
  role?: 'student' | 'teacher';
}

interface AuthResponse extends ApiResponse<{ user: User; token: string }> {}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  return api.post('/users/login', data);
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return api.post('/users/register', data);
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  return api.get('/users/me');
};

export const updateProfile = async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
  return api.patch('/users/updateMe', data);
}; 