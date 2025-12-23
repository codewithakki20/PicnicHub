// src/pages/Auth/ResetPassword.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authApi from "../../api/authApi";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

/* ================= PAGE ================= */

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= PASSWORD STRENGTH ================= */

  const calcStrength = () => {
    const p = password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = calcStrength();
  const strengthColors = [
    "bg-slate-200",
    "bg-rose-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-primary-600",
  ];
  const strengthText = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!email) return setError("Email missing. Please try again.");
    if (!otp) return setError("Please enter the OTP.");
    if (!password) return setError("Password cannot be empty.");
    if (password !== confirm)
      return setError("Passwords do not match.");

    try {
      setLoading(true);
      const res = await authApi.resetPassword({
        email,
        otp,
        newPassword: password,
      });

      setMsg(res?.message || "Password reset successful!");
      setTimeout(() => navigate("/auth/login"), 1800);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Reset failed."
      );
    } finally {
      setLoading(false);
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
            Please request a password reset again.
          </p>
          <Link
            to="/auth/forgot-password"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* LEFT – FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center
                      p-8 sm:p-12 lg:p-20 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100
                        rounded-full blur-3xl opacity-40
                        -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-100
                        rounded-full blur-3xl opacity-40
                        translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* HEADER */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center
                            w-12 h-12 rounded-xl
                            bg-primary-100 dark:bg-primary-900/30
                            text-primary-600 dark:text-primary-400 mb-6">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-4xl font-display font-black
                           text-slate-900 dark:text-white
                           tracking-tight mb-2">
              Set new password
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Enter the OTP sent to{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {email}
              </strong>
            </p>
          </div>

          {/* SUCCESS */}
          {msg && (
            <div className="p-4 rounded-xl
                            bg-primary-50 dark:bg-primary-900/20
                            border border-primary-100 dark:border-primary-800
                            text-primary-700 dark:text-primary-400
                            text-sm font-medium flex items-center gap-2">
              <CheckCircle size={16} />
              {msg}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="p-4 rounded-xl
                            bg-rose-50 border border-rose-100
                            text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="OTP Code"
                type="text"
                required
                value={otp}
                placeholder="Enter 6-digit OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpVerified(null); // Reset verification on change
                }}
                onBlur={async () => {
                  if (otp.length === 6) {
                    try {
                      await authApi.verifyResetOtp({ email, otp });
                      setOtpVerified(true);
                    } catch (e) {
                      setOtpVerified(false);
                      // Optional: setError("Invalid OTP code");
                    }
                  }
                }}
                className={`bg-white dark:bg-slate-900
                           border-slate-200 dark:border-slate-800
                           focus:border-primary-500
                           focus:ring-primary-500/20
                           rounded-xl ${otpVerified === true ? 'border-green-500 focus:border-green-500' : ''} ${otpVerified === false ? 'border-rose-500 focus:border-rose-500' : ''}`}
              />
              {otpVerified === true && (
                <div className="absolute right-3 top-[38px] text-green-500 pointer-events-none">
                  <CheckCircle size={18} />
                </div>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPass ? "text" : "password"}
                required
                value={password}
                placeholder="Create a new password"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white dark:bg-slate-900
                           border-slate-200 dark:border-slate-800
                           focus:border-primary-500
                           focus:ring-primary-500/20
                           rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-[38px]
                           text-slate-400 hover:text-slate-600 transition"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* STRENGTH */}
            {password && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>Strength</span>
                  <span
                    className={
                      strength >= 4
                        ? "text-primary-600"
                        : "text-slate-500"
                    }
                  >
                    {strengthText[strength]}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${strengthColors[strength]}`}
                    style={{ width: `${strength * 20}%` }}
                  />
                </div>
              </div>
            )}

            {/* CONFIRM */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                placeholder="Re-enter new password"
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-white dark:bg-slate-900
                           border-slate-200 dark:border-slate-800
                           focus:border-primary-500
                           focus:ring-primary-500/20
                           rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-[38px]
                           text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* SUBMIT */}
            <Button
              disabled={loading}
              className="w-full h-12 text-base font-bold
                         bg-primary-600 hover:bg-primary-700
                         text-white rounded-xl
                         shadow-lg shadow-primary-600/30
                         transition-all hover:scale-[1.02]
                         active:scale-[0.98]"
            >
              {loading ? (
                "Updating..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Reset password <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
            Back to{" "}
            <Link
              to="/auth/login"
              className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT – VISUAL */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop')]
                     bg-cover bg-center opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br
                        from-primary-900/40 to-slate-900/70" />
      </div>
    </div>
  );
}
