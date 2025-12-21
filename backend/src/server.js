import "dotenv/config";
import fs from "fs";
import { join } from "path";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";


// BOOTSTRAP
(async () => {
  try {
    // DB
    await connectDB();

    // Ensure uploads folder exists
    const uploadsDir = join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.success(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Local Access: http://10.26.247.120:${PORT}`);
    });

    // GRACEFUL SHUTDOWN
    const shutdown = (signal) => {
      logger.warn(`🛑 Received ${signal}. Shutting down gracefully...`);

      server.close(() => {
        logger.success("✅ HTTP server closed");
        process.exit(0);
      });

      // Force exit after 10s
      setTimeout(() => {
        logger.error("❌ Force shutdown");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
})();
