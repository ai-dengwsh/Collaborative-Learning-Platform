import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as courseService from '../../services/course';
import { Course } from '../../types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
  totalResults: number;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  totalResults: 0,
};

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    cover?: string;
  }) => {
    const response = await courseService.createCourse(data);
    return response.data;
  }
);

export const getAllCourses = createAsyncThunk(
  'courses/getAllCourses',
  async (params?: {
    category?: string;
    tags?: string[];
    instructor?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await courseService.getAllCourses(params);
    return response.data;
  }
);

export const getCourse = createAsyncThunk('courses/getCourse', async (id: string) => {
  const response = await courseService.getCourse(id);
  return response.data;
});

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }: { id: string; data: Partial<Course> }) => {
    const response = await courseService.updateCourse(id, data);
    return response.data;
  }
);

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: string) => {
  await courseService.deleteCourse(id);
  return id;
});

export const joinCourse = createAsyncThunk('courses/joinCourse', async (id: string) => {
  const response = await courseService.joinCourse(id);
  return { id, message: response.data?.message };
});

export const leaveCourse = createAsyncThunk('courses/leaveCourse', async (id: string) => {
  const response = await courseService.leaveCourse(id);
  return { id, message: response.data?.message };
});

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload.course);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建课程失败';
      })
      // Get All Courses
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.totalResults = action.payload.results;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取课程列表失败';
      })
      // Get Course
      .addCase(getCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取课程详情失败';
      })
      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
        const index = state.courses.findIndex((c) => c.id === action.payload.course.id);
        if (index !== -1) {
          state.courses[index] = action.payload.course;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新课程失败';
      })
      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((c) => c.id !== action.payload);
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除课程失败';
      })
      // Join Course
      .addCase(joinCourse.fulfilled, (state, action) => {
        const course = state.courses.find((c) => c.id === action.payload.id);
        if (course) {
          course.students.push(action.meta.arg as any);
        }
      })
      // Leave Course
      .addCase(leaveCourse.fulfilled, (state, action) => {
        const course = state.courses.find((c) => c.id === action.payload.id);
        if (course) {
          course.students = course.students.filter((s) => s.id !== action.meta.arg);
        }
      });
  },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;

export default courseSlice.reducer; 