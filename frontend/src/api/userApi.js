// src/api/userApi.js
import client, { tokenStore } from "./axiosClient.js";

/* ==========================================================
   👤 GET CURRENT AUTHENTICATED USER
========================================================== */
export const fetchMe = async () => {
  const res = await client.get("/users/me");
  return res.data;
};

/* ==========================================================
   ✏️ UPDATE PROFILE (Supports Name + Bio + College + Branch + Avatar)
========================================================== */
export const updateMe = async ({ name, bio, college, branch, avatarFile } = {}) => {
  const form = new FormData();

  if (name !== undefined && name !== null) {
    form.append("name", name);
  }
  if (bio !== undefined && bio !== null) {
    form.append("bio", bio);
  }
  if (college !== undefined && college !== null) {
    form.append("college", college);
  }
  if (branch !== undefined && branch !== null) {
    form.append("branch", branch);
  }

  // avatar upload (middleware expects "image")
  if (avatarFile) {
    form.append("image", avatarFile);
  }

  // Let axios automatically set Content-Type with boundary for FormData
  const res = await client.put("/users/me", form);

  // If backend optionally returns updated token:
  if (res.data?.token) tokenStore.setAccess(res.data.token);

  return res.data;
};

/* ==========================================================
   🔎 GET PUBLIC PROFILE OF ANOTHER USER
========================================================== */
export const fetchUser = async (id) => {
  if (!id || id === "undefined" || id === "null") {
    console.warn("fetchUser called with invalid ID:", id);
    throw new Error("User ID is required");
  }

  const res = await client.get(`/users/${encodeURIComponent(id)}`);
  return res.data;
};

/* ==========================================================
   👥 ADMIN — PAGINATED USERS LIST
========================================================== */
export const fetchAllUsers = async ({ page = 1, limit = 50 } = {}) => {
  const res = await client.get("/users/all", {
    params: { page, limit },
  });
  return res.data;
};

/* ==========================================================
   👥 FOLLOW / UNFOLLOW USER
========================================================== */
export const followUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  const res = await client.post(`/users/${encodeURIComponent(userId)}/follow`);
  return res.data;
};

export const unfollowUser = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  const res = await client.delete(`/users/${encodeURIComponent(userId)}/follow`);
  return res.data;
};

/* ==========================================================
   👥 GET FOLLOWERS / FOLLOWING
========================================================== */
export const getFollowers = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  const res = await client.get(`/users/${encodeURIComponent(userId)}/followers`);
  return res.data;
};

export const getFollowing = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  const res = await client.get(`/users/${encodeURIComponent(userId)}/following`);
  return res.data;
};

/* ==========================================================
   🔍 GET SUGGESTED USERS
========================================================== */
export const getSuggestedUsers = async () => {
  const res = await client.get("/users/suggested");
  return res.data;
};

/* ==========================================================
   🔐 CHANGE PASSWORD
========================================================== */
export const changePassword = async ({ currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }
  const res = await client.put("/users/me/password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};

/* ==========================================================
   📤 EXPORT
========================================================== */
export default {
  fetchMe,
  updateMe,
  fetchUser,
  fetchAllUsers,
  changePassword,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getSuggestedUsers,
};
