import express from 'express';
import {
  createDiscussion,
  getCourseDiscussions,
  getDiscussion,
  replyToDiscussion,
  toggleLikeDiscussion,
  toggleLikeReply,
  togglePinDiscussion
} from '../controllers/discussionController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 讨论路由
router.get('/course/:courseId', getCourseDiscussions);
router.get('/:id', getDiscussion);
router.post('/', createDiscussion);
router.post('/:id/reply', replyToDiscussion);
router.post('/:id/like', toggleLikeDiscussion);
router.post('/:id/replies/:replyId/like', toggleLikeReply);
router.post('/:id/pin', togglePinDiscussion);

export default router; 