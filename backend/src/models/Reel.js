import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },

    coverImage: { type: String, default: "" },

    caption: { type: String, default: "" },

    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false, index: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reelSchema.index({ uploaderId: 1 });
reelSchema.index({ isFeatured: 1, createdAt: -1 });

export default mongoose.model("Reel", reelSchema);
