// ========================================
// controllers/admin.controller.js
// ========================================
import User from '../models/User.js';
import Memory from '../models/Memory.js';
import Location from '../models/Location.js';
import Blog from '../models/Blog.js';
import Reel from '../models/Reel.js';
import path from 'path';

// Dashboard stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
    const totalMemories = await Memory.countDocuments();
    const totalReels = await Reel.countDocuments();
    const pendingMemories = await Memory.countDocuments({ isApproved: false });

    const topLocationsRaw = await Memory.aggregate([
      { $match: { locationId: { $ne: null } } },
      { $group: { _id: '$locationId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const locationIds = topLocationsRaw.map(l => l._id).filter(Boolean);
    const locations = await Location.find({ _id: { $in: locationIds } }).lean();

    const recentUploads = await Memory.find().populate('uploaderId', 'name avatarUrl').sort({ createdAt: -1 }).limit(10).lean();

    res.json({
      stats: { totalUsers, activeUsers, totalMemories, totalReels, pendingMemories },
      topLocations: locations.map((loc, idx) => ({ ...loc, memoryCount: topLocationsRaw[idx]?.count || 0 })),
      recentUploads,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Recent activity (for dashboard)
export const getRecentActivity = async (req, res) => {
  try {
    const activities = [];

    // Get recent memories
    const recentMemories = await Memory.find()
      .populate('uploaderId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    recentMemories.forEach(m => {
      activities.push({
        title: `Memory: ${m.title}`,
        type: 'memory',
        time: new Date(m.createdAt).toLocaleString(),
        id: m._id
      });
    });

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .populate('authorId', 'name')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    recentBlogs.forEach(b => {
      activities.push({
        title: `Blog: ${b.title}`,
        type: 'blog',
        time: new Date(b.createdAt).toLocaleString(),
        id: b._id
      });
    });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    recentUsers.forEach(u => {
      activities.push({
        title: `New user: ${u.name}`,
        type: 'user',
        time: new Date(u.createdAt).toLocaleString(),
        id: u._id
      });
    });

    // Sort by time (newest first) and return top 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Monthly uploads for chart
export const getMonthlyUploads = async (req, res) => {
  try {
    // Get last 12 months of data
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        uploads: 0
      });
    }

    // Count memories by month
    const memories = await Memory.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Map data to months
    memories.forEach(m => {
      const monthName = new Date(2024, m._id.month - 1).toLocaleString('default', { month: 'short' });
      const idx = months.findIndex(mon => mon.month === monthName);
      if (idx !== -1) {
        months[idx].uploads += m.count;
      }
    });

    res.json(months);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getPending = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const memories = await Memory.find({ isApproved: false }).populate('uploaderId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await Memory.countDocuments({ isApproved: false });

    res.json({ memories, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve memory
export const approveMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    memory.isApproved = true;
    await memory.save();
    res.json({ message: 'Memory approved', memory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all memories (admin)
export const getMemories = async (req, res) => {
  try {
    const { limit = 500, status } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.isApproved = status === 'approved';
    }

    const memories = await Memory.find(query)
      .populate('uploaderId', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Add uploader name for easier access
    const memoriesWithUploaderName = memories.map(m => ({
      ...m,
      uploaderName: m.uploaderId?.name || 'Unknown'
    }));

    res.json({ memories: memoriesWithUploaderName });
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete memory (admin)
export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update memory (admin)
export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    const { title, description, year, tags, locationName } = req.body;

    if (title !== undefined) memory.title = title;
    if (description !== undefined) memory.description = description;
    if (year !== undefined) memory.year = year;
    if (tags !== undefined) memory.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    if (locationName !== undefined) memory.locationName = locationName;

    await memory.save();
    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle pin memory (admin)
export const togglePinMemory = async (req, res) => {
  try {
    const { isPinned } = req.body;
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    memory.isPinned = isPinned;
    await memory.save();
    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get memory stats (admin)
export const getMemoryStats = async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await Memory.findById(id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    // Generate monthly history (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        views: Math.floor(Math.random() * (memory.views || 10)) // Simulated data
      });
    }

    res.json({ history: months, totalViews: memory.views || 0, totalLikes: memory.likes || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get users (paginated)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await User.countDocuments();

    res.json({ users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ALL users (no pagination) - admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ban / unban user
export const banUser = async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot ban admin users' });

    user.isBanned = isBanned !== undefined ? isBanned : !user.isBanned;
    await user.save();
    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user activity logs
export const getUserActivityLogs = async (req, res) => {
  try {
    const userId = req.params.id;
    const activities = [];

    // Get memories
    const memories = await Memory.find({ uploaderId: userId }).sort({ createdAt: -1 }).limit(10).lean();
    memories.forEach(m => {
      activities.push({
        action: `Uploaded memory: ${m.title}`,
        time: new Date(m.createdAt).toLocaleString(),
        timestamp: new Date(m.createdAt)
      });
    });

    // Get blogs
    const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 }).limit(10).lean();
    blogs.forEach(b => {
      activities.push({
        action: `Published blog: ${b.title}`,
        time: new Date(b.createdAt).toLocaleString(),
        timestamp: new Date(b.createdAt)
      });
    });

    // Get reels
    const reels = await Reel.find({ uploaderId: userId }).sort({ createdAt: -1 }).limit(10).lean();
    reels.forEach(r => {
      activities.push({
        action: `Uploaded reel: ${r.caption || 'Untitled'}`,
        time: new Date(r.createdAt).toLocaleString(),
        timestamp: new Date(r.createdAt)
      });
    });

    // Sort by timestamp desc
    activities.sort((a, b) => b.timestamp - a.timestamp);

    res.json(activities.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create location (admin)
export const createLocation = async (req, res) => {
  try {
    const { name, description, lat, lng, tags, yearTags } = req.body;

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        const localPath = file.path || path.join(file.destination || 'uploads', file.filename);
        return import('../config/cloudinary.js').then(({ uploadImage: uploadToCloud }) =>
          uploadToCloud(localPath, 'picnichub/locations')
            .then(result => result.secure_url || result.url)
            .catch(err => {
              console.error('Cloud upload failed:', err);
              return `/uploads/${file.filename}`; // Fallback
            })
        );
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    const location = await Location.create({
      name,
      description,
      coords: { lat: parseFloat(lat), lng: parseFloat(lng) },
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t)) : [],
      yearTags: yearTags ? (Array.isArray(yearTags) ? yearTags.map(y => parseInt(y)) : yearTags.split(',').map(y => parseInt(y)).filter(y => !isNaN(y))) : [],
      images: imageUrls,
      addedBy: req.user._id,
    });
    res.status(201).json(location);
  } catch (error) {
    console.error("Create location error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update location (admin)
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    const { name, description, lat, lng, tags, yearTags } = req.body;
    if (name) location.name = name;
    if (description !== undefined) location.description = description;
    if (lat && lng) location.coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    if (tags) location.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t);
    if (yearTags) location.yearTags = Array.isArray(yearTags) ? yearTags.map(y => parseInt(y)) : yearTags.split(',').map(y => parseInt(y)).filter(y => !isNaN(y));

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        const localPath = file.path || path.join(file.destination || 'uploads', file.filename);
        return import('../config/cloudinary.js').then(({ uploadImage: uploadToCloud }) =>
          uploadToCloud(localPath, 'picnichub/locations')
            .then(result => result.secure_url || result.url)
            .catch(err => {
              console.error('Cloud upload failed:', err);
              return `/uploads/${file.filename}`; // Fallback
            })
        );
      });
      const newImages = await Promise.all(uploadPromises);
      // Append new images to existing ones
      location.images = [...(location.images || []), ...newImages];
    }

    await location.save();
    res.json(location);
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create, update, delete blogs (admin)
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const tagsArray = tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [];

    // Generate slug explicitly
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt: excerpt || "",
      coverImage: req.file ? `/uploads/${req.file.filename}` : '',
      authorId: req.user._id,
      tags: tagsArray,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, content, excerpt, tags } = req.body;
    if (title) {
      blog.title = title;
      // Regenerate slug when title changes
      blog.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (tags) blog.tags = Array.isArray(tags) ? tags : tags.split(',');
    if (req.file) blog.coverImage = `/uploads/${req.file.filename}`;

    blog.updatedAt = new Date();
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error("Error updating blog:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle pin location
export const togglePinLocation = async (req, res) => {
  try {
    const { isPinned } = req.body;
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    location.isPinned = isPinned;
    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reorder locations
export const reorderLocations = async (req, res) => {
  try {
    const { order } = req.body; // Array of IDs in new order
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const updates = order.map((id, index) => {
      return Location.findByIdAndUpdate(id, { order: index });
    });

    await Promise.all(updates);
    res.json({ message: 'Locations reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all locations for admin (with visit counts)
export const getAdminLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 }).lean();

    // Aggregate visit counts from memories
    const visitCounts = await Memory.aggregate([
      { $match: { locationId: { $ne: null } } },
      { $group: { _id: '$locationId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    visitCounts.forEach(v => {
      countMap[v._id.toString()] = v.count;
    });

    const locationsWithStats = locations.map(loc => ({
      ...loc,
      visitCount: countMap[loc._id.toString()] || 0
    }));

    res.json(locationsWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get location stats (monthly history)
export const getLocationStats = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    // Get last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        visits: 0
      });
    }

    const memories = await Memory.aggregate([
      { $match: { locationId: location._id } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    memories.forEach(m => {
      const monthName = new Date(2024, m._id.month - 1).toLocaleString('default', { month: 'short' });
      const idx = months.findIndex(mon => mon.month === monthName);
      if (idx !== -1) {
        months[idx].visits += m.count;
      }
    });

    res.json({ history: months });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {
  getStats,
  getPending,
  getAdminLocations,
  getLocationStats,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserActivityLogs,
};
