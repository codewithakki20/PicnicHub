// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import memoryReducer from "./memorySlice";
import reelReducer from "./reelSlice";
import blogReducer from "./blogSlice";
import locationReducer from "./locationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
    memory: memoryReducer,
    reel: reelReducer,
    blog: blogReducer,
    location: locationReducer,
  },
});

export default store;
