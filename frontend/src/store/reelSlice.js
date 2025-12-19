// src/store/reelSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reelsApi from "../api/reelsApi";

export const loadReels = createAsyncThunk(
  "reels/list",
  async (params = {}) => reelsApi.getReels(params)
);

export const loadReel = createAsyncThunk("reels/get", async (id) =>
  reelsApi.getReel(id)
);

export const uploadReelAction = createAsyncThunk(
  "reels/create",
  async (payload) => reelsApi.createReel(payload)
);

export const likeReelAction = createAsyncThunk(
  "reels/like",
  async (id) => reelsApi.toggleReelLike(id)
);

const slice = createSlice({
  name: "reel",
  initialState: {
    list: [],
    selected: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadReels.pending, (s) => {
      s.loading = true;
    });
    b.addCase(loadReels.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(loadReel.fulfilled, (s, a) => {
      s.selected = a.payload;
    });
  },
});

export default slice.reducer;
