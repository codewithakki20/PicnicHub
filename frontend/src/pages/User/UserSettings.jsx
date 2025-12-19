import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    User,
    Lock,
    FileText,
    LogOut,
    ChevronRight,
    Moon,
    HelpCircle,
    Info,
    Compass,
    Film,
    MessageCircle,
    Heart,
    UserPlus,
} from "lucide-react";

import { logout } from "../../store/authSlice";
import getPublicUrl from "../../utils/getPublicUrl";
import { useTheme } from "../../context/ThemeContext";

/* ======================================================
   SETTINGS PAGE
====================================================== */

export default function UserSettings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((s) => s.auth.user);
    const { theme, toggleTheme } = useTheme();

    /* ================= STATE ================= */

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("notif-settings");
        return saved
            ? JSON.parse(saved)
            : {
                memories: true,
                reels: true,
                comments: true,
                likes: true,
                follows: true,
            };
    });

    /* ================= SIDE EFFECTS ================= */

    useEffect(() => {
        localStorage.setItem("notif-settings", JSON.stringify(notifications));
    }, [notifications]);

    if (!user) {
        navigate("/auth/login");
        return null;
    }

    /* ================= ACTIONS ================= */

    const handleLogout = () => {
        if (!window.confirm("Log out from PicnicHub?")) return;
        dispatch(logout());
        navigate("/auth/login");
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-slate-900 pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4">

                {/* HEADER */}
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                    Settings
                </h1>

                {/* PROFILE CARD */}
                <Link
                    to="/user/edit"
                    className="block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                    <div className="flex items-center gap-4">
                        <img
                            src={getPublicUrl(user.avatarUrl || user.avatar) || "/default-avatar.png"}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover border"
                        />
                        <div className="flex-1">
                            <h2 className="font-bold text-slate-900 dark:text-white">
                                {user.name || user.username}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {user.email || "No email"}
                            </p>
                        </div>
                        <ChevronRight className="text-slate-400" />
                    </div>
                </Link>

                {/* ACCOUNT */}
                <Section title="Account">
                    <LinkRow icon={User} label="Edit Profile" to="/user/edit" />
                    <LinkRow icon={Lock} label="Change Password" to="/user/change-password" noBorder />
                </Section>

                {/* PREFERENCES */}
                <Section title="Preferences">
                    <ToggleRow
                        icon={Moon}
                        label="Dark Mode"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                        noBorder
                    />
                </Section>

                {/* NOTIFICATIONS */}
                <Section title="Notifications">
                    <ToggleRow icon={Compass} label="Memories" checked={notifications.memories}
                        onChange={(v) => setNotifications({ ...notifications, memories: v })} />
                    <ToggleRow icon={Film} label="Reels" checked={notifications.reels}
                        onChange={(v) => setNotifications({ ...notifications, reels: v })} />
                    <ToggleRow icon={MessageCircle} label="Comments" checked={notifications.comments}
                        onChange={(v) => setNotifications({ ...notifications, comments: v })} />
                    <ToggleRow icon={Heart} label="Likes" checked={notifications.likes}
                        onChange={(v) => setNotifications({ ...notifications, likes: v })} />
                    <ToggleRow icon={UserPlus} label="New Followers" checked={notifications.follows}
                        onChange={(v) => setNotifications({ ...notifications, follows: v })} noBorder />
                </Section>

                {/* LEGAL */}
                <Section title="Legal & About">
                    <LinkRow icon={FileText} label="Terms & Privacy" to="/terms-privacy" />
                    <LinkRow icon={HelpCircle} label="Help & Support" to="/help-support" />
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <Info size={20} className="text-slate-500" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                                App Version
                            </span>
                        </div>
                        <span className="text-slate-500 text-sm">v1.0.0</span>
                    </div>
                </Section>

                {/* LOGOUT */}
                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-4 flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition"
                    >
                        <LogOut size={20} className="text-rose-500" />
                        <span className="font-semibold text-rose-600">Log Out</span>
                    </button>
                </div>

            </div>
        </div>
    );
}

/* ======================================================
   SUB COMPONENTS
====================================================== */

function Section({ title, children }) {
    return (
        <div className="mb-8">
            <h3 className="px-4 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {title}
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {children}
            </div>
        </div>
    );
}

function LinkRow({ icon: Icon, label, to, noBorder }) {
    return (
        <Link
            to={to}
            className={`flex items-center justify-between p-4 transition hover:bg-slate-50 dark:hover:bg-slate-700/50
        ${!noBorder ? "border-b border-slate-100 dark:border-slate-700/50" : ""}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className="text-slate-900 dark:text-white" />
                <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
        </Link>
    );
}

function ToggleRow({ icon: Icon, label, checked, onChange, noBorder }) {
    return (
        <div
            className={`flex items-center justify-between p-4
        ${!noBorder ? "border-b border-slate-100 dark:border-slate-700/50" : ""}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className="text-slate-900 dark:text-white" />
                <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
            </div>

            <label className="relative inline-flex cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-600
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
          peer-checked:after:translate-x-full"
                />
            </label>
        </div>
    );
}
