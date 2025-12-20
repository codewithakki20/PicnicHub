import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getNotifications, markRead, deleteNotification } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteNotification);

export default router;
