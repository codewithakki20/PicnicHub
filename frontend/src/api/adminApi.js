// src/api/adminApi.js
import client from "./axiosClient";

/* ==========================================================
   📊 ADMIN DASHBOARD — STATS
========================================================== */
export const getStats = async () => {
  const res = await client.get("/admin/stats");
  return res.data;
};

/* ==========================================================
   📈 ADMIN DASHBOARD — ACTIVITY & CHARTS
========================================================== */
export const getRecentActivity = async () => {
  try {
    const res = await client.get("/admin/recent-activity");
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch recent activity:", err);
    return [];
  }
};

export const getMonthlyUploads = async () => {
  try {
    const res = await client.get("/admin/monthly-uploads");
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch monthly uploads:", err);
    return [];
  }
};

/* ==========================================================
   📝 PENDING MEMORIES (Approval System)
========================================================== */
export const getPendingMemories = async ({ page = 1, limit = 20 } = {}) => {
  const res = await client.get("/admin/pending", {
    params: { page, limit },
  });
  return res.data;
};

export const approveMemory = async (id) => {
  if (!id) throw new Error("Memory ID required");
  const res = await client.post(`/admin/memories/${id}/approve`);
  return res.data;
};

export const getMemories = async (params = {}) => {
  const res = await client.get("/admin/memories", { params });
  return res.data;
};

export const deleteMemory = async (id) => {
  if (!id) throw new Error("Memory ID required");
  const res = await client.delete(`/admin/memories/${id}`);
  return res.data;
};

export const updateMemory = async (id, payload) => {
  if (!id) throw new Error("Memory ID required");
  const res = await client.put(`/admin/memories/${id}`, payload);
  return res.data;
};

export const pinMemory = async (id, isPinned) => {
  if (!id) throw new Error("Memory ID required");
  const res = await client.put(`/admin/memories/${id}/pin`, { isPinned });
  return res.data;
};

export const getMemoryStats = async (id) => {
  if (!id) throw new Error("Memory ID required");
  const res = await client.get(`/admin/memories/${id}/stats`);
  return res.data;
};

export const getMemoryComments = async (id) => {
  if (!id) throw new Error("Memory ID required");
  const res = await client.get(`/memories/${id}/comments`);
  return res.data;
};

export const deleteMemoryComment = async (memoryId, commentId) => {
  if (!memoryId || !commentId) throw new Error("Memory ID and Comment ID required");
  const res = await client.delete(`/memories/${memoryId}/comments/${commentId}`);
  return res.data;
};


/* ==========================================================
   👥 ADMIN — USER MANAGEMENT
========================================================== */
export const getUsers = async (page = 1, limit = 20) => {
  const res = await client.get("/admin/users", {
    params: { page, limit },
  });
  return res.data;
};

export const toggleBanUser = async (id, isBanned) => {
  if (!id) throw new Error("User ID is required");
  const res = await client.put(`/admin/users/${id}/ban`, { isBanned });
  return res.data;
};

/* ==========================================================
   📍 LOCATIONS — CREATE / UPDATE
========================================================== */
export const createLocation = async ({
  name,
  description,
  lat,
  lng,
  tags = [],
  yearTags = [],
  images = [],
}) => {
  const form = new FormData();
  form.append("name", name);
  form.append("description", description);
  form.append("lat", lat);
  form.append("lng", lng);

  if (Array.isArray(tags)) {
    form.append("tags", tags.join(","));
  } else {
    form.append("tags", tags);
  }

  if (Array.isArray(yearTags)) {
    form.append("yearTags", yearTags.join(","));
  } else {
    form.append("yearTags", yearTags);
  }

  // Append images
  if (images && images.length > 0) {
    Array.from(images).forEach((file) => {
      form.append("images", file);
    });
  }

  const res = await client.post("/admin/locations", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateLocation = async (id, payload) => {
  if (!id) throw new Error("Location ID required");

  const form = new FormData();

  Object.keys(payload).forEach(key => {
    if (key === 'images' && payload[key]) {
      Array.from(payload[key]).forEach(file => {
        form.append('images', file);
      });
    } else if (Array.isArray(payload[key])) {
      form.append(key, payload[key].join(','));
    } else if (payload[key] !== undefined && payload[key] !== null) {
      form.append(key, payload[key]);
    }
  });

  const res = await client.put(`/admin/locations/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteLocation = async (id) => {
  if (!id) throw new Error("Location ID required");
  const res = await client.delete(`/admin/locations/${id}`);
  return res.data;
};

export const pinLocation = async (id, isPinned) => {
  if (!id) throw new Error("Location ID required");
  const res = await client.put(`/admin/locations/${id}/pin`, { isPinned });
  return res.data;
};

export const reorderLocations = async (order) => {
  if (!order || !Array.isArray(order)) throw new Error("Order array required");
  const res = await client.put(`/admin/locations/reorder`, { order });
  return res.data;
};

export const getLocations = async (params = {}) => {
  const res = await client.get("/admin/locations", { params });
  return res.data;
};

export const getLocationStats = async (id) => {
  if (!id) throw new Error("Location ID required");
  const res = await client.get(`/admin/locations/${id}/stats`);
  return res.data;
};

/* ==========================================================
   ✍️ BLOGS — CREATE / UPDATE / DELETE
========================================================== */
export const createBlog = async ({
  title,
  content,
  excerpt = "",
  tags = [],
  coverFile = null,
}) => {
  const form = new FormData();

  form.append("title", title);
  form.append("content", content);
  form.append("excerpt", excerpt);
  form.append("tags", Array.isArray(tags) ? tags.join(",") : tags);

  if (coverFile) {
    form.append("image", coverFile); // backend expects "image"
  }

  const res = await client.post("/admin/blogs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const updateBlog = async (
  id,
  { title, content, excerpt, tags = [], coverFile = null }
) => {
  if (!id) throw new Error("Blog ID required");

  const form = new FormData();

  if (title !== undefined) form.append("title", title);
  if (content !== undefined) form.append("content", content);
  if (excerpt !== undefined) form.append("excerpt", excerpt);

  if (tags !== undefined) {
    form.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
  }

  if (coverFile) form.append("image", coverFile);

  const res = await client.put(`/admin/blogs/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteBlog = async (id) => {
  if (!id) throw new Error("Blog ID required");
  const res = await client.delete(`/admin/blogs/${id}`);
  return res.data;
};

/* ==========================================================
   📤 EXPORT
========================================================== */
export const getUserActivityLogs = async (id) => {
  if (!id) throw new Error("User ID is required");
  const res = await client.get(`/admin/users/${id}/logs`);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  if (!id) throw new Error("User ID is required");
  const res = await client.put(`/admin/users/${id}/role`, { role });
  return res.data;
};

export default {
  getStats,
  getRecentActivity,
  getMonthlyUploads,
  getPendingMemories,
  approveMemory,
  getMemories,
  deleteMemory,
  updateMemory,
  pinMemory,
  getMemoryStats,
  getMemoryComments,
  deleteMemoryComment,
  getUsers,
  toggleBanUser,
  createLocation,
  updateLocation,
  deleteLocation,
  pinLocation,
  reorderLocations,
  getLocations,
  getLocationStats,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserActivityLogs,
  updateUserRole,
};

