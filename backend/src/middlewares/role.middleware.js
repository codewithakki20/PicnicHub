// middlewares/role.middleware.js

// Allow only specific roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Insufficient permissions" });

    next();
  };
};

// Allow only owner or admin
export const ownerOrAdmin = (req, res, next) => {
  const resourceUserId =
    req.resource?.uploaderId ||
    req.resource?.authorId ||
    req.resource?.userId;

  if (!req.user)
    return res.status(401).json({ message: "Authentication required" });

  if (
    req.user.role === "admin" ||
    req.user._id.toString() === resourceUserId?.toString()
  ) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Access denied: owner or admin only" });
};
