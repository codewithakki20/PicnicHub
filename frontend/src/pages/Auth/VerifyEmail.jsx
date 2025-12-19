// src/pages/Auth/VerifyEmail.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    RefreshCw,
} from "lucide-react";

import authApi from "../../api/authApi";

/* ================= PAGE ================= */

export default function VerifyEmail() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    /* ================= VERIFY ================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) return toast.error("Please enter the OTP");
        if (!email)
            return toast.error("Email not found. Please register again.");

        try {
            setLoading(true);
            await authApi.verifyOtp({ email, otp });

            toast.success("Email verified successfully!");
            navigate("/");
            window.location.reload();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    /* ================= RESEND ================= */

    const handleResend = async () => {
        if (!email) return;

        try {
            setResending(true);
            await authApi.resendOtp(email);
            toast.success("Verification code sent again!");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to resend code"
            );
        } finally {
            setResending(false);
        }
    };

    /* ================= NO EMAIL STATE ================= */

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Email missing
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Please register or login first.
                    </p>
                    <button
                        onClick={() => navigate("/auth/login")}
                        className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 font-sans">
            <div className="max-w-md w-full bg-white dark:bg-slate-900
                      p-8 rounded-2xl shadow-xl
                      border border-slate-200 dark:border-slate-800 space-y-8">

                {/* HEADER */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full
                          bg-primary-100 dark:bg-primary-900/30
                          flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Verify your email
                    </h2>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        We sent a verification code to{" "}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {email}
                        </span>
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label htmlFor="otp" className="sr-only">
                            OTP
                        </label>

                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>

                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="block w-full pl-10 px-4 py-3 rounded-xl
                         border border-slate-300 dark:border-slate-700
                         bg-white dark:bg-slate-800
                         text-slate-900 dark:text-white
                         placeholder-slate-500
                         focus:outline-none focus:ring-2
                         focus:ring-primary-500 focus:border-transparent
                         transition"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex justify-center items-center gap-2
                         py-3 px-4 rounded-xl
                         text-sm font-bold text-white
                         bg-primary-600 hover:bg-primary-700
                         transition disabled:opacity-70
                         shadow-lg shadow-primary-600/30"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Verify Email
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="flex items-center justify-center gap-2
                         text-sm font-medium
                         text-slate-500 dark:text-slate-400
                         hover:text-primary-600 dark:hover:text-primary-400
                         transition disabled:opacity-50"
                        >
                            {resending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Resend verification code
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
