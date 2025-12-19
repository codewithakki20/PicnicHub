# 🌿 PicnicHub Backend API

RESTful API for PicnicHub - A social platform for sharing picnic memories and discovering locations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. **Start development server**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/           # Mongoose models
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── app.js            # Express app
│   └── server.js         # Server entry point
├── uploads/              # Temporary file uploads
├── .env.example          # Environment variables template
├── render.yaml           # Render deployment config
├── DEPLOYMENT.md         # Deployment guide
└── package.json
```

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /verify-otp` - Verify email OTP
- `POST /resend-otp` - Resend verification OTP
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with OTP

### Users (`/api/v1/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update profile
- `GET /:id` - Get user by ID
- `POST /:id/follow` - Follow/unfollow user
- `GET /:id/followers` - Get followers list
- `GET /:id/following` - Get following list
- `GET /all` - Get all users (paginated)
- `GET /suggested` - Get suggested users to follow

### Memories (`/api/v1/memories`)
- `POST /` - Create memory (with images)
- `GET /` - Get memories feed
- `GET /:id` - Get memory by ID
- `POST /:id/like` - Like/unlike memory
- `POST /:id/comments` - Add comment
- `GET /:id/comments` - Get comments
- `DELETE /:id/comments/:commentId` - Delete comment
- `DELETE /:id` - Delete memory

### Reels (`/api/v1/reels`)
- `POST /` - Upload reel
- `GET /` - Get reels feed
- `POST /:id/like` - Like/unlike reel
- `POST /:id/comments` - Add comment
- `GET /:id/comments` - Get comments
- `DELETE /:id/comments/:commentId` - Delete comment
- `DELETE /:id` - Delete reel

### Stories (`/api/v1/stories`)
- `POST /` - Create story
- `GET /` - Get active stories
- `POST /:id/view` - Mark story as viewed
- `DELETE /:id` - Delete story

### Blogs (`/api/v1/blogs`)
- `GET /` - Get all blogs
- `GET /:slug` - Get blog by slug
- `POST /` - Create blog (Admin)
- `PUT /:id` - Update blog (Admin)
- `DELETE /:id` - Delete blog (Admin)

### Locations (`/api/v1/locations`)
- `GET /` - Get all locations
- `GET /:id` - Get location by ID
- `POST /` - Create location (Admin)
- `PUT /:id` - Update location (Admin)
- `DELETE /:id` - Delete location (Admin)

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Include token in requests:**
```
Authorization: Bearer <your_jwt_token>
```

**Token obtained from:**
- `/api/v1/auth/login` (after successful login)
- `/api/v1/auth/verify-otp` (after email verification)

## 📤 File Uploads

Images and videos are uploaded to **Cloudinary**.

**Supported formats:**
- Images: JPG, PNG, GIF, WEBP
- Videos: MP4, MOV, AVI

**Upload endpoints:**
- Memories: Multiple images (max 10)
- Reels: Single video file
- Stories: Single image/video
- Profile: Single avatar image

## 🛡️ Security Features

- **Helmet.js** - HTTP headers security
- **Rate Limiting** - Prevents brute force attacks
- **CORS** - Configured origins
- **Mongo Sanitize** - Prevents NoSQL injection
- **XSS Clean** - Prevents XSS attacks
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

## 🔧 Configuration

Key environment variables in `.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/picnichub

# Authentication
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📊 Database Models

- **User** - User accounts and profiles
- **Memory** - Photo posts with location
- **Reel** - Short video content
- **Story** - 24-hour temporary content
- **Blog** - Articles and guides
- **Location** - Picnic spots database
- **Comment** - Comments on memories/reels

## 🧪 Testing

```bash
# Run all test scripts
npm test

# Individual test scripts
node test-register.js
node test-login.js
node test-verify.js
node test-forgot-password.js
node test-reset-password.js
```

## 📦 Dependencies

**Core:**
- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- Bcrypt - Password hashing

**Utilities:**
- Multer - File upload handling
- Cloudinary - Image/video storage
- Nodemailer - Email service
- Helmet - Security headers
- CORS - Cross-origin requests
- Express Validator - Input validation

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide to Render.

**Quick deploy:**
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy!

Your API will be at: `https://your-app.onrender.com/api/v1`

## 📝 Scripts

```bash
npm start        # Production server
npm run dev      # Development with nodemon
npm test         # Run tests
```

## 🐛 Debugging

Enable detailed logging:
```env
NODE_ENV=development
```

View logs:
```bash
npm run dev
```

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**API Documentation**: Available at `/api/v1` (root endpoint)
**Health Check**: `/health`
**API Version**: v1.0.0
