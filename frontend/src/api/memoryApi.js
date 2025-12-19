// src/api/memoryApi.js
import client from "./axiosClient.js";

/* ==========================================================
   📌 LIST / FILTER MEMORIES
   Filters supported:
   page, limit, year, tag, locationId, search, status, userId
========================================================== */
export const getMemories = async (params = {}) => {
  const res = await client.get("/memories", { params });
  return res.data;
};

/* ==========================================================
   📌 GET SINGLE MEMORY BY ID
========================================================== */
export const getMemory = async (id) => {
  if (!id) throw new Error("Memory ID is required");

  const res = await client.get(`/memories/${encodeURIComponent(id)}`);
  return res.data;
};

/* ==========================================================
   📌 CREATE MEMORY
   Supports:
   - title, description, year, tags, visibility
   - locationId
   - arrays of images & videos
========================================================== */
export const createMemory = async ({
  title,
  description,
  year,
  tags,
  locationId,
  visibility = "public",
  images = [],
  videos = [],
}) => {
  const form = new FormData();

  // Required fields - always append (even if empty, backend will validate)
  if (title !== undefined && title !== null) {
    form.append("title", title.trim());
  }
  if (description !== undefined && description !== null) {
    form.append("description", description.trim());
  }

  // Optional fields
  if (year !== undefined && year !== null && year !== "") {
    form.append("year", year);
  }
  if (locationId !== undefined && locationId !== null && locationId !== "") {
    form.append("locationId", locationId);
  }

  if (tags !== undefined && tags !== null) {
    if (Array.isArray(tags)) {
      form.append("tags", tags.filter(t => t && t.trim()).join(","));
    } else if (typeof tags === 'string' && tags.trim()) {
      form.append("tags", tags.trim());
    }
  }

  form.append("visibility", visibility || "public");

  // MULTIPLE MEDIA UPLOAD
  if (Array.isArray(images)) {
    images.forEach((file) => file && form.append("images", file));
  }

  if (Array.isArray(videos)) {
    videos.forEach((file) => file && form.append("videos", file));
  }

  // Let axios automatically set Content-Type with boundary for FormData
  const res = await client.post("/memories", form);

  return res.data;
};

/* ==========================================================
   📌 UPDATE MEMORY (Owner/Admin)
   Simple JSON update for non-media fields.
========================================================== */
export const updateMemory = async (id, payload = {}) => {
  if (!id) throw new Error("Memory ID is required");

  const res = await client.put(`/memories/${id}`, payload);
  return res.data;
};

/* ==========================================================
   📌 DELETE MEMORY
========================================================== */
export const deleteMemory = async (id) => {
  if (!id) throw new Error("Memory ID is required");

  const res = await client.delete(`/memories/${id}`);
  return res.data;
};

/* ==========================================================
   ❤️ LIKE / UNLIKE MEMORY
========================================================== */
export const toggleLike = async (id) => {
  if (!id) throw new Error("Memory ID is required");

  const res = await client.post(`/memories/${id}/like`);
  return res.data;
};

/* ==========================================================
   💬 COMMENTS
========================================================== */

// Add comment / reply
export const addComment = async (id, { text, parentCommentId = null }) => {
  if (!id) throw new Error("Memory ID required");
  if (!text) throw new Error("Comment text required");

  const res = await client.post(`/memories/${id}/comments`, {
    text,
    parentCommentId,
  });

  return res.data;
};

// Paginated comments
export const getComments = async (
  id,
  { page = 1, limit = 20 } = {}
) => {
  if (!id) throw new Error("Memory ID required");

  const res = await client.get(`/memories/${id}/comments`, {
    params: { page, limit },
  });

  return res.data;
};
// Delete comment
export const deleteComment = async (memoryId, commentId) => {
  if (!memoryId || !commentId) throw new Error("IDs required");
  const res = await client.delete(`/memories/${memoryId}/comments/${commentId}`);
  return res.data;
};

/* ==========================================================
   📤 EXPORT
========================================================== */
export default {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  toggleLike,
  addComment,
  getComments,
  deleteComment,
};
