// ========================================
// controllers/memories.controller.js
// Triggers restart
// ========================================
import Memory from '../models/Memory.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import path from 'path';
import { uploadImage as uploadImageToCloud, uploadVideo as uploadVideoToCloud } from '../config/cloudinary.js';

// GET all memories with filters
export const getMemories = async (req, res) => {
  try {
    console.log('GET /memories request received');
    const { page = 1, limit = 20, year, tag, locationId, search, status, userId, my } = req.query;
    const query = {};

    // Handle 'my' parameter to get current user's memories
    if (my === 'true' && req.user) {
      query.uploaderId = req.user._id;
    } else if (userId) {
      query.uploaderId = userId;
    }

    if (year) query.year = parseInt(year);
    if (tag) query.tags = { $in: [tag] };
    if (locationId) query.locationId = locationId;
    if (search) query.$text = { $search: search };

    console.log('Query:', query);
    console.log('User:', req.user ? req.user._id : 'Guest');

    if (!(req.user && req.user.role === 'admin')) {
      query.visibility = 'public';
    } else {
      if (status) query.isApproved = status === 'approved';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log('Fetching memories...');
    const memories = await Memory.find(query)
      .populate('uploaderId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    console.log(`Fetched ${memories.length} memories`);

    if (req.user) {
      console.log('Processing user likes...');
      console.log('User ID:', req.user._id);

      const memoryIds = memories.map(m => m._id);
      console.log('Memory IDs:', memoryIds);

      let userLikes = [];
      try {
        userLikes = await Like.find({
          userId: req.user._id,
          resourceType: 'memory',
          resourceId: { $in: memoryIds },
        }).lean();
        console.log('Likes found:', userLikes.length);
      } catch (err) {
        console.error('Like.find Error:', err);
        throw err; // Re-throw to main catch, or handle gracefully
      }

      const likedSet = new Set(userLikes.map(l => l.resourceId.toString()));
      memories.forEach(memory => {
        memory.isLiked = likedSet.has(memory._id.toString());
      });
    }

    const total = await Memory.countDocuments(query);
    res.json({ memories, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('GET /memories Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single memory
export const getMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('uploaderId', 'name avatarUrl')
      .lean();
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    if (req.user) {
      const like = await Like.findOne({ userId: req.user._id, resourceType: 'memory', resourceId: memory._id });
      memory.isLiked = !!like;
    }

    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE memory (uploads images/videos to Cloudinary)
export const createMemory = async (req, res) => {
  try {
    const { title, description, year, tags, locationId, visibility = 'public' } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const media = [];

    // Process images
    if (req.files?.images) {
      for (const file of req.files.images) {
        const localPath = file.path || path.join(file.destination || 'uploads', file.filename);
        try {
          const uploadResult = await uploadImageToCloud(localPath, 'picnichub/memories');
          media.push({ url: uploadResult.secure_url || uploadResult.url, type: 'image' });
        } catch (err) {
          console.error('Cloud upload failed for image:', err.message || err);
          // Fallback to local path if Cloudinary fails
          media.push({ url: `/uploads/${file.filename}`, type: 'image' });
        }
      }
    }

    // Process videos
    if (req.files?.videos) {
      for (const file of req.files.videos) {
        const localPath = file.path || path.join(file.destination || 'uploads', file.filename);
        try {
          const uploadResult = await uploadVideoToCloud(localPath, 'picnichub/memories');
          media.push({ url: uploadResult.secure_url || uploadResult.url, type: 'video' });
        } catch (err) {
          console.error('Cloud upload failed for video:', err.message || err);
          // Fallback to local path if Cloudinary fails
          media.push({ url: `/uploads/${file.filename}`, type: 'video' });
        }
      }
    }

    if (media.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image or video' });
    }

    // Handle location - validate ObjectId first
    let locationSnapshot = null;
    if (locationId && locationId.trim()) {
      // Check if locationId is a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(locationId.trim())) {
        try {
          const Location = (await import('../models/Location.js')).default;
          const location = await Location.findById(locationId.trim());
          if (location) {
            locationSnapshot = { name: location.name, coords: location.coords };
          } else {
            console.warn(`Location with ID ${locationId} not found`);
            // Continue without location if not found
          }
        } catch (err) {
          console.error('Error fetching location:', err.message || err);
          // Continue without location if it fails
        }
      } else {
        console.warn(`Invalid location ID format: ${locationId}. Expected MongoDB ObjectId.`);
        // Continue without location if invalid format
      }
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags.filter(t => t && t.trim());
      } else if (typeof tags === 'string') {
        parsedTags = tags.split(',').map(t => t.trim()).filter(t => t);
      }
    }

    // Validate year if provided
    let parsedYear = new Date().getFullYear();
    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum) && yearNum > 1900 && yearNum <= new Date().getFullYear() + 1) {
        parsedYear = yearNum;
      } else {
        console.warn(`Invalid year provided: ${year}, using current year`);
      }
    }

    // Create memory
    const memory = await Memory.create({
      title: title.trim(),
      description: description.trim(),
      media,
      thumbnailUrl: media[0]?.url || '',
      uploaderId: req.user._id,
      userId: req.user._id,
      uploaderName: user.name,
      locationId: locationId && locationId.trim() && mongoose.Types.ObjectId.isValid(locationId.trim()) ? locationId.trim() : null,
      locationSnapshot,
      year: parsedYear,
      tags: parsedTags,
      isApproved: true,
      visibility: visibility || 'public',
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error('Create memory error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({
        message: 'Validation error',
        error: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate entry',
        error: 'A memory with this information already exists'
      });
    }

    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// UPDATE memory
export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    const ownerId = (memory.userId || memory.uploaderId).toString();
    if (ownerId !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized to update this memory' });

    const { title, description, tags, visibility } = req.body;
    if (title) memory.title = title;
    if (description !== undefined) memory.description = description;
    if (tags) memory.tags = Array.isArray(tags) ? tags : tags.split(',');
    if (visibility) memory.visibility = visibility;

    memory.updatedAt = new Date();
    await memory.save();

    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE memory
export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    const ownerId = (memory.userId || memory.uploaderId).toString();
    if (ownerId !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized to delete this memory' });

    await Like.deleteMany({ resourceType: 'memory', resourceId: memory._id });
    await Comment.deleteMany({ resourceId: memory._id, resourceType: 'memory' }).catch(() => Comment.deleteMany({ memoryId: memory._id }));
    await Memory.findByIdAndDelete(req.params.id);

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// TOGGLE LIKE
export const toggleLike = async (req, res) => {
  try {
    const memoryId = req.params.id;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ resourceType: 'memory', resourceId: memoryId, userId });
    const memory = await Memory.findById(memoryId);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      memory.likesCount = Math.max(0, memory.likesCount - 1);
      await memory.save();
      res.json({ liked: false, likesCount: memory.likesCount });
    } else {
      await Like.create({ resourceType: 'memory', resourceId: memoryId, userId });
      memory.likesCount += 1;
      await memory.save();

      // Create Notification
      const { createNotification } = await import('./notificationController.js');
      await createNotification({
        recipientId: memory.uploaderId, // or userId
        senderId: userId,
        type: 'like_memory',
        referenceId: memory._id,
        onModel: 'Memory'
      });

      res.json({ liked: true, likesCount: memory.likesCount });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    const user = await User.findById(req.user._id);
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    const comment = await Comment.create({
      resourceType: 'memory',
      resourceId: req.params.id,
      authorId: req.user._id,
      authorName: user.name,
      text,
      parentCommentId: parentCommentId || null,
    });

    memory.commentsCount += 1;
    await memory.save();

    // Create Notification
    const { createNotification } = await import('./notificationController.js');
    await createNotification({
      recipientId: memory.uploaderId,
      senderId: req.user._id,
      type: 'comment_memory',
      referenceId: memory._id,
      onModel: 'Memory'
    });

    const populatedComment = await Comment.findById(comment._id).populate('authorId', 'name avatarUrl').lean();

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment.find({ resourceType: 'memory', resourceId: req.params.id })
      .populate('authorId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Comment.countDocuments({ resourceType: 'memory', resourceId: req.params.id });

    res.json({ comments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    const memory = await Memory.findById(id);
    if (memory) {
      memory.commentsCount = Math.max(0, memory.commentsCount - 1);
      await memory.save();
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
};
