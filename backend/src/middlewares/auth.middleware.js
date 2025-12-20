import jwt from "jsonwebtoken";
import User from "../models/User.js";


// HELPERS
const getTokenFromHeader = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};


// PROTECT (LOGIN REQUIRED)
export const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Not authorized, invalid or expired token",
      });
    }

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Not authorized, invalid token payload",
      });
    }

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        message: "Your account is banned",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
};


// OPTIONAL AUTH (GUEST OK)
export const optionalAuth = async (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.id) {
      req.user = await User.findById(decoded.id).select("-passwordHash");
    }
  } catch {
    // ignore invalid token → continue as guest
  }

  next();
};

// ADMIN ONLY
export const admin = (req, res, next) => {
  if (req.user?.role === "admin") return next();

  return res.status(403).json({
    message: "Admin access required",
  });
};
