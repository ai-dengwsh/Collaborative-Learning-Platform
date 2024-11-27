import express from 'express';
import { upload } from '../utils/upload';
import {
  uploadFile,
  deleteFile
} from '../controllers/uploadController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), uploadFile);
router.delete('/:publicId', deleteFile);

export default router; 