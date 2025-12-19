// src/store/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogApi from "../api/blogApi";

export const loadBlogs = createAsyncThunk(
  "blogs/list",
  async (params = {}) => blogApi.getBlogs(params)
);

export const loadBlog = createAsyncThunk("blogs/get", async (slug) =>
  blogApi.getBlog(slug)
);

const slice = createSlice({
  name: "blog",
  initialState: {
    list: [],
    selected: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadBlogs.pending, (s) => {
      s.loading = true;
    });
    b.addCase(loadBlogs.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(loadBlog.fulfilled, (s, a) => {
      s.selected = a.payload;
    });
  },
});

export default slice.reducer;
