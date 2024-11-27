// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// 课程相关类型
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  students: User[];
  category: string;
  tags: string[];
  cover: string;
  materials: Material[];
  announcements: Announcement[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  title: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// 作业相关类型
export interface Assignment {
  id: string;
  title: string;
  description: string;
  course: Course;
  dueDate: string;
  points: number;
  submissions: Submission[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  student: User;
  content: string;
  attachments: string[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

// 讨论相关类型
export interface Discussion {
  id: string;
  title: string;
  content: string;
  course: Course;
  author: User;
  replies: Reply[];
  tags: string[];
  likes: string[];
  isAnnouncement: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

// API 响应类型
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
  error?: any;
} 