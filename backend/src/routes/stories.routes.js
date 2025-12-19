import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createStory, getStories, viewStory, deleteStory } from "../controllers/storyController.js";

const router = express.Router();

import { uploadImage } from "../middlewares/upload.middleware.js";

router.post("/", protect, uploadImage, createStory);
router.get("/", protect, getStories);
router.post("/:id/view", protect, viewStory);
router.delete("/:id", protect, deleteStory);

export default router;
