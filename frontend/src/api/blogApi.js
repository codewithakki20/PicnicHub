// src/api/blogApi.js
import client from "./axiosClient.js";

/* ==========================================================
   📌 GET ALL BLOGS (Public + Admin)
   Supports: pagination, search, filters
========================================================== */
export const getBlogs = async (params = {}) => {
  const res = await client.get("/blogs", { params });
  return res.data;
};

/* ==========================================================
   📌 GET BLOG BY SLUG
========================================================== */
export const getBlog = async (slug) => {
  if (!slug) throw new Error("Slug is required");
  const res = await client.get(`/blogs/${encodeURIComponent(slug)}`);
  return res.data;
};

/* ==========================================================
   📌 CREATE BLOG (Admin)
   Supports file upload (cover image)
========================================================== */
export const createBlog = async (data) => {
  const form = new FormData();
  const { coverFile, tags, ...rest } = data;

  Object.keys(rest).forEach((key) => {
    if (rest[key] !== undefined && rest[key] !== null) {
      form.append(key, rest[key]);
    }
  });

  if (tags) {
    form.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
  }

  if (coverFile) {
    form.append("image", coverFile);
  }

  const res = await client.post("/blogs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* ==========================================================
   📌 UPDATE BLOG (Admin)
   Supports partial updates + new image upload
========================================================== */
export const updateBlog = async (id, data) => {
  if (!id) throw new Error("Blog ID is required");

  const form = new FormData();
  const { coverFile, tags, ...rest } = data;

  Object.keys(rest).forEach((key) => {
    if (rest[key] !== undefined && rest[key] !== null) {
      form.append(key, rest[key]);
    }
  });

  if (tags !== undefined) {
    form.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
  }

  if (coverFile) {
    form.append("image", coverFile);
  }

  const res = await client.put(`/blogs/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/* ==========================================================
   📌 DELETE BLOG (Admin)
========================================================== */
export const deleteBlog = async (id) => {
  if (!id) throw new Error("Blog ID is required");
  const res = await client.delete(`/blogs/${id}`);
  return res.data;
};

/* ==========================================================
   📌 EXPORT
========================================================== */
export default {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
