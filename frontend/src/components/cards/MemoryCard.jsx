import { useState } from "react";
import {
  Calendar,
  MapPin,
  Heart,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import memoryApi from "../../api/memoryApi";
import formatDate from "../../utils/formatDate";
import getPublicUrl from "../../utils/getPublicUrl";

/* ======================================================
   MEMORY CARD — NEW UI/UX
====================================================== */

export default function MemoryCard({
  memory,
  onClick,
  minimal = false,
  aspectRatio = "aspect-square",
  className = "",
}) {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  /* ---------------- DATA ---------------- */
  const imageSrc =
    memory.media?.[0]?.url ||
    memory.images?.[0] ||
    "/placeholder.jpg";

  const title = memory.title || "Untitled memory";
  const author = memory.uploaderId || memory.user || {};
  const locObj =
    memory.locationId || memory.locationSnapshot || memory.location;
  const locName =
    locObj?.name || (typeof locObj === "string" ? locObj : null);

  const id = memory._id || memory.id;

  /* ---------------- LIKE (OPTIMISTIC) ---------------- */
  const [liked, setLiked] = useState(!!memory.isLiked);
  const [likes, setLikes] = useState(
    memory.likesCount || memory.likes?.length || 0
  );
  const [likeAnim, setLikeAnim] = useState(false);

  /* ---------------- COMMENTS ---------------- */
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(memory.comments || []);
  const [commentsCount, setCommentsCount] = useState(
    memory.commentsCount || comments.length || 0
  );

  /* ---------------- HELPERS ---------------- */
  const requireAuth = () => {
    if (!user) {
      navigate("/auth/login");
      return false;
    }
    return true;
  };

  const toggleLike = async (e) => {
    e?.stopPropagation();
    if (!requireAuth()) return;

    const next = !liked;
    setLiked(next);
    setLikes((p) => (next ? p + 1 : p - 1));

    if (next) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 600);
    }

    try {
      await memoryApi.toggleLike(id);
    } catch {
      setLiked(!next);
      setLikes((p) => (!next ? p + 1 : p - 1));
    }
  };

  const postComment = async () => {
    if (!requireAuth() || !commentText.trim()) return;

    const text = commentText;
    setCommentText("");

    try {
      const res = await memoryApi.addComment(id, { text });
      setComments((p) => [...p, res]);
      setCommentsCount((p) => p + 1);
    } catch {
      alert("Failed to add comment");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await memoryApi.deleteComment(id, commentId);
      setComments((p) => p.filter((c) => c._id !== commentId));
      setCommentsCount((p) => p - 1);
    } catch {
      alert("Delete failed");
    }
  };

  /* ======================================================
     MINIMAL / MASONRY CARD
====================================================== */

  if (minimal) {
    return (
      <div
        onClick={onClick}
        className={`relative ${aspectRatio} rounded-3xl overflow-hidden cursor-pointer group bg-slate-100 dark:bg-slate-800 mb-6 break-inside-avoid ${className}`}
      >
        <img
          src={getPublicUrl(imageSrc)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-semibold">
          <span className="flex items-center gap-1">
            <Heart size={16} fill="white" /> {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={16} fill="white" /> {commentsCount}
          </span>
        </div>
      </div>
    );
  }

  /* ======================================================
     FULL FEED CARD (NEW UX)
====================================================== */

  return (
    <article
      onClick={onClick}
      onDoubleClick={toggleLike}
      className={`group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col ${className}`}
    >
      {/* ================= MEDIA ================= */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getPublicUrl(imageSrc)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Like burst */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${likeAnim ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
        >
          <Heart size={90} className="fill-white text-white drop-shadow-2xl" />
        </div>

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur">
            Memory
          </span>

          {locName && (
            <span className="max-w-[65%] truncate px-3 py-1 rounded-full text-xs text-white bg-black/40 backdrop-blur flex items-center gap-1">
              <MapPin size={12} className="text-green-400" />
              {locName}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold line-clamp-1 drop-shadow">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs opacity-80">
            <Calendar size={12} />
            {formatDate(memory.createdAt)}
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4">
          {memory.description || "A beautiful picnic moment 🌿"}
        </p>

        {/* ================= COMMENTS ================= */}
        {showComments && (
          <div
            className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write something nice…"
                className="flex-1 rounded-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-900"
                onKeyDown={(e) => e.key === "Enter" && postComment()}
              />
              <button
                onClick={postComment}
                disabled={!commentText.trim()}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </div>

            {comments.slice(-3).map((c) => (
              <div
                key={c._id}
                className="flex justify-between text-xs text-slate-600 dark:text-slate-400"
              >
                <span>
                  <b>{c.authorId?.name || c.authorName || "User"}:</b>{" "}
                  {c.text}
                </span>

                {(user?._id === (c.authorId?._id || c.authorId)) && (
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="hover:text-rose-500"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          {/* Author */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              author._id && navigate(`/user/${author._id}`);
            }}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <img
              src={getPublicUrl(author.avatar) || "/default-avatar.png"}
              className="w-8 h-8 rounded-full object-cover border"
              alt=""
            />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {author.name || "Explorer"}
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-5 text-slate-400">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 transition ${liked ? "text-rose-500" : "hover:text-rose-500"
                }`}
            >
              <Heart size={18} className={liked ? "fill-rose-500" : ""} />
              <span className="text-xs font-bold">{likes}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments((p) => !p);
              }}
              className="flex items-center gap-1 hover:text-green-600"
            >
              <MessageCircle size={18} />
              <span className="text-xs font-bold">{commentsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
