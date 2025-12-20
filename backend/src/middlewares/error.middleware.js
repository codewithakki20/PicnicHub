import logger from "../config/logger.js";

// GLOBAL ERROR HANDLER
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Something went wrong. Please try again.";

  // Log (detailed in dev, clean in prod)
  logger.error(message, err);

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
