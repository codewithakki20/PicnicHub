import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogs.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlog);

router.post('/', protect, uploadImage, createBlog);
router.put('/:id', protect, uploadImage, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
