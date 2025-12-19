// src/utils/getPublicUrl.js

/**
 * Converts a stored relative path into a full public URL.
 * Applies directly if URL is already absolute.
 */
export default function getPublicUrl(path) {
  if (!path || path === "null" || path === "undefined") return "";

  // 1. Already absolute (http/https) or data URI
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  // 2. Starts with /uploads -> It's a backend static file
  //    (Assuming backend serves /uploads route)
  if (path.startsWith("/uploads") || path.startsWith("uploads/")) {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
    // We want the origin (http://localhost:5000), not the full API path
    try {
      const base = new URL(apiUrl).origin;
      // Ensure path starts with /
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${base}${cleanPath}`;
    } catch (e) {
      return path;
    }
  }

  // 3. Otherwise, assume it's a frontend public asset (e.g. /default-avatar.png)
  //    Return as is so browser requests it from frontend server
  return path;
}
