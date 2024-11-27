import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  joinCourse,
  leaveCourse,
  clearError,
  clearCurrentCourse,
} from '../store/slices/courseSlice';
import { Course } from '../types';

export const useCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, currentCourse, loading, error, totalResults } = useSelector(
    (state: RootState) => state.courses
  );

  const handleCreateCourse = async (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    cover?: string;
  }) => {
    try {
      await dispatch(createCourse(data)).unwrap();
    } catch (error) {
      console.error('Course creation failed:', error);
    }
  };

  const handleGetAllCourses = async (params?: {
    category?: string;
    tags?: string[];
    instructor?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      await dispatch(getAllCourses(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleGetCourse = async (id: string) => {
    try {
      await dispatch(getCourse(id)).unwrap();
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const handleUpdateCourse = async (id: string, data: Partial<Course>) => {
    try {
      await dispatch(updateCourse({ id, data })).unwrap();
    } catch (error) {
      console.error('Course update failed:', error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await dispatch(deleteCourse(id)).unwrap();
    } catch (error) {
      console.error('Course deletion failed:', error);
    }
  };

  const handleJoinCourse = async (id: string) => {
    try {
      await dispatch(joinCourse(id)).unwrap();
    } catch (error) {
      console.error('Failed to join course:', error);
    }
  };

  const handleLeaveCourse = async (id: string) => {
    try {
      await dispatch(leaveCourse(id)).unwrap();
    } catch (error) {
      console.error('Failed to leave course:', error);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleClearCurrentCourse = () => {
    dispatch(clearCurrentCourse());
  };

  return {
    courses,
    currentCourse,
    loading,
    error,
    totalResults,
    createCourse: handleCreateCourse,
    getAllCourses: handleGetAllCourses,
    getCourse: handleGetCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    joinCourse: handleJoinCourse,
    leaveCourse: handleLeaveCourse,
    clearError: handleClearError,
    clearCurrentCourse: handleClearCurrentCourse,
  };
}; 