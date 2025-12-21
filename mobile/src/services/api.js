import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

/* -----------------------------------------
   ENV CONFIG
------------------------------------------ */

// Set this in app.json -> extra.apiUrl
export const BASE_URL =
    Constants.expoConfig?.extra?.apiUrl ||
    Constants.manifest?.extra?.apiUrl ||
    'http://10.26.247.120:5000/api/v1';

const isDev = __DEV__;

if (isDev) {
    console.log('🌐 API BASE URL:', BASE_URL);
}

/* -----------------------------------------
   AXIOS INSTANCE
------------------------------------------ */

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // prevents hanging requests
});

/* -----------------------------------------
   REQUEST INTERCEPTOR
------------------------------------------ */

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // if (isDev) console.log('✅ Token attached:', token.substring(0, 10) + '...');
        } else {
            // console.log('⚠️ No token found in AsyncStorage for request:', config.url);
        }

        if (isDev) {
            // console.log(
            //     `➡️ ${config.method?.toUpperCase()} ${config.url}`,
            //     config.params || config.data || ''
            // );
        }

        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

/* -----------------------------------------
   RESPONSE INTERCEPTOR
------------------------------------------ */

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isDev) {
            // console.error('❌ API Response Error:', {
            //     message: error.message,
            //     status: error.response?.status,
            //     data: error.response?.data,
            // });
        }
        return Promise.reject(error);
    }
);

/* -----------------------------------------
   AUTH
------------------------------------------ */

export const loginUser = (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data);

export const registerUser = (name, email, password) =>
    api.post('/auth/register', { name, email, password }).then(r => r.data);

export const verifyOtp = (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }).then(r => r.data);

export const resendOtp = (email) =>
    api.post('/auth/resend-otp', { email }).then(r => r.data);

export const forgotPassword = (email) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data);

export const resetPassword = (email, otp, newPassword) =>
    api.post('/auth/reset-password', { email, otp, newPassword }).then(r => r.data);

/* -----------------------------------------
   MEMORIES
------------------------------------------ */

export const getMemories = (params) =>
    api.get('/memories', { params }).then(r => r.data);

export const getMemory = (id) =>
    api.get(`/memories/${id}`).then(r => r.data);

export const createMemory = (formData) =>
    api.post('/memories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);


export const updateMemory = (id, formData) =>
    api.put(`/memories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const likeMemory = (id) =>
    api.post(`/memories/${id}/like`).then(r => r.data);

export const deleteMemory = (id) =>
    api.delete(`/memories/${id}`).then(r => r.data);

/* -----------------------------------------
   COMMENTS
------------------------------------------ */

export const getComments = (id, type = 'memory') => {
    const endpoint = type === 'reel' ? 'reels' : 'memories';
    return api.get(`/${endpoint}/${id}/comments`).then(r => r.data);
};

export const addComment = (id, text, type = 'memory') => {
    const endpoint = type === 'reel' ? 'reels' : 'memories';
    return api.post(`/${endpoint}/${id}/comments`, { text }).then(r => r.data);
};

export const deleteComment = (id, commentId, type = 'memory') => {
    const endpoint = type === 'reel' ? 'reels' : 'memories';
    return api.delete(`/${endpoint}/${id}/comments/${commentId}`).then(r => r.data);
};

/* -----------------------------------------
   BLOGS
------------------------------------------ */

export const getBlogs = () =>
    api.get('/blogs').then(r => r.data);

export const getBlog = (slug) =>
    api.get(`/blogs/${slug}`).then(r => r.data);

/* -----------------------------------------
   REELS
------------------------------------------ */

export const getReels = (params) =>
    api.get('/reels', { params }).then(r => r.data);

export const likeReel = (id) =>
    api.post(`/reels/${id}/like`).then(r => r.data);

export const createReel = (formData) =>
    api.post('/reels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const updateReel = (id, formData) =>
    api.put(`/reels/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const deleteReel = (id) =>
    api.delete(`/reels/${id}`).then(r => r.data);

/* -----------------------------------------
   STORIES
------------------------------------------ */

export const createStory = (formData) =>
    api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const getStories = () =>
    api.get('/stories').then(r => r.data);

export const viewStory = (id) =>
    api.post(`/stories/${id}/view`).then(r => r.data);

export const deleteStory = (id) =>
    api.delete(`/stories/${id}`).then(r => r.data);

/* -----------------------------------------
   USERS
------------------------------------------ */

export const getMe = () =>
    api.get('/users/me').then(r => r.data);

export const getUser = (id) =>
    api.get(`/users/${id}`).then(r => r.data);

export const updateProfile = (formData) =>
    api.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const getAllUsers = (page = 1) =>
    api.get(`/users/all?page=${page}`).then(r => r.data);

export const getSuggestedUsers = () =>
    api.get('/users/suggested').then(r => r.data);

export const followUser = (id) =>
    api.post(`/users/${id}/follow`).then(r => r.data);

export const unfollowUser = (id) =>
    api.delete(`/users/${id}/follow`).then(r => r.data);

export const getFollowers = (id) =>
    api.get(`/users/${id}/followers`).then(r => r.data);

export const getFollowing = (id) =>
    api.get(`/users/${id}/following`).then(r => r.data);

export const changePassword = (currentPassword, newPassword) =>
    api.put('/users/me/password', { currentPassword, newPassword }).then(r => r.data);

/* -----------------------------------------
   LOCATIONS
------------------------------------------ */

export const getLocations = (params) =>
    api.get('/locations', { params }).then(r => r.data);

export const getLocation = (id) =>
    api.get(`/locations/${id}`).then(r => r.data);

export const searchLocations = (query) =>
    api.get('/locations/search', { params: { query } }).then(r => r.data);

export const getAvatarUrl = (url) => {
    if (!url) return "https://via.placeholder.com/200";
    if (url.startsWith('http')) return url;
    const rootUrl = BASE_URL.replace(/\/api\/v1\/?$/, '');
    return `${rootUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;

