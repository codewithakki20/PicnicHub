import multer from "multer";
import path from "path";
import fs from "fs";

// ENSURE UPLOAD DIR
const UPLOAD_DIR = "uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


// STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.fieldname.replace(/\s+/g, "");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${safeName}-${unique}${ext}`);
  },
});


//FILE FILTER
const IMAGE_EXTS = [
  "jpeg", "jpg", "png", "gif", "webp", "bmp", "svg", "ico",
];

const VIDEO_EXTS = [
  "mp4", "mov", "avi", "webm", "mkv", "flv", "wmv",
];

const ALLOWED_MIME_TYPES = [
  // images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",

  // videos
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/x-matroska",
  "video/x-flv",
  "video/x-ms-wmv",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).slice(1).toLowerCase();
  const isValidExt =
    IMAGE_EXTS.includes(ext) || VIDEO_EXTS.includes(ext);

  const isValidMime = ALLOWED_MIME_TYPES.includes(
    file.mimetype.toLowerCase()
  );

  if (isValidExt && isValidMime) {
    return cb(null, true);
  }

  cb(
    new Error(
      `Invalid file type. Allowed images: ${IMAGE_EXTS.join(
        ", "
      )}. Allowed videos: ${VIDEO_EXTS.join(", ")}`
    )
  );
};


//MULTER INSTANCE
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});



// EXPORT HELPERS

// Single image (optional)
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
