import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    MessageCircle,
    UserPlus,
    Bell,
    Trash2,
    CheckCircle,
    Clock,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import notificationApi from "../api/notificationApi";
import getPublicUrl from "../utils/getPublicUrl";
import Spinner from "../components/ui/Spinner";

dayjs.extend(relativeTime);

/* ================= META ================= */

const getNotificationMeta = (type) => {
    switch (type) {
        case "FOLLOW":
            return {
                icon: <UserPlus size={16} />,
                color: "text-blue-600 bg-blue-50",
                text: "started following you",
            };

        case "LIKE_MEMORY":
        case "LIKE_REEL":
        case "LIKE_BLOG":
            return {
                icon: <Heart size={16} className="fill-current" />,
                color: "text-rose-500 bg-rose-50",
                text: "liked your post",
            };

        case "COMMENT_MEMORY":
        case "COMMENT_REEL":
        case "COMMENT_BLOG":
            return {
                icon: <MessageCircle size={16} />,
                color: "text-emerald-600 bg-emerald-50",
                text: "commented on your post",
            };

        default:
            return {
                icon: <Bell size={16} />,
                color: "text-slate-500 bg-slate-100",
                text: "sent a notification",
            };
    }
};

const avatarFallback =
    "https://ui-avatars.com/api/?name=User&background=random";

/* ================= PAGE ================= */

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await notificationApi.getNotifications();
            if (res?.success) {
                setNotifications(res.data || []);
            }
        } catch (e) {
            console.error("Failed to load notifications", e);
        } finally {
            setLoading(false);
        }
    };

    /* ================= ACTIONS ================= */

    const markRead = async (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            )
        );

        try {
            await notificationApi.markRead(id);
        } catch {
            // rollback if needed
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, isRead: false } : n
                )
            );
        }
    };

    const deleteNotification = async (id) => {
        const snapshot = notifications;

        setNotifications((prev) => prev.filter((n) => n._id !== id));

        try {
            await notificationApi.deleteNotification(id);
        } catch {
            setNotifications(snapshot);
        }
    };

    /* ================= STATES ================= */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pt-20">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-[#FAFAF9] pt-16 pb-24">
            <div className="max-w-2xl mx-auto md:px-4">

                {/* HEADER */}
                <div className="px-4 md:px-0 mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Notifications
                    </h1>
                </div>

                {/* LIST */}
                <div className="bg-white md:rounded-2xl md:shadow-sm md:border border-slate-200 overflow-hidden min-h-[400px]">

                    {notifications.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            <AnimatePresence initial={false}>
                                {notifications.map((n) => {
                                    const meta = getNotificationMeta(n.type);
                                    const sender = n.senderId || {};

                                    return (
                                        <motion.li
                                            key={n._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => !n.isRead && markRead(n._id)}
                                            className={`relative flex gap-4 p-4 cursor-pointer transition
                        hover:bg-slate-50
                        ${!n.isRead ? "bg-blue-50/40" : ""}
                      `}
                                        >
                                            {/* AVATAR */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={
                                                        getPublicUrl(sender.avatarUrl) ||
                                                        avatarFallback
                                                    }
                                                    alt=""
                                                    className="w-12 h-12 rounded-full object-cover border"
                                                />
                                                <div
                                                    className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${meta.color}`}
                                                >
                                                    {meta.icon}
                                                </div>
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 min-w-0 pt-1">
                                                <p className="text-sm text-slate-900 leading-snug">
                                                    <span className="font-bold hover:underline">
                                                        {sender.name || "Someone"}
                                                    </span>{" "}
                                                    {meta.text}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                    <Clock size={12} />
                                                    {dayjs(n.createdAt).fromNow()}
                                                </div>
                                            </div>

                                            {/* ACTIONS */}
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 md:flex transition-opacity">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markRead(n._id);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                                        title="Mark as read"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(n._id);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* UNREAD DOT (mobile) */}
                                            {!n.isRead && (
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full md:hidden" />
                                            )}
                                        </motion.li>
                                    );
                                })}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ================= EMPTY ================= */

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
                No notifications yet
            </h3>
            <p className="text-slate-500 text-sm max-w-sm">
                Likes, comments, and follows will show up here.
            </p>
        </div>
    );
}
