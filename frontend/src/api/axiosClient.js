// src/api/axiosClient.js
import axios from "axios";

// ----------- BASE URL -----------
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// ----------- TOKEN STORE -----------
export const tokenStore = {
  getAccess: () => localStorage.getItem("accessToken"),
  getRefresh: () => localStorage.getItem("refreshToken"),

  setAccess: (token) => localStorage.setItem("accessToken", token),
  setRefresh: (token) => localStorage.setItem("refreshToken", token),

  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// ----------- AXIOS CLIENT -----------
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------- REQUEST INTERCEPTOR -----------
client.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If data is FormData, let browser set Content-Type with boundary
  // Don't override it with application/json
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// ----------- REFRESH TOKEN INTERCEPTOR -----------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) {
        tokenStore.clear();
        // Redirect to login if we're in the browser
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return client(original);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          token: refreshToken,
        });

        const newToken = res.data.token;
        tokenStore.setAccess(newToken);

        processQueue(null, newToken);
        isRefreshing = false;

        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        tokenStore.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
