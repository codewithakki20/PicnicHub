import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // Increased from 100 to 1000 requests per window
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import memoriesRoutes from './routes/memory.routes.js';
import reelsRoutes from './routes/reels.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import locationsRoutes from './routes/locations.routes.js';
import adminRoutes from './routes/admin.routes.js';
import supportRoutes from './routes/support.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import storiesRoutes from './routes/stories.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/memories', memoriesRoutes);
app.use('/api/v1/reels', reelsRoutes);
app.use('/api/v1/blogs', blogsRoutes);
app.use('/api/v1/locations', locationsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/stories', storiesRoutes);
app.use('/api/v1/notifications', notificationsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

// 404 for API routes specifically
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Route not found' });
});

// Serve Frontend in Production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
