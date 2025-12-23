// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../api/authApi";
import { tokenStore } from "../api/axiosClient";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: tokenStore.getAccess() || null,
  refreshToken: tokenStore.getRefresh() || null,
  status: "idle",
  error: null,
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// LOAD PROFILE
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getMe();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.googleLogin(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      tokenStore.clear();
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.refreshToken = a.payload.refreshToken;

        tokenStore.setAccess(a.payload.token);
        tokenStore.setRefresh(a.payload.refreshToken);

        localStorage.setItem("user", JSON.stringify(a.payload.user));
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });

    // REGISTER
    builder
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload.user;
        s.token = a.payload.token;
        s.refreshToken = a.payload.refreshToken;

        tokenStore.setAccess(a.payload.token);
        tokenStore.setRefresh(a.payload.refreshToken);

        localStorage.setItem("user", JSON.stringify(a.payload.user));
      });

    // FETCH ME
    builder
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload;
      })

      // GOOGLE LOGIN
      .addCase(googleLogin.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload.user;
        s.token = a.payload.token;
        tokenStore.setAccess(a.payload.token);
        localStorage.setItem("user", JSON.stringify(a.payload.user));
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
