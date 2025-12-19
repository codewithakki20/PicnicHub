import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, default: "" },

    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    images: [String],

    tags: [{ type: String, trim: true }],

    yearTags: [Number],

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPinned: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

locationSchema.index({ "coords.lat": 1, "coords.lng": 1 });
locationSchema.index({ addedBy: 1 });
locationSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.model("Location", locationSchema);
