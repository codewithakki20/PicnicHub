import express from 'express';
import {
  getMe,
  updateMe,
  getUser,
  getAllUsers,
  followUser,
  unfollowUser,
  changePassword,
  getSuggestedUsers,
  getFollowers,
  getFollowing
} from '../controllers/users.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Multer error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 50MB.' });
    }
    if (err.message === 'Only image and video files allowed') {
      return res.status(400).json({ message: 'Invalid file type. Only images and videos are allowed.' });
    }
    return res.status(400).json({ message: 'Upload error', error: err.message });
  }
  next();
};

// User routes
router.get('/me', protect, getMe);
router.get('/suggested', protect, getSuggestedUsers);
router.put('/me', protect, uploadImage, handleUploadError, updateMe);
router.put('/me/password', protect, changePassword);
router.get('/all', protect, getAllUsers);
router.get('/:id', getUser);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);

export default router;
