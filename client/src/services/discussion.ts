import api from './api';
import { Discussion, ApiResponse } from '../types';

interface CreateDiscussionData {
  title: string;
  content: string;
  courseId: string;
  tags?: string[];
  isAnnouncement?: boolean;
}

interface ReplyData {
  content: string;
}

export const createDiscussion = async (
  data: CreateDiscussionData
): Promise<ApiResponse<{ discussion: Discussion }>> => {
  return api.post('/discussions', data);
};

export const getCourseDiscussions = async (
  courseId: string,
  params?: {
    type?: 'all' | 'announcements' | 'discussions';
  }
): Promise<ApiResponse<{ discussions: Discussion[]; results: number }>> => {
  return api.get(`/discussions/course/${courseId}`, { params });
};

export const getDiscussion = async (id: string): Promise<ApiResponse<{ discussion: Discussion }>> => {
  return api.get(`/discussions/${id}`);
};

export const replyToDiscussion = async (
  id: string,
  data: ReplyData
): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/discussions/${id}/reply`, data);
};

export const toggleLikeDiscussion = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/discussions/${id}/like`);
};

export const toggleLikeReply = async (
  discussionId: string,
  replyId: string
): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/discussions/${discussionId}/replies/${replyId}/like`);
};

export const togglePinDiscussion = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/discussions/${id}/pin`);
}; 