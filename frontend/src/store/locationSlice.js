// src/store/locationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import locationApi from "../api/locationApi";

export const loadLocations = createAsyncThunk(
  "location/list",
  async (params = {}) => locationApi.getLocations(params)
);

export const loadLocation = createAsyncThunk(
  "location/get",
  async (id) => locationApi.getLocation(id)
);

const slice = createSlice({
  name: "location",
  initialState: {
    list: [],
    selected: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadLocations.pending, (s) => {
      s.loading = true;
    });
    b.addCase(loadLocations.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(loadLocation.fulfilled, (s, a) => {
      s.selected = a.payload;
    });
  },
});

export default slice.reducer;
