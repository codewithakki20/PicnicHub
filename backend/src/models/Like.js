import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ["memory", "reel", "comment"],
      required: true,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "resourceType",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index(
  { resourceType: 1, resourceId: 1, userId: 1 },
  { unique: true }
);

likeSchema.index({ userId: 1 });

export default mongoose.model("Like", likeSchema);
