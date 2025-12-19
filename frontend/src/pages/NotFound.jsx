// src/pages/NotFound.jsx
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Home, Compass, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-2xl w-full">
        <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">

          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-emerald-400 to-sky-400" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-3xl opacity-50" />

          {/* Icon Badge */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-700 mb-8 border border-slate-100 dark:border-slate-600 shadow-sm animate-bounce-slow">
            <Compass className="w-10 h-10 text-slate-800 dark:text-white" strokeWidth={1.5} />
          </div>

          {/* Typographic Visual */}
          <h1 className="relative text-8xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none select-none">
            4<span className="text-emerald-500">0</span>4
          </h1>

          <h2 className="relative text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 px-8">
            Off the beaten path
          </h2>

          <p className="relative text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you're looking for might have been moved, deleted, or possibly never existed.
          </p>

          {/* Actions */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-xl shadow-slate-200 dark:shadow-none hover:-translate-y-1 transition-all"
            >
              <Home className="w-5 h-5" />
              Home Page
            </Link>
          </div>

          {/* Quick Links */}
          <div className="relative mt-12 pt-8 border-t border-slate-100 dark:border-slate-700/50">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Explore Instead</p>
            <div className="flex flex-wrap justify-center gap-4">
              <QuickLink to="/user/find-people" icon={Search} label="Search" />
              <QuickLink to="/memories" icon={MapPin} label="Memories" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-100 dark:border-slate-600 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all text-sm font-bold shadow-sm"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
