// src/pages/Auth/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setMsg(res?.message || "OTP sent to your email!");

      // Redirect to reset password
      setTimeout(() => {
        navigate("/auth/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to send reset instructions."
      );
    } finally {
      setLoading(false);
    }
  };

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

          {/* BACK */}
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2
                       text-sm font-semibold
                       text-slate-500 dark:text-slate-400
                       hover:text-slate-900 dark:hover:text-white
                       transition"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

          {/* HEADER */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center
                            w-12 h-12 rounded-xl
                            bg-primary-100 dark:bg-primary-900/30
                            text-primary-600 dark:text-primary-400 mb-6">
              <Mail className="w-6 h-6" />
            </div>

            <h1 className="text-4xl font-display font-black
                           text-slate-900 dark:text-white
                           tracking-tight mb-2">
              Forgot password?
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No stress — we’ll help you reset it.
            </p>
          </div>

          {/* SUCCESS */}
          {msg && (
            <div className="p-4 rounded-xl
                            bg-primary-50 dark:bg-primary-900/20
                            border border-primary-100 dark:border-primary-800
                            text-primary-700 dark:text-primary-400
                            text-sm font-medium
                            flex items-center gap-2">
              <Send size={16} />
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
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark:bg-slate-900
                         border-slate-200 dark:border-slate-800
                         focus:border-primary-500
                         focus:ring-primary-500/20
                         rounded-xl"
            />

            <Button
              disabled={loading}
              className="w-full h-12 text-base font-bold
                         bg-primary-600 hover:bg-primary-700
                         text-white rounded-xl
                         shadow-lg shadow-primary-600/30
                         transition-all
                         hover:scale-[1.02]
                         active:scale-[0.98]"
            >
              {loading ? "Sending..." : "Send reset code"}
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT – VISUAL */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop')]
                     bg-cover bg-center opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-tr
                        from-primary-900/40 to-slate-900/70" />
      </div>
    </div>
  );
}
