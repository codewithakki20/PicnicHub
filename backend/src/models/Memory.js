import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true },
      },
    ],

    thumbnailUrl: {
      type: String,
      default: "",
    },

    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    uploaderName: {
      type: String,
      required: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },

    locationSnapshot: {
      name: String,
      coords: {
        lat: Number,
        lng: Number,
      },
    },

    year: {
      type: Number,
      default: new Date().getFullYear(),
    },

    tags: [{ type: String, trim: true }],

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

// Indexes
memorySchema.index({ uploaderId: 1, createdAt: -1 });
memorySchema.index({ locationId: 1 });
memorySchema.index({ year: 1 });
memorySchema.index({ tags: 1 });
memorySchema.index({ isApproved: 1, visibility: 1, createdAt: -1 });
memorySchema.index({ title: "text", description: "text" }); // Text search index

export default mongoose.model("Memory", memorySchema);
