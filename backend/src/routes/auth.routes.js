import express from 'express';
import {
  register,
  login,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  makeAdmin,
  sendOtp,
  verifyOtp,
  googleLogin,
  verifyPasswordResetOtp,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyPasswordResetOtp);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/send-otp', sendOtp);
router.post('/resend-otp', sendOtp); // Alias for resending OTP
router.post('/verify-otp', verifyOtp);
router.post('/google', googleLogin);

// Private
router.get('/me', protect, getMe);
router.post('/make-admin', protect, makeAdmin); // Dev only

export default router;
