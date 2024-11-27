import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateUser,
  getAllUsers
} from '../controllers/userController';
import { protect, restrictTo } from '../middlewares/auth';

const router = express.Router();

// 公开路由
router.post('/register', register);
router.post('/login', login);

// 需要认证的路由
router.use(protect);
router.get('/me', getCurrentUser);
router.patch('/updateMe', updateUser);

// 管理员路由
router.use(restrictTo('admin'));
router.get('/', getAllUsers);

export default router; 