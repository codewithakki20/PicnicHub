import Story from "../models/Story.js";
import User from "../models/User.js";

// Import cloudinary uploader
import { uploadImage as uploadImageToCloud } from '../config/cloudinary.js';

// Create a new story
export const createStory = async (req, res) => {
    try {
        let { mediaUrl, mediaType = "image" } = req.body;

        // If file is uploaded via multer
        if (req.file) {
            const localPath = req.file.path;
            try {
                const uploadResult = await uploadImageToCloud(localPath, 'picnichub/stories');
                mediaUrl = uploadResult.secure_url || uploadResult.url;
            } catch (err) {
                console.error("Cloudinary upload failed:", err);
                // Fallback or error? For now fallback to local if needed, or throw
                return res.status(500).json({ message: "Image upload failed" });
            }
        }

        if (!mediaUrl) {
            return res.status(400).json({ message: "Media URL is required" });
        }

        const newStory = new Story({
            uploaderId: req.user.id,
            mediaUrl,
            mediaType,
        });

        await newStory.save();

        res.status(201).json({
            success: true,
            message: "Story created successfully",
            story: newStory,
        });
    } catch (error) {
        console.error("Create Story Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get stories for feed (followed users + self)
export const getStories = async (req, res) => {
    try {
        // In a real app, logic would be: Fetch stories from users I follow + myself
        // For now, let's fetch all active stories (grouped by user) or just all sorted

        // Simple approach: Get all stories that haven't expired
        // TTL handles deletion, so just find all. 
        // Optimization: Group by User

        const stories = await Story.find()
            .populate("uploaderId", "name avatarUrl")
            .sort({ createdAt: 1 }); // Oldest first for chronological story viewing? Or Newest? Usually stories are chronological per user.

        // Group by User
        const userStoriesMap = {};

        stories.forEach(story => {
            if (!story.uploaderId) return; // Skip stories with missing users

            const uid = story.uploaderId._id.toString();
            if (!userStoriesMap[uid]) {
                userStoriesMap[uid] = {
                    user: story.uploaderId,
                    stories: [],
                    hasUnseen: false // calculate based on viewers
                };
            }

            // check seen
            const seen = story.viewers.includes(req.user.id);
            if (!seen) userStoriesMap[uid].hasUnseen = true;

            userStoriesMap[uid].stories.push({
                _id: story._id,
                mediaUrl: story.mediaUrl,
                mediaType: story.mediaType,
                createdAt: story.createdAt,
                seen
            });
        });

        const feed = Object.values(userStoriesMap);

        // Sort: Users with unseen stories first
        feed.sort((a, b) => (b.hasUnseen === a.hasUnseen ? 0 : b.hasUnseen ? 1 : -1));

        res.status(200).json({
            success: true,
            data: feed,
        });
    } catch (error) {
        console.error("Get Stories Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// View a story
export const viewStory = async (req, res) => {
    try {
        const { id } = req.params;
        await Story.findByIdAndUpdate(id, {
            $addToSet: { viewers: req.user.id }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Error viewing story" });
    }
};

// Delete a story
export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await Story.findById(id);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Check ownership
        if (story.uploaderId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this story" });
        }

        await story.deleteOne();

        res.status(200).json({ success: true, message: "Story deleted" });
    } catch (error) {
        console.error("Delete Story Error:", error);
        res.status(500).json({ message: "Error deleting story" });
    }
};
