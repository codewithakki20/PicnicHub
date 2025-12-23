import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./config/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();


// PATH SETUP
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// GLOBAL MIDDLEWARES
// Request logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    logger.request(req.method, req.originalUrl, res.statusCode);
    next();
  });
}

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// CORS
app.use(
  cors({
    origin: "*", // tighten later if needed
    credentials: true,
  })
);

// Fix Cross-Origin-Opener-Policy for Google Sign-In
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
app.use("/uploads", express.static("uploads"));

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import memoriesRoutes from "./routes/memory.routes.js";
import reelsRoutes from "./routes/reels.routes.js";
import blogsRoutes from "./routes/blogs.routes.js";
import locationsRoutes from "./routes/locations.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import supportRoutes from "./routes/support.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import storiesRoutes from "./routes/stories.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/memories", memoriesRoutes);
app.use("/api/v1/reels", reelsRoutes);
app.use("/api/v1/blogs", blogsRoutes);
app.use("/api/v1/locations", locationsRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/stories", storiesRoutes);
app.use("/api/v1/notifications", notificationsRoutes);


// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});


// API ROOT HANDLER
app.get("/api/v1", (req, res) => {
  res.json({
    message: "Welcome to PicnicHub API v1 🌿",
    status: "active",
    endpoints: {
      health: "/health",
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      memories: "/api/v1/memories",
      reels: "/api/v1/reels",
      blogs: "/api/v1/blogs",
    }
  });
});


// API 404 HANDLER
app.use("/api/*", (req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

//FRONTEND (PRODUCTION)
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../../frontend/build");

  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("🚀 API is running...");
  });
}

// ERROR HANDLER
app.use(errorHandler);

export default app;
