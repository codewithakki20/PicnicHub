// src/hooks/useAuth.js
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, logout } from "../store/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((s) => s.auth);

  return {
    user,
    token,
    status,
    error,
    login: (payload) => dispatch(loginUser(payload)),
    register: (payload) => dispatch(registerUser(payload)),
    logout: () => dispatch(logout()),
    isLoggedIn: Boolean(user),
  };
}
