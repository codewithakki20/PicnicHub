import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    X,
    ChevronLeft,
    ChevronRight,
    Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";

import storyApi from "../../api/storyApi";
import getPublicUrl from "../../utils/getPublicUrl";

/* ================= CONFIG ================= */

const STORY_DURATION = 5000; // 5s per story
const TICK_RATE = 50;

/* ================= HELPERS ================= */

const resolveUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    return url.startsWith("http") ? url : getPublicUrl(url);
};

/* ================= PAGE ================= */

export default function StoryView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);

    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    /* ================= FETCH ================= */

    useEffect(() => {
        loadStories();
        return stopTimer;
        // eslint-disable-next-line
    }, []);

    const loadStories = async () => {
        try {
            setLoading(true);
            const res = await storyApi.getStories();

            const groups = Array.isArray(res) ? res : res?.data || [];

            const flat = groups.flatMap((g) =>
                (g.stories || []).map((s) => ({
                    ...s,
                    user: g.user,
                }))
            );

            setStories(flat);

            if (id) {
                const idx = flat.findIndex((s) => s._id === id);
                if (idx !== -1) setCurrentIndex(idx);
            }
        } catch (e) {
            console.error("Story fetch failed", e);
        } finally {
            setLoading(false);
        }
    };

    /* ================= STORY CHANGE ================= */

    useEffect(() => {
        if (!stories[currentIndex]) return;

        storyApi.viewStory(stories[currentIndex]._id).catch(() => { });
        startTimer();

        return stopTimer;
        // eslint-disable-next-line
    }, [currentIndex, stories]);

    /* ================= TIMER ================= */

    const startTimer = () => {
        stopTimer();
        setProgress(0);
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const pct = (elapsed / STORY_DURATION) * 100;

            if (pct >= 100) {
                stopTimer();
                nextStory();
            } else {
                setProgress(pct);
            }
        }, TICK_RATE);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    /* ================= NAV ================= */

    const nextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            navigate(-1);
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
        } else {
            setProgress(0);
        }
    };

    const handleTap = (e) => {
        const x = e.clientX;
        const w = window.innerWidth;

        if (x < w / 3) prevStory();
        else nextStory();
    };

    /* ================= DELETE ================= */

    const handleDelete = async () => {
        if (!window.confirm("Delete this story?")) return;

        stopTimer();
        try {
            const id = stories[currentIndex]._id;
            await storyApi.deleteStory(id);

            const updated = stories.filter((s) => s._id !== id);
            setStories(updated);

            if (!updated.length) navigate(-1);
            else if (currentIndex >= updated.length)
                setCurrentIndex(updated.length - 1);
        } catch {
            alert("Failed to delete story");
            startTimer();
        }
    };

    /* ================= STATES ================= */

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="h-12 w-12 rounded-full border-t-2 border-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!stories.length) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
                <p className="mb-4">No stories available</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-zinc-800 rounded-full"
                >
                    Close
                </button>
            </div>
        );
    }

    const story = stories[currentIndex];
    const isOwner =
        user?._id === story.user?._id || user?.id === story.user?._id;

    /* ================= UI ================= */

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center md:py-8">

            {/* CLOSE */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full text-white hover:bg-white/10"
            >
                <X size={24} />
            </button>

            <div className="relative w-full h-full md:w-[400px] md:h-[80vh] bg-zinc-900 md:rounded-[2rem] overflow-hidden shadow-2xl">

                {/* PROGRESS */}
                <div className="absolute top-4 inset-x-4 z-20 flex gap-1 h-1">
                    {stories.map((s, i) => (
                        <div key={s._id} className="flex-1 bg-white/30 rounded-full">
                            <div
                                className="h-full bg-white transition-all"
                                style={{
                                    width:
                                        i < currentIndex
                                            ? "100%"
                                            : i === currentIndex
                                                ? `${progress}%`
                                                : "0%",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* HEADER */}
                <div className="absolute top-8 inset-x-4 z-20 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <img
                            src={resolveUrl(story.user?.avatarUrl || story.user?.avatar)}
                            className="w-8 h-8 rounded-full object-cover"
                            alt=""
                        />
                        <div>
                            <p className="text-sm font-semibold">
                                {story.user?.name || "User"}
                            </p>
                            <p className="text-xs text-white/70">
                                {new Date(story.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    {isOwner && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            className="p-2 bg-black/30 hover:bg-red-500/80 rounded-full"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>

                {/* STORY */}
                <div
                    onClick={handleTap}
                    className="w-full h-full cursor-pointer relative"
                >
                    <img
                        src={resolveUrl(story.mediaUrl || story.imageUrl)}
                        className="w-full h-full object-cover"
                        alt=""
                    />
                    <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-2 pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevStory();
                        }}
                        className="pointer-events-auto p-1 bg-white/20 rounded-full hover:bg-white/40"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextStory();
                        }}
                        className="pointer-events-auto p-1 bg-white/20 rounded-full hover:bg-white/40"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}
