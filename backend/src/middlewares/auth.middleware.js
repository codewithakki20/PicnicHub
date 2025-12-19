// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect (requires login)
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Not authorized, invalid token payload" });
    }

    req.user = await User.findById(decoded.id).select("-passwordHash");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.isBanned) {
      return res.status(403).json({ message: "Your account is banned" });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, token failed",
      error: err.message,
    });
  }
};

// Optional Auth (no token required)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-passwordHash");
      } catch (err) {
        // invalid token → continue as guest
      }
    }

    next();
  } catch (err) {
    next();
  }
};

// Admin only
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
};
