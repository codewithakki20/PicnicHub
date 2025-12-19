import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Compass,
  Film,
  Heart,
  PlusSquare,
  User,
  Menu,
  LogOut,
  Settings,
  Sun,
  Moon,
  FileText,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useRef, useState } from "react";

/* ================= COMPONENT ================= */

export default function MainSidebar() {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar on auth pages & 404
  const isHidden =
    location.pathname.startsWith("/auth") ||
    location.pathname === "*" ||
    location.pathname === "/404";

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const moreRef = useRef(null);
  const createRef = useRef(null);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const close = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target)) {
        setIsCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (isHidden) return null;

  /* ================= NAV ITEMS ================= */

  const navItems = [
    { label: "Home", icon: Home, to: "/" },
    { label: "Search", icon: Search, to: "/user/find-people" },
    { label: "Memories", icon: Compass, to: "/memories" },
    { label: "Reels", icon: Film, to: "/reels" },
    { label: "Blogs", icon: FileText, to: "/blogs" },
    { label: "Notifications", icon: Heart, to: "/notifications" },
  ];

  if (user?.role === "admin") {
    navItems.push({
      label: "Admin",
      icon: Settings,
      to: "/admin",
    });
  }

  navItems.push({
    label: "Profile",
    icon: User,
    to: `/user/${user?._id}`,
  });

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  /* ================= UI ================= */

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col z-50">

      {/* LOGO */}
      <div className="p-8 pb-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo-icon.png"
            alt="PicnicHub"
            className="w-8 h-8 object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-primary-800 dark:text-primary-400">
            PicnicHub
          </span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-full transition font-medium
              ${isActive
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* CREATE */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => {
              setIsCreateOpen((v) => !v);
              setIsMoreOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition font-medium
              ${isCreateOpen
                ? "bg-primary-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-800/50"
              }`}
          >
            <PlusSquare size={22} />
            Create
          </button>

          {isCreateOpen && (
            <div className="absolute left-full top-0 ml-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
              <CreateItem
                label="Story"
                onClick={() => navigate("/create-story")}
              />
              <CreateItem
                label="Reel"
                icon={Film}
                onClick={() => navigate("/user/upload-reel")}
              />
              <CreateItem
                label="Memory"
                icon={Compass}
                onClick={() => navigate("/user/upload-memory")}
              />
            </div>
          )}
        </div>
      </nav>

      {/* MORE */}
      <div className="p-4 relative" ref={moreRef}>
        {isMoreOpen && (
          <div className="absolute bottom-16 left-4 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50">
            <MenuItem
              icon={Settings}
              label="Settings"
              onClick={() => navigate("/user/settings")}
            />
            <MenuItem
              icon={theme === "dark" ? Sun : Moon}
              label="Switch Appearance"
              onClick={toggleTheme}
            />
            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
            <MenuItem
              icon={LogOut}
              label="Log out"
              danger
              onClick={handleLogout}
            />
          </div>
        )}

        <button
          onClick={() => {
            setIsMoreOpen((v) => !v);
            setIsCreateOpen(false);
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
        >
          <Menu size={22} />
          More
        </button>
      </div>
    </aside>
  );
}

/* ================= SUB COMPONENTS ================= */

function CreateItem({ label, icon: Icon = PlusSquare, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-700 transition"
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${danger
          ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
          : "text-slate-700 dark:text-slate-200 hover:bg-primary-50 dark:hover:bg-slate-700"
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
