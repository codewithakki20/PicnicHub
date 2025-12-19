import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      default: "",
      maxlength: 300,
    },

    coverImage: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    readTime: {
      type: String,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Auto slug
blogSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});


blogSchema.index({ authorId: 1 });
blogSchema.index({ createdAt: -1 });

export default mongoose.model("Blog", blogSchema);
