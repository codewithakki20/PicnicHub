import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  dotenv.config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Auto delete local file after Cloudinary upload
const removeLocalFile = (path) => {
  try {
    if (fs.existsSync(path)) fs.unlinkSync(path);
  } catch (err) {
    console.error("⚠ Failed to delete local file:", err.message);
  }
};

// Upload image
export const uploadImage = async (filePath, folder = "memoryhub/images") => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "image",
    folder,
  });
  removeLocalFile(filePath);
  return result;
};

// Upload video (big files supported)
export const uploadVideo = async (filePath, folder = "memoryhub/videos") => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    chunk_size: 60_00_000,
    folder,
  });
  removeLocalFile(filePath);
  return result;
};

// Generate thumbnail from video public_id
export const getVideoThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [{ width: 800, height: 450, crop: "fill" }],
  });
};

export default cloudinary;
