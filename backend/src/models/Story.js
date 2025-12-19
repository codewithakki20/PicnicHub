/* Story Model */
import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
    {
        uploaderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        mediaUrl: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
        viewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        expiresAt: {
            type: Date,
            default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
            index: { expires: 0 } // TTL index
        }
    },
    { timestamps: true }
);

export default mongoose.model("Story", storySchema);
