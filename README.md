# PicnicHub 🌞

A complete MERN blueprint: **database schema**, **folder structure**, **API endpoints**, **admin dashboard UI**, and **React component structure** for a cozy, nostalgic platform to store picnic memories with reels, photos, blogs & locations.

## Features

### User Features
- 📸 Upload and view picnic memories (photos & videos)
- 🎬 Watch and interact with reels
- 📝 Read blog posts about picnic tips and experiences
- 🗺️ Explore picnic locations on map
- ❤️ Like and comment on posts
- 👤 User profile management

### Admin Features
- 📊 Full dashboard with statistics
- ✅ Approve/reject user uploads
- 📁 Manage memories, reels, blogs, and locations
- 👥 User management (ban/unban, role management)
- 🏷️ Manage tags and categories

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose (ES Modules)
- **Frontend**: React, Vite, Tailwind CSS
- **Authentication**: JWT
- **File Upload**: Multer
- **Containerization**: Docker & Docker Compose

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker (optional, for containerized setup)

### Local Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd PicnicHub
```

2. Install root dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
cd ..
```

4. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

5. Set up environment variables

Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/picnichub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

6. Start MongoDB (if running locally)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use your local MongoDB installation
```

7. Start the development servers
```bash
# From root directory - runs both backend and frontend
npm run dev

# Or run separately:
# Backend: npm run server (from root) or npm run dev (from backend/)
# Frontend: npm run client (from root) or npm run dev (from frontend/)
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`

### Docker Setup

1. Build and run with Docker Compose
```bash
cd infra
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 80

2. Stop services
```bash
docker-compose down
```

## Project Structure

```
PicnicHub/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── server.js              # Server entry point
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── memories.controller.js
│   │   │   ├── blogs.controller.js
│   │   │   ├── locations.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Memory.js
│   │   │   ├── Location.js
│   │   │   ├── Comment.js
│   │   │   ├── Like.js
│   │   │   ├── Blog.js
│   │   │   ├── Reel.js
│   │   │   └── Notification.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── memory.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── locations.routes.js
│   │   │   ├── blogs.routes.js
│   │   │   ├── reels.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── upload.middleware.js
│   │   └── utils/
│   │       └── generateToken.js
│   ├── uploads/                   # Uploaded files (created automatically)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js       # Axios instance with interceptors
│   │   │   ├── auth.js
│   │   │   ├── memories.js
│   │   │   ├── reels.js
│   │   │   ├── blogs.js
│   │   │   ├── locations.js
│   │   │   └── admin.js
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Avatar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/                 # Page components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   ├── useInfiniteScroll.js
│   │   │   └── useUpload.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── infra/
│   └── docker-compose.yml
└── README.md
```

## API Endpoints

Base URL: `/api/v1`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Users
- `GET /users/me` - Get current user profile (protected)
- `PUT /users/me` - Update current user profile (protected)
- `GET /users/:id` - Get user by ID (public)

### Memories
- `GET /memories` - Get all memories (query: `?page=1&limit=20&year=2024&tag=lake&locationId=...&search=...`)
- `GET /memories/:id` - Get single memory
- `POST /memories` - Create memory (protected, multipart/form-data)
- `PUT /memories/:id` - Update memory (protected, owner/admin)
- `DELETE /memories/:id` - Delete memory (protected, owner/admin)
- `POST /memories/:id/like` - Toggle like (protected)
- `POST /memories/:id/comments` - Add comment (protected)
- `GET /memories/:id/comments` - Get comments (pagination)

### Reels
- `GET /reels` - Get all reels (pagination)
- `GET /reels/:id` - Get single reel
- `POST /reels` - Create reel (protected, multipart/form-data)
- `POST /reels/:id/like` - Toggle like (protected)
- `PUT /reels/:id/feature` - Feature/unfeature reel (admin)

### Blogs
- `GET /blogs` - Get all blogs (pagination)
- `GET /blogs/:slug` - Get blog by slug
- `POST /admin/blogs` - Create blog (admin, multipart/form-data)
- `PUT /admin/blogs/:id` - Update blog (admin)
- `DELETE /admin/blogs/:id` - Delete blog (admin)

### Locations
- `GET /locations` - Get all locations (query: `?year=2024&tag=lake`)
- `GET /locations/:id` - Get single location
- `POST /admin/locations` - Create location (admin)
- `PUT /admin/locations/:id` - Update location (admin)

### Admin
- `GET /admin/stats` - Get dashboard statistics (admin)
- `GET /admin/pending` - Get pending memories for approval (admin)
- `POST /admin/memories/:id/approve` - Approve memory (admin)
- `GET /admin/users` - Get all users (admin, pagination)
- `PUT /admin/users/:id/ban` - Ban/unban user (admin)

## Database Schema

### Collections

- **users**: name, email, passwordHash, role, avatarUrl, bio, createdAt, lastLogin, isBanned
- **memories**: title, description, media[], uploaderId, locationId, year, tags[], likesCount, commentsCount, isApproved, visibility
- **locations**: name, description, coords{lat, lng}, images[], tags[], addedBy, yearTags[]
- **comments**: memoryId, authorId, authorName, text, parentCommentId, createdAt
- **likes**: resourceType, resourceId, userId, createdAt (unique index)
- **blogs**: title, slug, content, excerpt, coverImage, authorId, tags[], createdAt, updatedAt
- **reels**: videoUrl, coverImage, caption, uploaderId, likesCount, commentsCount, isFeatured, createdAt
- **notifications**: userId, type, payload, read, createdAt

## Security & Best Practices

- Passwords hashed with bcrypt (12 salt rounds)
- JWT authentication with short expiry + refresh tokens
- Rate limiting on public endpoints
- File upload validation (type & size)
- CORS policy configured
- Input validation with express-validator
- MongoDB indexes for performance

## Development Roadmap

### Sprint 1: MVP Core ✅
- ✅ Auth system (register, login, JWT)
- ✅ Basic memories CRUD
- ✅ Image uploads
- ✅ Feed with pagination
- ✅ Admin approval system

### Sprint 2: Social Features ✅
- ✅ Reels support (video upload + player)
- ✅ Likes & comments
- ✅ User profiles

### Sprint 3: Content & Discovery ✅
- ✅ Locations + map integration
- ✅ Blog module
- ✅ Admin stats dashboard

### Sprint 4: Polish
- Infinite scroll
- Notifications
- Featured reels
- SEO optimization

## License

ISC
#   P i c n i c H u b  
 