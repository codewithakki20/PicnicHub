// src/pages/Auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import authApi from "../../api/authApi";

/* ================= PAGE ================= */

export default function Register() {
  const navigate = useNavigate();
  const { status } = useAuth();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  /* ================= PASSWORD STRENGTH ================= */

  const getStrength = () => {
    const p = values.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = getStrength();
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

    if (values.password !== values.confirmPassword)
      return setError("Passwords do not match.");

    if (values.password.length < 6)
      return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      await authApi.register(values);

      toast.success("Registration successful! Please verify your email.");
      navigate("/auth/verify-email", {
        state: { email: values.email },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* LEFT – FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* HEADER */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Create your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Start your PicnicHub journey today
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              required
              placeholder="John Doe"
              onChange={handleChange}
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
                         focus:border-primary-500 focus:ring-primary-500/20 rounded-xl"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              onChange={handleChange}
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
                         focus:border-primary-500 focus:ring-primary-500/20 rounded-xl"
            />

            {/* PASSWORD */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                onChange={handleChange}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
                           focus:border-primary-500 focus:ring-primary-500/20 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* STRENGTH */}
            {values.password && (
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
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Confirm your password"
                onChange={handleChange}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
                           focus:border-primary-500 focus:ring-primary-500/20 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* SUBMIT */}
            <Button
              disabled={loading}
              className="w-full h-12 text-base font-bold bg-primary-600 hover:bg-primary-700
                         text-white rounded-xl shadow-lg shadow-primary-600/30
                         transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Get started <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT – VISUAL */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')]
                        bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-900/40 to-slate-900/70" />

        <div className="absolute bottom-0 left-0 right-0 p-20 text-white z-10 space-y-6">
          {[
            "Save your favorite spots",
            "Share your stories",
            "Join the community",
          ].map((t) => (
            <div key={t} className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary-500/20 backdrop-blur">
                <CheckCircle2 className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-xl font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
