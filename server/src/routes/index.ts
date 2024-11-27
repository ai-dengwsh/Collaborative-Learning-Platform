import express from 'express';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import assignmentRoutes from './assignmentRoutes';
import discussionRoutes from './discussionRoutes';

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/courses', courseRoutes);
router.use('/api/assignments', assignmentRoutes);
router.use('/api/discussions', discussionRoutes);

export default router; 