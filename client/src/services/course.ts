import api from './api';
import { Course, ApiResponse } from '../types';

interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  cover?: string;
}

interface UpdateCourseData extends Partial<CreateCourseData> {}

export const createCourse = async (data: CreateCourseData): Promise<ApiResponse<{ course: Course }>> => {
  return api.post('/courses', data);
};

export const getAllCourses = async (params?: {
  category?: string;
  tags?: string[];
  instructor?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ courses: Course[]; results: number }>> => {
  return api.get('/courses', { params });
};

export const getCourse = async (id: string): Promise<ApiResponse<{ course: Course }>> => {
  return api.get(`/courses/${id}`);
};

export const updateCourse = async (
  id: string,
  data: UpdateCourseData
): Promise<ApiResponse<{ course: Course }>> => {
  return api.patch(`/courses/${id}`, data);
};

export const deleteCourse = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete(`/courses/${id}`);
};

export const joinCourse = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/courses/${id}/join`);
};

export const leaveCourse = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/courses/${id}/leave`);
}; 