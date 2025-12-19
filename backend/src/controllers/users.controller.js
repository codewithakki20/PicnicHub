// ==============================
// controllers/users.controller.js
// ==============================
import User from '../models/User.js';
import path from 'path';
import { uploadImage as uploadImageToCloud } from '../config/cloudinary.js';

// Get current user profile
export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user._id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update current user profile (supports avatar upload via req.file)
export const updateMe = async (req, res) => {
  try {
    const { name, bio, avatarUrl, college, branch, course, year } = req.body;

    if (!req.user || !req.user._id) {
      console.error("updateMe error: req.user is invalid:", req.user);
      return res.status(401).json({ message: "Authentication failed. Please login again." });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields only if provided
    if (name !== undefined && name !== null) {
      user.name = name.trim();
    }
    if (bio !== undefined && bio !== null) {
      user.bio = bio.trim();
    }
    if (college !== undefined && college !== null) {
      user.college = college;
    }
    if (branch !== undefined && branch !== null) {
      user.branch = branch.trim();
    }
    if (course !== undefined && course !== null) {
      user.course = course.trim();
    }
    if (year !== undefined && year !== null) {
      user.year = year.trim();
    }
    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    // Handle avatar file upload if provided
    if (req.file) {
      const localPath = req.file.path || path.join(req.file.destination || 'uploads', req.file.filename);
      try {
        const uploadResult = await uploadImageToCloud(localPath, 'picnichub/avatars');
        user.avatarUrl = uploadResult.secure_url || uploadResult.url;
      } catch (err) {
        // Fallback to local path if Cloudinary fails
        user.avatarUrl = `/uploads/${req.file.filename}`;
        console.error('Cloud upload failed for avatar:', err.message || err);
      }
    }

    await user.save();

    // Return user without password hash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json(userResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by id (public)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin: get all users (optionally paginated)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments();
    res.json({
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Follow or Unfollow a user
export const followUser = async (req, res) => {
  try {
    console.log("followUser called for target:", req.params.id);
    console.log("req.user:", req.user);

    if (!req.user) {
      console.error("req.user is MISSING in followUser controller!");
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    // Use req.user directly or fetch if needed, but req.user should be sufficient if we just need ID.
    // However, we want to update 'following' array on current user.
    // The req.user from protect middleware IS a mongoose document, so we can use it directly?
    // Let's rely on finding it again just to be safe and consistent with previous code, but define it safely.

    let currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      // If for some reason findById returns null (e.g. deleted concurrently), fallback to req.user or error
      console.error("currentUser not found in DB even though token valid");
      currentUser = req.user; // fallback
    }

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    console.log("targetUser found:", targetUser._id);
    console.log("currentUser found:", currentUser._id);

    // Check if already following
    if (targetUser.followers.includes(req.user._id)) {
      // Unfollow
      console.log("Unfollowing...");
      await targetUser.updateOne({ $pull: { followers: req.user._id } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.json({ message: 'User unfollowed', isFollowing: false });
    } else {
      // Follow
      console.log("Following...");
      await targetUser.updateOne({ $push: { followers: req.user._id } });
      await currentUser.updateOne({ $push: { following: req.params.id } });

      // Create Notification
      console.log("Creating notification...");
      const { createNotification } = await import('./notificationController.js');
      await createNotification({
        recipientId: targetUser._id,
        senderId: req.user._id,
        type: 'follow',
        referenceId: currentUser._id, // References the user who followed
        onModel: 'User'
      });

      res.json({ message: 'User followed', isFollowing: true });
    }
  } catch (error) {
    console.error("followUser Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unfollow user (Explicit)
export const unfollowUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (targetUser.followers.includes(req.user._id)) {
      await targetUser.updateOne({ $pull: { followers: req.user._id } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.json({ message: 'User unfollowed' });
    } else {
      res.status(400).json({ message: 'You are not following this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Get user with password
    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // 3. Update password (pre-save hook will hash it)
    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get suggested users (not followed by me)
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const followingIds = currentUser.following || [];

    // Exclude myself and people I follow
    const suggestions = await User.find({
      _id: { $nin: [...followingIds, req.user._id] }
    })
      .select('name avatarUrl') // Only need basic info
      .limit(10) // Limit to 10 suggestions
      .lean();

    console.log(`[getSuggestedUsers] Found ${suggestions.length} suggestions for user ${req.user._id}`);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name avatarUrl")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.followers || []);
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following", "name avatarUrl")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.following || []);
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default { getMe, updateMe, getUser, getAllUsers, followUser, unfollowUser, changePassword, getSuggestedUsers, getFollowers, getFollowing };
