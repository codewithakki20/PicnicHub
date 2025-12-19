// middlewares/upload.middleware.js
import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  // Allowed image extensions
  const allowedImageExts = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'];
  // Allowed video extensions
  const allowedVideoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv'];

  // Allowed MIME types
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'image/bmp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    'video/x-matroska', 'video/x-flv', 'video/x-ms-wmv'
  ];

  const hasValidExtension = allowedImageExts.includes(ext) || allowedVideoExts.includes(ext);
  const hasValidMimeType = allowedMimeTypes.includes(file.mimetype.toLowerCase());

  if (hasValidExtension && hasValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only images and videos are allowed. Supported: ${allowedImageExts.join(', ').toUpperCase()}, ${allowedVideoExts.join(', ').toUpperCase()}`));
  }
};

// Main upload handler
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Single image (optional - multer allows requests without file)
export const uploadImage = upload.single("image");

// Single video
export const uploadVideo = upload.single("video");

// Multiple images
export const uploadImages = upload.array("images", 10);

// Mixed media
export const uploadMedia = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 5 },
]);
