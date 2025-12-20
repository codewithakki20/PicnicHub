// src/api/reelsApi.js
import client from "./axiosClient.js";

/* ==========================================================
   🎞 GET ALL REELS (with filters)
   Supports: page, limit, userId, tag, search, featured
========================================================== */
export const getReels = async (params = {}) => {
  const res = await client.get("/reels", { params });
  return res.data;
};

/* ==========================================================
   🎥 GET SINGLE REEL
========================================================== */
export const getReel = async (id) => {
  if (!id) throw new Error("Reel ID is required");

  const res = await client.get(`/reels/${encodeURIComponent(id)}`);
  return res.data;
};

/* ==========================================================
   ⬆️ CREATE / UPLOAD REEL
   Supports video + caption
========================================================== */
export const createReel = async ({ videoFile, caption = "", locationId = "" }) => {
  if (!videoFile) throw new Error("Video file is required to upload a reel");

  const form = new FormData();
  form.append("video", videoFile);
  if (caption) {
    form.append("caption", caption);
  }
  if (locationId) {
    form.append("locationId", locationId);
  }

  // Let axios automatically set Content-Type with boundary for FormData
  const res = await client.post("/reels", form);

  return res.data;
};

/* ==========================================================
   ❤️ LIKE / UNLIKE REEL
========================================================== */
export const toggleReelLike = async (id) => {
  if (!id) throw new Error("Reel ID is required");

  const res = await client.post(`/reels/${id}/like`);
  return res.data;
};

/* ==========================================================
   💬 COMMENTS
========================================================== */

// Add comment
export const addComment = async (id, { text }) => {
  if (!id) throw new Error("Reel ID required");
  if (!text) throw new Error("Comment text required");

  const res = await client.post(`/reels/${id}/comments`, { text });
  return res.data;
};

// Get comments
export const getComments = async (id) => {
  if (!id) throw new Error("Reel ID required");
  const res = await client.get(`/reels/${id}/comments`);
  return res.data;
};

// Delete comment
export const deleteComment = async (reelId, commentId) => {
  if (!reelId || !commentId) throw new Error("IDs required");
  const res = await client.delete(`/reels/${reelId}/comments/${commentId}`);
  return res.data;
};

/* ==========================================================
   ⭐ ADMIN — FEATURE / UNFEATURE REEL
========================================================== */
export const toggleFeature = async (id) => {
  if (!id) throw new Error("Reel ID is required");

  const res = await client.put(`/reels/${id}/feature`);
  return res.data;
};

/* ==========================================================
   🗑 DELETE REEL
========================================================== */
export const deleteReel = async (id) => {
  if (!id) throw new Error("Reel ID is required");

  const res = await client.delete(`/reels/${id}`);
  return res.data;
};

export const updateReel = async (id, payload) => {
  if (!id) throw new Error("Reel ID is required");
  const res = await client.put(`/reels/${id}`, payload);
  return res.data;
};

export const pinReel = async (id, isPinned) => {
  if (!id) throw new Error("Reel ID is required");
  const res = await client.put(`/reels/${id}/pin`, { isPinned });
  return res.data;
};

/* ==========================================================
   📤 EXPORT
========================================================== */
export default {
  getReels,
  getReel,
  createReel,
  toggleReelLike,
  addComment,
  getComments,
  deleteComment,
  toggleFeature,
  deleteReel,
  updateReel,
  pinReel,
};
