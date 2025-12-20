import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";


//ENV SETUP
dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("❌ Cloudinary environment variables are missing");
}


// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// HELPERS
// Auto delete local file after upload
const removeLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("⚠️ Failed to delete local file:", err.message);
  }
};

// IMAGE UPLOAD
export const uploadImage = async (
  filePath,
  folder = "picnichub/images"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder,
      use_filename: true,
      unique_filename: true,
    });

    removeLocalFile(filePath);
    return result;
  } catch (err) {
    removeLocalFile(filePath);
    console.error("❌ Image upload failed:", err.message);
    throw err;
  }
};

// VIDEO UPLOAD (LARGE FILES)
export const uploadVideo = async (
  filePath,
  folder = "picnichub/videos"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder,
      chunk_size: 6_000_000, // 6MB chunks (stable)
      eager_async: true,
    });

    removeLocalFile(filePath);
    return result;
  } catch (err) {
    removeLocalFile(filePath);
    console.error("❌ Video upload failed:", err.message);
    throw err;
  }
};

// VIDEO THUMBNAIL
export const getVideoThumbnailUrl = (publicId) => {
  if (!publicId) return null;

  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      {
        width: 800,
        height: 450,
        crop: "fill",
        gravity: "center",
      },
    ],
  });
};


// DELETE FROM CLOUDINARY
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.error("⚠️ Cloudinary delete failed:", err.message);
  }
};

export default cloudinary;
