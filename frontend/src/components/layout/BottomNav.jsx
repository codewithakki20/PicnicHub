import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Video, BookOpen, User } from "lucide-react";
import { useSelector } from "react-redux";
import getPublicUrl from "../../utils/getPublicUrl";

/* ================= COMPONENT ================= */

export default function BottomNav() {
    const { pathname } = useLocation();
    const { user } = useSelector((state) => state.auth);

    // Hide on auth & error pages
    if (pathname.startsWith("/auth") || pathname === "/404") return null;

    const isActive = (path) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const activeClass = "text-primary-600 dark:text-primary-400";
    const inactiveClass = "text-slate-500 dark:text-slate-400";

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900
                    border-t border-slate-200 dark:border-slate-800
                    px-6 py-3 flex justify-between items-center pb-safe">

            {/* HOME */}
            <Link to="/" className={`p-2 ${isActive("/") ? activeClass : inactiveClass}`}>
                <Home
                    size={28}
                    strokeWidth={isActive("/") ? 2.5 : 2}
                    fill={isActive("/") ? "currentColor" : "none"}
                />
            </Link>

            {/* MEMORIES */}
            <Link
                to="/memories"
                className={`p-2 ${isActive("/memories") ? activeClass : inactiveClass}`}
            >
                <Compass size={28} strokeWidth={isActive("/memories") ? 2.5 : 2} />
            </Link>

            {/* REELS */}
            <Link
                to="/reels"
                className={`p-2 ${isActive("/reels") ? activeClass : inactiveClass}`}
            >
                <Video size={28} strokeWidth={isActive("/reels") ? 2.5 : 2} />
            </Link>

            {/* BLOGS */}
            <Link
                to="/blogs"
                className={`p-2 ${isActive("/blogs") ? activeClass : inactiveClass}`}
            >
                <BookOpen size={28} strokeWidth={isActive("/blogs") ? 2.5 : 2} />
            </Link>

            {/* PROFILE */}
            <Link
                to={user ? "/profile" : "/auth/login"}
                className={`p-2 ${isActive("/user/") ? activeClass : inactiveClass}`}
            >
                {user?.avatarUrl || user?.avatar ? (
                    <img
                        src={getPublicUrl(user.avatarUrl || user.avatar)}
                        alt="Profile"
                        className={`w-7 h-7 rounded-full object-cover border-2 transition
              ${isActive("/user/")
                                ? "border-primary-600 dark:border-primary-400"
                                : "border-transparent"
                            }`}
                    />
                ) : (
                    <User size={28} strokeWidth={isActive("/user/") ? 2.5 : 2} />
                )}
            </Link>
        </nav>
    );
}
