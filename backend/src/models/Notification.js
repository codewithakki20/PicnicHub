/* Notification Model */
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["like_memory", "like_reel", "comment_memory", "comment_reel", "follow", "new_story"],
            required: true,
        },
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel'
        },
        onModel: {
            type: String,
            required: true,
            enum: ['Memory', 'Reel', 'Story', 'User']
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
