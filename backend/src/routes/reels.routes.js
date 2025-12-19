import express from 'express';
import {
  getReels,
  getReel,
  createReel,
  toggleReelLike,
  toggleReelFeature,
  deleteReel,
  updateReel,
  pinReel,
  getComments,
  addComment,
  deleteComment
} from '../controllers/reels.controller.js';

import { protect, optionalAuth } from '../middlewares/auth.middleware.js';
import { uploadVideo } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getReels);
router.get('/:id', optionalAuth, getReel);
router.post('/', protect, uploadVideo, createReel);
router.put('/:id', protect, updateReel);
router.post('/:id/like', protect, toggleReelLike);
router.put('/:id/feature', protect, toggleReelFeature);
router.put('/:id/pin', protect, pinReel);
router.delete('/:id', protect, deleteReel);

// Comments
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
