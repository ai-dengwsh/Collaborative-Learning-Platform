import express from 'express';
import {
  createAssignment,
  getCourseAssignments,
  getAssignment,
  submitAssignment,
  gradeAssignment,
  getStudentAssignments
} from '../controllers/assignmentController';
import { protect, restrictTo } from '../middlewares/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 公共路由
router.get('/course/:courseId', getCourseAssignments);
router.get('/:id', getAssignment);

// 学生路由
router.get('/student/my-assignments', getStudentAssignments);
router.post('/:id/submit', submitAssignment);

// 教师路由
router.use(restrictTo('teacher', 'admin'));
router.post('/', createAssignment);
router.post('/:id/submissions/:submissionId/grade', gradeAssignment);

export default router; 