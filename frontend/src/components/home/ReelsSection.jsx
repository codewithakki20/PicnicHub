import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";

import reelsApi from "../../api/reelsApi";
import getPublicUrl from "../../utils/getPublicUrl";

/* ================= HELPERS ================= */

const resolveUrl = (url) =>
    url ? (url.startsWith("http") ? url : getPublicUrl(url)) : "/placeholder.jpg";

/* ================= COMPONENT ================= */

export default function ReelsSection() {
    const navigate = useNavigate();
    const [reels, setReels] = useState([]);

    useEffect(() => {
        reelsApi
            .getReels({ limit: 5 })
            .then((res) => setReels(res.reels || []));
    }, []);

    if (!reels.length) return null;

    return (
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-200">
                    Suggested Reels
                </h3>

                <Link
                    to="/reels"
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide
                     text-primary-600 dark:text-primary-400 hover:text-primary-700 transition"
                >
                    See all
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* REELS STRIP */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {reels.map((r) => {
                    const user = r.uploaderId || r.user || {};
                    const avatar = resolveUrl(user.avatarUrl || user.avatar);
                    const name = user.username || user.name || "User";

                    return (
                        <div
                            key={r._id}
                            onClick={() => navigate(`/reels/${r._id}`)}
                            className="w-[160px] h-[280px] min-w-[160px] rounded-2xl overflow-hidden relative cursor-pointer
                         bg-black shadow-md hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* VIDEO PREVIEW */}
                            <video
                                src={resolveUrl(r.videoUrl)}
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />

                            {/* GRADIENT */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                            {/* PLAY ICON */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                                    <Play size={20} className="text-white fill-white ml-0.5" />
                                </div>
                            </div>

                            {/* USER INFO */}
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <img
                                        src={avatar}
                                        alt={name}
                                        className="w-5 h-5 rounded-full border border-white/50 object-cover"
                                    />
                                    <span className="text-xs font-semibold truncate opacity-90">
                                        {name}
                                    </span>
                                </div>

                                <p className="text-[10px] text-white/70 line-clamp-1">
                                    {r.caption || "No caption"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
