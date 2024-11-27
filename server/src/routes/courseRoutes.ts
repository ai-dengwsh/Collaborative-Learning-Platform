import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  joinCourse,
  leaveCourse
} from '../controllers/courseController';
import { protect, restrictTo } from '../middlewares/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 公共路由
router.get('/', getAllCourses);
router.get('/:id', getCourse);

// 学生路由
router.post('/:id/join', joinCourse);
router.post('/:id/leave', leaveCourse);

// 教师路由
router.use(restrictTo('teacher', 'admin'));
router.post('/', createCourse);
router.patch('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router; 