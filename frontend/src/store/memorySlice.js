// src/store/memorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import memoryApi from "../api/memoryApi";

export const loadMemories = createAsyncThunk(
  "memory/list",
  async (params = {}) => memoryApi.getMemories(params)
);

export const loadMemory = createAsyncThunk("memory/get", async (id) =>
  memoryApi.getMemory(id)
);

export const createMemoryAction = createAsyncThunk(
  "memory/create",
  async (payload) => memoryApi.createMemory(payload)
);

export const toggleMemoryLike = createAsyncThunk(
  "memory/like",
  async (id) => memoryApi.toggleLike(id)
);

const slice = createSlice({
  name: "memory",
  initialState: {
    list: [],
    selected: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadMemories.pending, (s) => {
      s.loading = true;
    });
    b.addCase(loadMemories.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(loadMemory.fulfilled, (s, a) => {
      s.selected = a.payload;
    });
    b.addCase(createMemoryAction.fulfilled, (s, a) => {
      s.list.unshift(a.payload);
    });
  },
});

export default slice.reducer;
