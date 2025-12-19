// middlewares/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack || err);

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
