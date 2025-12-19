import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import client from "../../api/axiosClient";
import getPublicUrl from "../../utils/getPublicUrl";

/* ================= HELPERS ================= */

const resolveUrl = (url) =>
    url ? (url.startsWith("http") ? url : getPublicUrl(url)) : "/default-avatar.png";

/* ================= COMPONENT ================= */

export default function StorySection({ user }) {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);

    useEffect(() => {
        let mounted = true;

        client
            .get("/stories")
            .then((res) => mounted && setStories(res.data?.data || []))
            .catch(() => mounted && setStories([]));

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">

            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 min-w-max px-1">

                    {/* CREATE STORY */}
                    {user && (
                        <Link
                            to="/create-story"
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 p-[2px] rounded-full bg-primary-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <img
                                        src={resolveUrl(user.avatarUrl || user.avatar)}
                                        alt="Your story"
                                        className="w-full h-full rounded-full object-cover group-hover:opacity-90 transition"
                                    />
                                </div>

                                <div className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                                    <Plus size={14} strokeWidth={3} />
                                </div>
                            </div>

                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition">
                                Your story
                            </span>
                        </Link>
                    )}

                    {/* OTHER STORIES */}
                    {stories.map((group) => {
                        const first = group.stories?.[0];
                        if (!first) return null;

                        return (
                            <div
                                key={group.user?._id}
                                onClick={() => navigate(`/stories/${first._id}`)}
                                className="flex flex-col items-center gap-1 cursor-pointer group"
                            >
                                <div className="p-[2px] rounded-full bg-gradient-to-tr from-primary-400 via-emerald-500 to-accent-400 group-hover:scale-105 transition-transform">
                                    <div className="p-[2px] bg-white dark:bg-slate-900 rounded-full">
                                        <img
                                            src={resolveUrl(group.user?.avatarUrl || first.mediaUrl)}
                                            alt={group.user?.username}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    </div>
                                </div>

                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate w-16 text-center group-hover:text-slate-900 dark:group-hover:text-white transition">
                                    {group.user?.username || group.user?.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
