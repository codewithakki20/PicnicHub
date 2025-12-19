import client from "./axiosClient";

export const getNotifications = async () => {
    const res = await client.get("/notifications");
    return res.data; // Expects { success: true, data: [...] } from backend
};

export const markRead = async (id) => {
    const res = await client.put(`/notifications/${id}/read`);
    return res.data;
};

export const deleteNotification = async (id) => {
    const res = await client.delete(`/notifications/${id}`);
    return res.data;
};

export default {
    getNotifications,
    markRead,
    deleteNotification,
};
