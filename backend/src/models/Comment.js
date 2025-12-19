import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ["memory", "reel"],
      required: true,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "resourceType",
      required: true,
      index: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);
