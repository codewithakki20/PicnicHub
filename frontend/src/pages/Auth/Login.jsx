// src/pages/Auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ================= PAGE ================= */

export default function Login() {
  const navigate = useNavigate();
  const { login, status } = useAuth();

  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!values.email.trim())
      return setError("Email is required.");
    if (!values.password.trim())
      return setError("Password cannot be empty.");

    try {
      const res = await login(values).unwrap();
      if (res) navigate("/");
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* LEFT – FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center
                      p-8 sm:p-12 lg:p-20 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100
                        rounded-full blur-3xl opacity-50
                        -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-100
                        rounded-full blur-3xl opacity-40
                        translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* HEADER */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1
                            rounded-full bg-primary-50 dark:bg-primary-900/30
                            text-primary-600 dark:text-primary-400
                            text-xs font-bold mb-6 border
                            border-primary-100 dark:border-primary-800">
              <Sparkles className="w-3 h-3" />
              Welcome back
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-black
                           text-slate-900 dark:text-white
                           tracking-tight mb-3">
              Login to your account
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Continue your PicnicHub journey
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50
                            border border-rose-100
                            text-rose-600 text-sm font-medium
                            flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              onChange={handleChange}
              className="bg-white dark:bg-slate-900
                         border-slate-200 dark:border-slate-800
                         focus:border-primary-500
                         focus:ring-primary-500/20
                         rounded-xl"
            />

            {/* PASSWORD */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                onChange={handleChange}
                className="bg-white dark:bg-slate-900
                           border-slate-200 dark:border-slate-800
                           focus:border-primary-500
                           focus:ring-primary-500/20
                           rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px]
                           text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* REMEMBER / FORGOT */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2
                                text-sm font-medium
                                text-slate-600 dark:text-slate-400
                                cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded
                             border-slate-300 dark:border-slate-600
                             bg-white dark:bg-slate-800
                             text-primary-600
                             focus:ring-primary-500"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>

              <Link
                to="/auth/forgot-password"
                className="text-sm font-bold
                           text-primary-600 dark:text-primary-400
                           hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT */}
            <Button
              disabled={status === "loading"}
              className="w-full h-12 text-base font-bold
                         bg-primary-600 hover:bg-primary-700
                         text-white rounded-xl
                         shadow-lg shadow-primary-600/30
                         transition-all
                         hover:scale-[1.02]
                         active:scale-[0.98]"
            >
              {status === "loading" ? (
                "Signing in..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-slate-500 dark:text-slate-400 font-medium">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-primary-600 dark:text-primary-400
                         font-bold hover:underline"
            >
              Create free account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT – VISUAL */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop')]
                     bg-cover bg-center opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br
                        from-primary-900/40 to-slate-900/70" />

        <div className="absolute bottom-0 left-0 right-0 p-20 text-white z-10">
          <h2 className="text-5xl font-display font-black mb-6 leading-tight">
            Capture moments,<br />share memories.
          </h2>
          <p className="text-xl text-primary-100 max-w-md leading-relaxed font-light">
            Join explorers and storytellers building memories together.
          </p>
        </div>
      </div>
    </div>
  );
}
