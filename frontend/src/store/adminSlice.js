// src/store/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

export const loadAdminStats = createAsyncThunk("admin/stats", async () => {
  return await adminApi.getStats();
});

export const loadPendingMemories = createAsyncThunk(
  "admin/pending",
  async () => {
    return await adminApi.getPendingMemories();
  }
);

export const approveMemoryAction = createAsyncThunk(
  "admin/approveMemory",
  async (id) => {
    return await adminApi.approveMemory(id);
  }
);

const slice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    pending: [],
    loading: true,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadAdminStats.fulfilled, (s, a) => {
      s.stats = a.payload;
      s.loading = false;
    });
    b.addCase(loadPendingMemories.fulfilled, (s, a) => {
      s.pending = a.payload;
    });
  },
});

export default slice.reducer;
