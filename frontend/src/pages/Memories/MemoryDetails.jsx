import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Share2,
    Calendar,
    MapPin,
    MoreHorizontal,
    Send,
    Trash2,
    Edit
} from "lucide-react";

import memoryApi from "../../api/memoryApi";
import { useAuthContext } from "../../context/AuthContext";
import formatDate from "../../utils/formatDate";
import getPublicUrl from "../../utils/getPublicUrl";
import Spinner from "../../components/ui/Spinner";

/* ================= HELPERS ================= */

const resolveUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    return url.startsWith("http") ? url : getPublicUrl(url);
};

/* ================= PAGE ================= */

export default function MemoryDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [memory, setMemory] = useState(null);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    /* ================= FETCH ================= */

    useEffect(() => {
        loadMemory();
        // eslint-disable-next-line
    }, [id]);

    const loadMemory = async () => {
        try {
            setLoading(true);

            const data = await memoryApi.getMemory(id);
            setMemory(data);
            setLiked(!!data.isLiked);
            setLikesCount(data.likesCount ?? data.likes?.length ?? 0);

            const commentsRes = await memoryApi.getComments(id);
            setComments(commentsRes.comments || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load memory");
        } finally {
            setLoading(false);
        }
    };

    /* ================= ACTIONS ================= */

    const handleLike = async () => {
        if (!user) return navigate("/auth/login");

        const next = !liked;
        setLiked(next);
        setLikesCount((c) => (next ? c + 1 : c - 1));

        try {
            await memoryApi.toggleLike(id);
        } catch {
            // rollback
            setLiked(!next);
            setLikesCount((c) => (!next ? c + 1 : c - 1));
        }
    };

    const handlePostComment = async () => {
        if (!commentText.trim() || submittingComment) return;
        if (!user) return navigate("/auth/login");

        setSubmittingComment(true);
        try {
            const newComment = await memoryApi.addComment(id, {
                text: commentText.trim(),
            });
            setComments((prev) => [...prev, newComment]);
            setCommentText("");
        } catch {
            alert("Failed to post comment");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await memoryApi.deleteComment(id, commentId);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch {
            alert("Failed to delete comment");
        }
    };

    const handleDeleteMemory = async () => {
        if (!window.confirm("Delete this memory permanently?")) return;
        try {
            await memoryApi.deleteMemory(id);
            navigate("/memories");
        } catch {
            alert("Failed to delete memory");
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ url });
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard");
        }
    };

    /* ================= STATES ================= */

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !memory) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-slate-500">{error || "Memory not found"}</p>
                <button
                    onClick={() => navigate("/memories")}
                    className="px-6 py-2 bg-slate-900 text-white rounded-full"
                >
                    Go back
                </button>
            </div>
        );
    }

    /* ================= DATA ================= */

    const imageSrc =
        memory.media?.[0]?.url || memory.images?.[0] || "/placeholder.jpg";

    const author = memory.uploaderId || memory.user || {};
    const authorId = author._id || author.id;
    const isOwner = user?._id === authorId;

    const locObj = memory.locationId || memory.locationSnapshot || memory.location;
    const locName = locObj?.name || (typeof locObj === "string" ? locObj : null);

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-24 px-4 md:px-8 flex justify-center">
            <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl grid lg:grid-cols-[1.2fr_1fr] overflow-hidden">

                {/* IMAGE */}
                <div className="relative bg-black flex items-center justify-center">
                    <img
                        src={resolveUrl(imageSrc)}
                        alt=""
                        className="w-full h-full object-contain bg-black"
                    />

                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white"
                    >
                        <ArrowLeft size={22} />
                    </button>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col max-h-[90vh]">

                    {/* HEADER */}
                    <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                            <img
                                src={resolveUrl(author.avatar || author.avatarUrl)}
                                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                                onClick={() => navigate(`/user/${authorId}`)}
                                alt=""
                            />
                            <div>
                                <h3
                                    onClick={() => navigate(`/user/${authorId}`)}
                                    className="font-bold hover:underline cursor-pointer"
                                >
                                    {author.name || "Unknown User"}
                                </h3>
                                {locName && (
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <MapPin size={12} />
                                        {locName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {isOwner ? (
                            <>
                                <button
                                    onClick={() => navigate(`/memories/edit/${id}`)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={handleDeleteMemory}
                                    className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        ) : (
                            <MoreHorizontal className="text-slate-400" />
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        <div>
                            <p className="text-slate-700 whitespace-pre-wrap">
                                {memory.description || memory.title}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 uppercase">
                                <Calendar size={12} />
                                {formatDate(memory.createdAt)}
                            </div>
                        </div>

                        <hr />

                        {/* COMMENTS */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm">
                                Comments ({comments.length})
                            </h4>

                            {comments.length === 0 ? (
                                <p className="text-slate-400 italic">
                                    No comments yet. Be the first ✨
                                </p>
                            ) : (
                                comments.map((c) => {
                                    const commentAuthorId =
                                        c.authorId?._id || c.authorId || c.userId;
                                    const canDelete =
                                        user?._id === commentAuthorId || isOwner;

                                    return (
                                        <div key={c._id} className="flex gap-3 text-sm">
                                            <img
                                                src={resolveUrl(
                                                    c.authorId?.avatarUrl || c.authorAvatar
                                                )}
                                                className="w-8 h-8 rounded-full object-cover"
                                                alt=""
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-bold">
                                                        {c.authorId?.name || c.authorName}
                                                    </span>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDeleteComment(c._id)}
                                                            className="text-slate-300 hover:text-rose-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-slate-600">{c.text}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t p-4 bg-slate-50 space-y-3">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleLike}
                                className={`transition ${liked ? "text-rose-500" : "text-slate-800"
                                    }`}
                            >
                                <Heart
                                    size={26}
                                    className={liked ? "fill-rose-500" : ""}
                                />
                            </button>

                            <MessageCircle size={26} />

                            <button
                                onClick={handleShare}
                                className="ml-auto text-slate-800 hover:text-green-500"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>

                        <div className="font-semibold text-sm">
                            {likesCount} {likesCount === 1 ? "like" : "likes"}
                        </div>

                        <div className="relative flex">
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handlePostComment()
                                }
                                placeholder="Add a comment…"
                                className="w-full border rounded-xl px-4 py-3 pr-12"
                            />
                            <button
                                onClick={handlePostComment}
                                disabled={!commentText.trim() || submittingComment}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 disabled:opacity-30"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
