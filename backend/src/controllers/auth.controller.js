// ==============================
// controllers/auth.controller.js
// ==============================
import User from '../models/User.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    console.log("Register API Hit. Body:", req.body);
    const { name, email, password } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user exists
    const trimmedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: trimmedEmail });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create user (isVerified: false by default)
    user = new User({
      name,
      email,
      passwordHash: password,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp); // For debugging
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Send OTP Email
    // Send OTP Email
    const message = `Your OTP is ${otp}. It is valid for 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4CAF50;">Verify Your Account</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="margin: 0; letter-spacing: 5px; color: #333;">${otp}</h1>
        </div>
        <p>This code is valid for 10 minutes.</p>
        <p style="font-size: 0.9em; color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    sendEmail({ to: user.email, subject: 'Verify your account', text: message, html }).catch(err => {
      console.error("Failed to send OTP email:", err);
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email for OTP to verify your account.',
      email: user.email
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check user
    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail }).select('+passwordHash +isVerified');
    if (!user) {
      console.log(`Login failed: User not found for email ${trimmedEmail}`);
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for user ${trimmedEmail}`);
      return res.status(400).json({ message: 'Password mismatch' });
    }

    // Check Verification
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Account not verified. Please verify your email.',
        isVerified: false,
        email: user.email
      });
    }

    // Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// placeholder refresh token implementation (expand as needed)
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    // Implement refresh logic if you add refresh tokens persistence
    res.json({ message: 'Refresh token endpoint (not implemented)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Security: don't reveal if user exists or not
    if (!user) {
      return res.json({ message: 'If user exists, password reset OTP sent' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetOtp = otp;
    user.passwordResetOtpExpires = otpExpires;
    await user.save();

    const subject = 'Password Reset OTP';
    const text = `Your password reset OTP is ${otp}. It expires in 10 minutes.`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>Your password reset OTP is <strong>${otp}</strong>.</p>
      <p>It is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    sendEmail({ to: user.email, subject, text, html }).catch(err => {
      console.error('Failed to send password reset OTP email:', err);
    });

    res.json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    console.log("Reset Password Payload:", req.body); // DEBUG LOG
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      console.log("Missing fields in resetPassword");
      return res.status(400).json({ message: 'Email, OTP, and new password required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordResetOtp +passwordResetOtpExpires');

    if (!user) {
      console.log("User not found for resetPassword:", normalizedEmail);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.passwordResetOtp || user.passwordResetOtp !== otp) {
      console.log("Invalid OTP for resetPassword. Expected:", user.passwordResetOtp, "Got:", otp);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.passwordResetOtpExpires < Date.now()) {
      console.log("OTP expired for resetPassword");
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Update password
    user.passwordHash = newPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now login.' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    // Development only - make current user admin
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ message: 'Not available in production' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({
      message: 'User promoted to admin',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP (Resend):", otp); // For debugging
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const subject = 'Your OTP Code';
    const text = `Your OTP code is ${otp}. It expires in 10 minutes.`;
    const html = `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;

    sendEmail({ to: email, subject, text, html }).catch(err => {
      console.error("Failed to send OTP email (Resend):", err);
    });

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    // Generate Token for immediate login
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {
  register,
  login,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  makeAdmin,
  sendOtp,
  verifyOtp,
};
