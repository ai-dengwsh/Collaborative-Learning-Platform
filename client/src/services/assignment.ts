import api from './api';
import { Assignment, ApiResponse } from '../types';

interface CreateAssignmentData {
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  points: number;
}

interface SubmitAssignmentData {
  content: string;
  attachments?: string[];
}

interface GradeSubmissionData {
  grade: number;
  feedback?: string;
}

export const createAssignment = async (
  data: CreateAssignmentData
): Promise<ApiResponse<{ assignment: Assignment }>> => {
  return api.post('/assignments', data);
};

export const getCourseAssignments = async (
  courseId: string
): Promise<ApiResponse<{ assignments: Assignment[]; results: number }>> => {
  return api.get(`/assignments/course/${courseId}`);
};

export const getAssignment = async (id: string): Promise<ApiResponse<{ assignment: Assignment }>> => {
  return api.get(`/assignments/${id}`);
};

export const submitAssignment = async (
  id: string,
  data: SubmitAssignmentData
): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/assignments/${id}/submit`, data);
};

export const gradeAssignment = async (
  assignmentId: string,
  submissionId: string,
  data: GradeSubmissionData
): Promise<ApiResponse<{ message: string }>> => {
  return api.post(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, data);
};

export const getStudentAssignments = async (): Promise<
  ApiResponse<{ assignments: Assignment[]; results: number }>
> => {
  return api.get('/assignments/student/my-assignments');
}; 