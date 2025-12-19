import express from 'express';
import {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  toggleLike,
  addComment,
  getComments,
  deleteComment
} from '../controllers/memories.controller.js';

import { protect, optionalAuth } from '../middlewares/auth.middleware.js';
import { uploadMedia } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getMemories);
router.get('/:id', optionalAuth, getMemory);
router.post('/', protect, uploadMedia, createMemory);
router.put('/:id', protect, updateMemory);
router.delete('/:id', protect, deleteMemory);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', getComments);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
