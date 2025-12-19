import client from "./axiosClient";

export const getSettings = async () => {
    const res = await client.get("/settings");
    return res.data;
};

export const updateSettings = async (data) => {
    const res = await client.put("/settings", data);
    return res.data;
};

export default {
    getSettings,
    updateSettings,
};
