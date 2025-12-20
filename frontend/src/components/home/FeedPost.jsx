import { useState } from "react";
import {
    Heart,
    MessageCircle,
    Send,
    MoreHorizontal,
    Trash2,
    Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

import memoryApi from "../../api/memoryApi";
import formatDate from "../../utils/formatDate";
import getPublicUrl from "../../utils/getPublicUrl";

/* ================= HELPERS ================= */

const resolveUrl = (url) =>
    url ? (url.startsWith("http") ? url : getPublicUrl(url)) : "/placeholder.jpg";

/* ================= COMPONENT ================= */

export default function FeedPost({ memory }) {
    const navigate = useNavigate();

    const { user } = useAuthContext();
    const author = memory.uploaderId || memory.user || {};
    const authorId = author._id;
    const isOwner = user?._id === authorId;
    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Delete this memory?")) return;
        try {
            await memoryApi.deleteMemory(memory._id);
            setIsDeleted(true);
        } catch {
            alert("Delete failed");
        }
    };

    const [liked, setLiked] = useState(memory.isLikedByMe || false);
    const [likes, setLikes] = useState(
        memory.likesCount ?? memory.likes?.length ?? 0
    );

    const toggleLike = async () => {
        const prevLiked = liked;
        const prevLikes = likes;

        setLiked(!prevLiked);
        setLikes(prevLiked ? likes - 1 : likes + 1);

        try {
            await memoryApi.toggleLike(memory._id);
        } catch {
            setLiked(prevLiked);
            setLikes(prevLikes);
        }
    };

    const locObj = memory.locationId || memory.locationSnapshot || memory.location;
    const locationName =
        locObj?.name ||
        (typeof locObj === "string" ? locObj : null) ||
        memory.locationName;

    /* ================= UI ================= */

    if (isDeleted) return null;

    return (
        <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4">
                <div
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => navigate(`/user/${authorId}`)}
                >
                    <div className="relative">
                        <img
                            src={resolveUrl(author.avatarUrl || author.avatar)}
                            alt={author.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />

                        {memory.year && (
                            <span className="absolute -bottom-1 -right-1 bg-primary-50 dark:bg-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-slate-700 text-primary-700 dark:text-primary-400">
                                {memory.year}
                            </span>
                        )}
                    </div>

                    <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {author.username || author.name}
                        </p>

                        {locationName && (
                            <p className="text-xs text-slate-500 truncate max-w-[160px]">
                                {locationName}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isOwner ? (
                        <>
                            <button
                                onClick={() => navigate(`/memories/edit/${memory._id}`)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                title="Edit"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full text-slate-400 hover:text-rose-500 transition"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    ) : (
                        <MoreHorizontal
                            size={20}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        />
                    )}
                </div>
            </div>

            {/* MEDIA */}
            <div
                className="relative aspect-square sm:aspect-[4/3] bg-black cursor-pointer group"
                onDoubleClick={toggleLike}
                onClick={() => navigate(`/memories/${memory._id}`)}
            >
                <img
                    src={resolveUrl(memory.media?.[0]?.url || memory.images?.[0])}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                />

                {/* TITLE OVERLAY */}
                {memory.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                        <h3 className="text-white font-semibold text-lg drop-shadow-md line-clamp-1">
                            {memory.title}
                        </h3>
                    </div>
                )}
            </div>

            {/* ACTIONS */}
            <div className="p-4">
                <div className="flex justify-between mb-3">
                    <div className="flex gap-4">
                        <button
                            onClick={toggleLike}
                            className="hover:-translate-y-0.5 transition-transform"
                        >
                            <Heart
                                size={26}
                                className={`${liked
                                    ? "fill-rose-500 text-rose-500"
                                    : "text-slate-800 dark:text-white hover:text-rose-500"
                                    }`}
                            />
                        </button>

                        <button
                            onClick={() => navigate(`/memories/${memory._id}`)}
                            className="text-slate-800 dark:text-white hover:text-primary-600 hover:-translate-y-0.5 transition-transform"
                        >
                            <MessageCircle size={26} />
                        </button>

                        <button
                            className="text-slate-800 dark:text-white hover:text-primary-600 hover:-translate-y-0.5 transition-transform"
                        >
                            <Send size={26} />
                        </button>
                    </div>
                </div>

                {/* LIKES */}
                <p className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                    {likes === 1 ? "1 like" : `${likes.toLocaleString()} likes`}
                </p>

                {/* CAPTION */}
                <div className="space-y-1 mb-2">
                    <p className="text-sm text-slate-800 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white mr-2">
                            {author.username || author.name}
                        </span>
                        {memory.description || memory.caption}
                    </p>

                    {/* TAGS */}
                    {memory.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {memory.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                                >
                                    #{typeof tag === "string" ? tag.trim() : tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* COMMENTS */}
                <button
                    className="text-slate-500 text-sm mt-1 hover:text-slate-800 dark:hover:text-slate-300"
                    onClick={() => navigate(`/memories/${memory._id}`)}
                >
                    View all comments
                </button>

                {/* TIME */}
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">
                    {formatDate(memory.createdAt)}
                </p>
            </div>
        </article>
    );
}
