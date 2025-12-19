// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe, logout as logoutAction } from "../store/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, status } = useSelector((s) => s.auth);

  const [loadingSession, setLoadingSession] = useState(true);

  // Load user if token exists
  useEffect(() => {
    const init = async () => {
      if (token && !user) {
        try {
          await dispatch(fetchMe()).unwrap();
        } catch (err) {
          console.log("Session load failed:", err);
        }
      }
      setLoadingSession(false);
    };
    init();
  }, [token]);

  const logout = () => dispatch(logoutAction());

  const value = {
    user,
    token,
    authenticated: Boolean(user),
    loadingSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
