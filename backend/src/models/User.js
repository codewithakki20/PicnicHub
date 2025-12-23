import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined for non-google users
    },

    passwordHash: {
      type: String,
      required: false, // Not required for google users
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    college: {
      type: String,
      enum: ["", "CMDians", "LCITians"],
      default: "",
    },

    branch: {
      type: String,
      enum: ["", "Science", "Commerce", "Arts", "Engineering", "Pharmacy", "MBA", "Others"],
      default: "",
    },

    course: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      trim: true,
      default: "",
    },

    lastLogin: Date,

    isBanned: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpires: {
      type: Date,
      select: false,
    },

    passwordResetOtp: {
      type: String,
      select: false,
    },

    passwordResetOtpExpires: {
      type: Date,
      select: false,
    },

    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],

    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password
// Compare password
userSchema.methods.comparePassword = async function (pw) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(pw, this.passwordHash);
};

export default mongoose.model("User", userSchema);
