import express from 'express';
import {
  getStats,
  getRecentActivity,
  getMonthlyUploads,
  getPending,
  approveMemory,
  getMemories,
  deleteMemory,
  updateMemory,
  togglePinMemory,
  getMemoryStats,
  getUsers,
  getAllUsers,
  banUser,
  updateUserRole,
  getUserActivityLogs,
  createLocation,
  updateLocation,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteLocation,
  togglePinLocation,
  reorderLocations,
  getAdminLocations,
  getLocationStats
} from '../controllers/admin.controller.js';

import { protect, admin } from '../middlewares/auth.middleware.js';
import { uploadImage, uploadImages } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/recent-activity', getRecentActivity);
router.get('/monthly-uploads', getMonthlyUploads);
router.get('/pending', getPending);
router.post('/memories/:id/approve', approveMemory);
router.get('/memories', getMemories);
router.delete('/memories/:id', deleteMemory);
router.put('/memories/:id', updateMemory);
router.put('/memories/:id/pin', togglePinMemory);
router.get('/memories/:id/stats', getMemoryStats);


router.get('/users', getUsers);
router.get('/users/all', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/role', updateUserRole);
router.get('/users/:id/logs', getUserActivityLogs);

router.get('/locations', getAdminLocations);
router.get('/locations/:id/stats', getLocationStats);
router.post('/locations', uploadImages, createLocation);
router.put('/locations/:id', uploadImages, updateLocation);
router.delete('/locations/:id', deleteLocation);
router.put('/locations/:id/pin', togglePinLocation);
router.put('/locations/reorder', reorderLocations);

router.post('/blogs', uploadImage, createBlog);
router.put('/blogs/:id', uploadImage, updateBlog);
router.delete('/blogs/:id', deleteBlog);

export default router;
