// src/api/authApi.js
import client, { tokenStore } from "./axiosClient";

// REGISTER
export const register = async ({ name, email, password }) => {
  const res = await client.post("/auth/register", { name, email, password });
  const data = res.data;

  // Note: Register usually doesn't return token immediately if OTP verification is required
  if (data.token) tokenStore.setAccess(data.token);
  if (data.refreshToken) tokenStore.setRefresh(data.refreshToken);

  return data;
};

// LOGIN
export const login = async ({ email, password }) => {
  const res = await client.post("/auth/login", { email, password });
  const data = res.data;

  if (data.token) tokenStore.setAccess(data.token);
  if (data.refreshToken) tokenStore.setRefresh(data.refreshToken);

  return data;
};

// VERIFY OTP
export const verifyOtp = async ({ email, otp }) => {
  const res = await client.post("/auth/verify-otp", { email, otp });
  const data = res.data;

  if (data.token) tokenStore.setAccess(data.token);
  // Store user in local storage if needed by legacy code, though context usually handles it
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

// RESEND OTP
export const resendOtp = async (email) => {
  const res = await client.post("/auth/send-otp", { email });
  return res.data;
};

// GET CURRENT USER
export const getMe = async () => {
  const res = await client.get("/auth/me");
  return res.data;
};

// REFRESH TOKEN HANDLER
export const refresh = async (refreshToken) => {
  const res = await client.post("/auth/refresh", { token: refreshToken });
  return res.data; // { token, refreshToken }
};

// LOGOUT
export const logout = () => {
  tokenStore.clear();
};

// MAKE ADMIN (Development only)
export const makeAdmin = async () => {
  const res = await client.post("/auth/make-admin");
  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const res = await client.post("/auth/forgot-password", { email });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async ({ email, otp, newPassword }) => {
  const res = await client.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return res.data;
};

export default {
  register,
  login,
  verifyOtp,
  resendOtp,
  getMe,
  refresh,
  logout,
  makeAdmin,
  forgotPassword,
  resetPassword,
};
