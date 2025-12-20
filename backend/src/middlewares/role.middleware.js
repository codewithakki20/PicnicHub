// ROLE-BASED ACCESS
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// OWNER OR ADMIN
export const ownerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const resourceUserId =
    req.resource?.uploaderId ||
    req.resource?.authorId ||
    req.resource?.userId;

  if (!resourceUserId) {
    return res.status(400).json({
      message: "Resource owner not defined",
    });
  }

  if (
    req.user.role === "admin" ||
    req.user._id.toString() === resourceUserId.toString()
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied: owner or admin only",
  });
};
