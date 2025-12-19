import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    loginUser,
    registerUser,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    getMe,
} from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isHydrating, setIsHydrating] = useState(true);
    const [loading, setLoading] = useState({
        login: false,
        register: false,
        verify: false,
        resend: false,
    });

    /* ---------- Helpers ---------- */

    const persistAuth = async (token, user) => {
        await AsyncStorage.multiSet([
            ["token", token],
            ["user", JSON.stringify(user)],
        ]);
        setToken(token);
        setUser(user);
    };

    const clearAuth = async () => {
        await AsyncStorage.multiRemove(["token", "user"]);
        setToken(null);
        setUser(null);
    };

    /* ---------- Load Stored Session ---------- */

    useEffect(() => {
        const hydrate = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                const storedUser = await AsyncStorage.getItem("user");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));

                    try {
                        const freshUser = await getMe();
                        setUser(freshUser);
                        await AsyncStorage.setItem("user", JSON.stringify(freshUser));
                    } catch {
                        await clearAuth();
                    }
                }
            } finally {
                setIsHydrating(false);
            }
        };

        hydrate();
    }, []);

    /* ---------- Actions ---------- */

    const login = async (email, password) => {
        setLoading(l => ({ ...l, login: true }));
        try {
            const data = await loginUser(email, password);
            await persistAuth(data.token, data.user);
        } catch (e) {
            throw e;
        } finally {
            setLoading(l => ({ ...l, login: false }));
        }
    };

    const register = async (name, email, password) => {
        setLoading(l => ({ ...l, register: true }));
        try {
            return await registerUser(name, email, password);
        } finally {
            setLoading(l => ({ ...l, register: false }));
        }
    };

    const verify = async (email, otp) => {
        setLoading(l => ({ ...l, verify: true }));
        try {
            const data = await verifyOtp(email, otp);
            await persistAuth(data.token, data.user);
            return data;
        } finally {
            setLoading(l => ({ ...l, verify: false }));
        }
    };

    const resendOtpHandler = async (email) => {
        setLoading(l => ({ ...l, resend: true }));
        try {
            return await resendOtp(email);
        } finally {
            setLoading(l => ({ ...l, resend: false }));
        }
    };

    const logout = async () => {
        await clearAuth();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isHydrating,
                loading,
                login,
                logout,
                register,
                verify,
                resendOtp: resendOtpHandler,
                forgotPassword,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
