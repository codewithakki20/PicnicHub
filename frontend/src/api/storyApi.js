// src/api/storyApi.js
import client from "./axiosClient.js";

/* ==========================================================
   📌 GET ALL STORIES
========================================================== */
export const getStories = async () => {
    const res = await client.get("/stories");
    return res.data;
};

/* ==========================================================
   📌 CREATE STORY
   Supports image upload
========================================================== */
export const createStory = async (file) => {
    if (!file) throw new Error("File is required");

    const form = new FormData();
    form.append("image", file); // Middleware usually looks for 'image' field for single uploads in this project
    // Default mediaType is 'image' in controller

    const res = await client.post("/stories", form, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
};

/* ==========================================================
   📌 VIEW STORY (Mark as seen)
========================================================== */
export const viewStory = async (id) => {
    const res = await client.post(`/stories/${id}/view`);
    return res.data;
};

/* ==========================================================
   📌 DELETE STORY
========================================================== */
export const deleteStory = async (id) => {
    const res = await client.delete(`/stories/${id}`);
    return res.data;
};

export default {
    getStories,
    createStory,
    viewStory,
    deleteStory
};
