// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  LayoutDashboard,
  Users,
  Camera,
  Film,
  BookOpen,
  MapPin,
  LogOut,
  Settings,
  Home
} from "lucide-react";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", icon: Home }, // ✅ added
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/memories", label: "Memories", icon: Camera },
    { to: "/admin/reels", label: "Reels", icon: Film },
    { to: "/admin/blogs", label: "Blogs", icon: BookOpen },
    { to: "/admin/locations", label: "Locations", icon: MapPin },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside className="w-64 h-full fixed top-0 left-0 flex flex-col
      bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950
      border-r border-emerald-800 text-emerald-100
    ">

      {/* ================= HEADER ================= */}
      <div className="p-6 border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="PicnicHub"
            className="w-9 h-9 object-contain"
          />
          <div className="leading-tight">
            <span className="block text-lg font-black text-white">
              PicnicHub
            </span>
            <span className="text-xs text-emerald-300 font-semibold">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">

        <p className="px-4 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 mt-2">
          Navigation
        </p>

        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl
               text-sm font-bold transition-all
               ${isActive
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30"
                : "text-emerald-200 hover:bg-emerald-800/60 hover:text-white"
              }`
            }
          >
            <l.icon className="w-5 h-5" />
            {l.label}
          </NavLink>
        ))}

        <p className="px-4 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 mt-6">
          Settings
        </p>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl
             text-sm font-bold transition-all
             ${isActive
              ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/30"
              : "text-emerald-200 hover:bg-emerald-800/60 hover:text-white"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center gap-2
            px-4 py-3 rounded-xl text-sm font-bold
            text-rose-400 hover:text-rose-300
            hover:bg-rose-500/10 transition-all
          "
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
