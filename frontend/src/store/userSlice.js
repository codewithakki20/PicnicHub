// src/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../api/userApi";

export const fetchMeData = createAsyncThunk("user/me", async () => {
  return await userApi.fetchMe();
});

export const updateMeData = createAsyncThunk("user/update", async (payload) => {
  return await userApi.updateMe(payload);
});

export const fetchUsers = createAsyncThunk(
  "user/all",
  async (params = {}) => {
    return await userApi.fetchAllUsers(params);
  }
);

const slice = createSlice({
  name: "user",
  initialState: {
    me: null,
    users: [],
    status: "idle",
  },
  extraReducers: (b) => {
    b.addCase(fetchMeData.fulfilled, (s, a) => {
      s.me = a.payload;
    });
    b.addCase(updateMeData.fulfilled, (s, a) => {
      s.me = a.payload;
    });
    b.addCase(fetchUsers.fulfilled, (s, a) => {
      s.users = a.payload;
    });
  },
});

export default slice.reducer;
