// ========================================
// controllers/reels.controller.js
// ========================================
import Reel from '../models/Reel.js';
import Like from '../models/Like.js';
import User from '../models/User.js';
import Location from '../models/Location.js';
import path from 'path';
import { uploadVideo as uploadVideoToCloud, getVideoThumbnailUrl } from '../config/cloudinary.js';

// GET REELS
export const getReels = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, featured, my } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Handle 'my' parameter to get current user's reels
    if (my === 'true' && req.user) {
      query.uploaderId = req.user._id;
    } else if (userId) {
      query.uploaderId = userId;
    }

    if (featured === 'true') query.isFeatured = true;

    const reels = await Reel.find(query)
      .populate('uploaderId', 'name username avatarUrl')
      .populate('locationId', 'name coords')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (req.user) {
      const reelIds = reels.map(r => r._id);
      const userLikes = await Like.find({ userId: req.user._id, resourceType: 'reel', resourceId: { $in: reelIds } }).lean();
      const likedSet = new Set(userLikes.map(l => l.resourceId.toString()));
      reels.forEach(reel => (reel.isLiked = likedSet.has(reel._id.toString())));
    }

    const total = await Reel.countDocuments(query);
    res.json({ reels, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SINGLE REEL
export const getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('uploaderId', 'name username avatarUrl')
      .populate('locationId', 'name coords')
      .lean();

    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    if (req.user) {
      const like = await Like.findOne({ userId: req.user._id, resourceType: 'reel', resourceId: reel._id });
      reel.isLiked = !!like;
    }

    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE REEL
export const createReel = async (req, res) => {
  try {
    const { caption } = req.body;
    let { locationId } = req.body;
    if (locationId === 'undefined' || locationId === 'null' || locationId === '') locationId = null;

    const user = await User.findById(req.user._id);
    if (!req.file) return res.status(400).json({ message: 'Please upload a video' });

    let videoUrl = `/uploads/${req.file.filename}`;
    let coverImage = '';
    const localPath = req.file.path || path.join(req.file.destination || 'uploads', req.file.filename);

    try {
      const uploaded = await uploadVideoToCloud(localPath, 'picnichub/reels');
      videoUrl = uploaded.secure_url || uploaded.url || videoUrl;
      coverImage = getVideoThumbnailUrl(uploaded.public_id);
    } catch (err) {
      console.error('Cloud upload failed:', err.message || err);
      // Fallback to local path if Cloudinary fails
    }

    const reel = await Reel.create({
      videoUrl,
      coverImage,
      caption: caption || '',
      locationId: locationId || null,
      uploaderId: req.user._id,
    });

    res.status(201).json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// TOGGLE REEL LIKE
export const toggleReelLike = async (req, res) => {
  try {
    const reelId = req.params.id;
    const userId = req.user._id;
    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const existing = await Like.findOne({ resourceType: 'reel', resourceId: reelId, userId });
    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      reel.likesCount = Math.max(0, reel.likesCount - 1);
      await reel.save();
      return res.json({ liked: false, likesCount: reel.likesCount });
    }

    await Like.create({ resourceType: 'reel', resourceId: reelId, userId });
    reel.likesCount += 1;
    await reel.save();

    // Create Notification
    const { createNotification } = await import('./notifications.controller.js');
    await createNotification({
      recipientId: reel.uploaderId,
      senderId: userId,
      type: 'like_reel',
      referenceId: reel._id,
      onModel: 'Reel'
    });

    res.json({ liked: true, likesCount: reel.likesCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// TOGGLE FEATURE (admin)
export const toggleReelFeature = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    reel.isFeatured = !reel.isFeatured;
    await reel.save();
    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE reel
export const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    // Check if user is admin or owner
    if (req.user.role !== 'admin' && reel.uploaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this reel' });
    }

    await Reel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE REEL (caption, etc.)
export const updateReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    // Check if user is admin or owner
    if (req.user.role !== 'admin' && reel.uploaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reel' });
    }

    const { caption, locationId } = req.body;
    if (caption !== undefined) reel.caption = caption;
    if (locationId !== undefined) {
      reel.locationId = (locationId === 'undefined' || locationId === 'null' || locationId === '') ? null : locationId;
    }

    await reel.save();
    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PIN/UNPIN REEL (admin only)
export const pinReel = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const { isPinned } = req.body;
    reel.isPinned = isPinned !== undefined ? isPinned : !reel.isPinned;
    await reel.save();

    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Import Comment model dynamically to avoid circular deps if any, or just import at top
    const Comment = (await import('../models/Comment.js')).default;

    const comments = await Comment.find({ resourceType: 'reel', resourceId: req.params.id })
      .populate('authorId', 'name username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Comment.countDocuments({ resourceType: 'reel', resourceId: req.params.id });

    res.json({ comments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    const user = await User.findById(req.user._id);
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const Comment = (await import('../models/Comment.js')).default;

    const comment = await Comment.create({
      resourceType: 'reel',
      resourceId: req.params.id,
      authorId: req.user._id,
      authorName: user.name,
      text,
      parentCommentId: parentCommentId || null,
    });

    reel.commentsCount = (reel.commentsCount || 0) + 1;
    await reel.save();

    // Create Notification
    const { createNotification } = await import('./notifications.controller.js');
    await createNotification({
      recipientId: reel.uploaderId,
      senderId: req.user._id,
      type: 'comment_reel',
      referenceId: reel._id,
      onModel: 'Reel'
    });

    const populatedComment = await Comment.findById(comment._id).populate('authorId', 'name username avatarUrl').lean();

    res.status(201).json({ comment: populatedComment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const Comment = (await import('../models/Comment.js')).default;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    const reel = await Reel.findById(id);
    if (reel) {
      reel.commentsCount = Math.max(0, (reel.commentsCount || 0) - 1);
      await reel.save();
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {
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
  deleteComment,
};
