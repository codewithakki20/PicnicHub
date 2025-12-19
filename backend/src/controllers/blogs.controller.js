// ========================================
// controllers/blogs.controller.js
// ========================================
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import path from 'path';
import { uploadImage as uploadImageToCloud } from '../config/cloudinary.js';

// GET blogs (list + search + tag)
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', tag } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (tag) filter.tags = { $in: [tag] };

    const blogs = await Blog.find(filter)
      .populate('authorId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Blog.countDocuments(filter);
    res.json({ blogs, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single blog by slug or ID
export const getBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    let query = { slug };

    // If it looks like an ObjectId, try finding by ID as well
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const blog = await Blog.findOne(query).populate('authorId', 'name avatarUrl').lean();
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE blog (admin)
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags, subtitle, category, readTime } = req.body;
    const coverImageLocal = req.file ? `/uploads/${req.file.filename}` : '';
    let coverImageUrl = coverImageLocal;

    if (req.file) {
      const localPath = req.file.path || path.join(req.file.destination || 'uploads', req.file.filename);
      try {
        const uploadResult = await uploadImageToCloud(localPath, 'picnichub/blogs');
        coverImageUrl = uploadResult.secure_url || uploadResult.url;
      } catch (err) {
        console.error('Cloud upload failed for blog cover:', err.message || err);
        // Fallback to local path if Cloudinary fails
      }
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      subtitle,
      category,
      readTime,
      coverImage: coverImageUrl,
      authorId: req.user._id,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE blog (admin)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, content, excerpt, tags, subtitle, category, readTime } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (subtitle !== undefined) blog.subtitle = subtitle;
    if (category !== undefined) blog.category = category;
    if (readTime !== undefined) blog.readTime = readTime;
    if (tags) blog.tags = Array.isArray(tags) ? tags : tags.split(',');

    if (req.file) {
      const localPath = req.file.path || path.join(req.file.destination || 'uploads', req.file.filename);
      try {
        const uploadResult = await uploadImageToCloud(localPath, 'picnichub/blogs');
        blog.coverImage = uploadResult.secure_url || uploadResult.url;
      } catch (err) {
        blog.coverImage = `/uploads/${req.file.filename}`;
        console.error('Cloud upload failed for blog cover:', err.message || err);
        // Fallback to local path if Cloudinary fails
      }
    }

    blog.updatedAt = new Date();
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE blog (admin)
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

export default { getBlogs, getBlog, createBlog, updateBlog, deleteBlog };
