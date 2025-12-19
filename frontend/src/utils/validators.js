// src/utils/validators.js

// EMAIL
export const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

// PASSWORD (min 6 chars)
export const isStrongPassword = (password, min = 6) => {
  if (!password) return false;
  return password.length >= min;
};

// REQUIRED FIELD
export const isRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== "";
};

// FILE SIZE (default 5MB)
export const isValidSize = (file, maxMB = 5) => {
  if (!file) return false;
  return file.size <= maxMB * 1024 * 1024;
};

// FILE TYPE (image only)
export const isImage = (file) => {
  if (!file) return false;
  return file.type.startsWith("image/");
};

// FILE TYPE (video only)
export const isVideo = (file) => {
  if (!file) return false;
  return file.type.startsWith("video/");
};

// MULTIPLE FILES VALIDATION
export const validateFiles = (files, maxMB = 5, type = "image") => {
  for (let f of files) {
    if (!isValidSize(f, maxMB)) return false;

    if (type === "image" && !isImage(f)) return false;
    if (type === "video" && !isVideo(f)) return false;
  }
  return true;
};

export default {
  isEmail,
  isStrongPassword,
  isRequired,
  isValidSize,
  isImage,
  isVideo,
  validateFiles,
};
