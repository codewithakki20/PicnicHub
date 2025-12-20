import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  Volume2,
  VolumeX,
  MoreHorizontal,
  X,
  MapPin,
  Trash2,
  Edit
} from "lucide-react";

import reelsApi from "../../api/reelsApi";
import Spinner from "../../components/ui/Spinner";
import getPublicUrl from "../../utils/getPublicUrl";
import { useAuthContext } from "../../context/AuthContext";

/* ======================================================
   REEL PLAYER (Vertical Scroll)
====================================================== */

export default function ReelPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Load Reel + Suggestions ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const current = await reelsApi.getReel(id);
        const feed = await reelsApi.getReels({ limit: 10 });

        const others = (feed.reels || feed).filter(
          (r) => (r._id || r.id) !== (current._id || current.id)
        );

        setReels([current, ...others]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 p-2 bg-black/30 backdrop-blur-md rounded-full text-white"
      >
        <ArrowLeft />
      </button>

      {/* Scroll Container */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {reels.map((reel) => (
          <ReelSlide key={reel._id || reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   SINGLE REEL SLIDE
====================================================== */

function ReelSlide({ reel }) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(!!reel.isLiked);
  const [likes, setLikes] = useState(reel.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const isOwner = user && (user._id === (reel.uploaderId?._id || reel.uploaderId || reel.userId));

  const locObj = reel.locationId;
  const locName = locObj?.name || (typeof locObj === "string" ? locObj : null);

  const src = getPublicUrl(reel.video || reel.videoUrl);

  /* ---------- Autoplay when visible ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => { });
          setPlaying(true);
        } else {
          videoRef.current.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- Actions ---------- */

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/auth/login");

    const next = !liked;
    setLiked(next);
    setLikes((p) => (next ? p + 1 : p - 1));

    try {
      await reelsApi.toggleReelLike(reel._id || reel.id);
    } catch {
      setLiked(!next);
      setLikes((p) => (!next ? p + 1 : p - 1));
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  const share = async (e) => {
    e.stopPropagation();
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "PicnicHub Reel", url });
      } catch { }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  return (
    <section className="relative h-screen snap-start flex justify-center bg-black">
      {/* VIDEO */}
      <div
        className="relative h-full w-full md:w-[420px] cursor-pointer"
        onClick={() => {
          if (!videoRef.current) return;
          playing
            ? videoRef.current.pause()
            : videoRef.current.play();
          setPlaying((p) => !p);
        }}
      >
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          loop
          playsInline
          muted={muted}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Mute */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 text-white">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={getPublicUrl(reel.uploaderId?.avatarUrl || reel.uploaderId?.avatar || reel.user?.avatarUrl || reel.user?.avatar) || "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              alt=""
              onClick={() => navigate(`/user/${reel.uploaderId?._id || reel.uploaderId || reel.userId}`)}
            />
            <span
              className="font-bold cursor-pointer hover:underline"
              onClick={() => navigate(`/user/${reel.uploaderId?._id || reel.uploaderId || reel.userId}`)}
            >
              {reel.uploaderId?.username || reel.uploaderId?.name || reel.user?.username || reel.user?.name || "User"}
            </span>
          </div>

          {locName && (
            <div className="flex items-center gap-1 text-xs font-medium text-slate-200 mb-2 bg-white/10 backdrop-blur w-fit px-2 py-0.5 rounded-full">
              <MapPin size={10} className="text-emerald-400" />
              {locName}
            </div>
          )}

          <p className="text-sm opacity-90 line-clamp-2">
            {reel.caption}
          </p>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6 text-white">
          <button onClick={toggleLike} className="flex flex-col items-center">
            <Heart
              size={28}
              className={liked ? "fill-rose-500 text-rose-500" : ""}
            />
            <span className="text-xs">{likes}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="flex flex-col items-center"
          >
            <MessageCircle size={28} />
            <span className="text-xs">
              {reel.comments?.length || 0}
            </span>
          </button>

          <button onClick={share}>
            <Share2 size={26} />
          </button>

          {isOwner ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/reels/edit/${reel._id || reel.id}`);
                }}
                className="flex flex-col items-center"
              >
                <Edit size={26} />
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!window.confirm("Delete reel?")) return;
                  try {
                    await reelsApi.deleteReel(reel._id || reel.id);
                    window.location.reload();
                  } catch { alert("Failed"); }
                }}
                className="flex flex-col items-center hover:text-rose-500"
              >
                <Trash2 size={26} className="text-rose-400" />
              </button>
            </>
          ) : (
            <button>
              <MoreHorizontal size={24} />
            </button>
          )}
        </div>
      </div>

      {/* COMMENTS DRAWER */}
      {showComments && (
        <CommentsDrawer
          reel={reel}
          onClose={() => setShowComments(false)}
        />
      )}
    </section>
  );
}

/* ======================================================
   COMMENTS DRAWER
====================================================== */

function CommentsDrawer({ reel, onClose }) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reelsApi.getComments(reel._id || reel.id);
        // api returns { comments: [], pagination: {} }
        const list = res.comments || (Array.isArray(res) ? res : []);
        setComments(list);
      } catch (e) {
        console.error(e);
        // If fetch fails, keep existing local comments but ensure array
        setComments(prev => Array.isArray(prev) ? prev : []);
      }
    };
    fetch();
  }, [reel._id, reel.id]);

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await reelsApi.addComment(reel._id || reel.id, { text });
      // api returns { comment: { ... } }
      const newComment = res.comment || res;
      setComments(prev => [newComment, ...prev]);
      setText("");
    } catch (e) {
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await reelsApi.deleteComment(reel._id || reel.id, commentId);
      setComments(prev => prev.filter(c => (c._id || c.id) !== commentId));
    } catch (e) {
      alert("Failed to delete comment");
    }
  };

  return (
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full md:w-[400px] h-[70vh] bg-white rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white text-slate-900">
          <h3 className="font-bold">
            Comments ({comments.length})
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 text-sm text-slate-900 bg-white">
          {comments.length ? (
            comments.map((c, i) => {
              const commentUser = c.user || c.author || c.authorId || {};
              // Ensure we are working with an object for user data
              const userObj = (typeof commentUser === 'object' && commentUser !== null) ? commentUser : {};

              const avatar = userObj.avatarUrl || userObj.avatar || c.authorAvatar || c.userAvatar;
              const username = userObj.username || userObj.name || c.authorName || c.username || "User";
              let commentText = c.text || c.content || c.body || c.comment || "";
              if (typeof commentText === 'object') {
                commentText = ""; // Fallback if it's still an object
              }

              const userId = userObj._id || userObj.id || c.userId || (typeof commentUser === "string" ? commentUser : null);
              const isMyComment = user && (userId === user._id || userId === user.id);
              const isMyReel = user && (reel.uploaderId === user._id || reel.user?._id === user._id);

              return (
                <div key={c._id || i} className="mb-4 flex gap-3">
                  <img src={getPublicUrl(avatar) || "/default-avatar.png"} className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0 object-cover" alt={username} onError={(e) => e.target.src = "/default-avatar.png"} />
                  <div className="flex-1 group">
                    <div className="flex items-start justify-between">
                      <p className="text-sm break-all">
                        <span className="font-bold mr-2 text-slate-900">{username}</span>
                        <span className="text-slate-700">{commentText}</span>
                      </p>
                      {(isMyComment || isMyReel) && (
                        <button
                          onClick={() => handleDelete(c._id || c.id)}
                          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition px-2"
                          title="Delete comment"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Just now"}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center mt-10 text-slate-500">
              No comments yet 🌿
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-slate-50 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePost()}
            placeholder="Add a comment…"
            className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm outline-none text-slate-900 focus:border-green-500 transition"
          />
          <button
            onClick={handlePost}
            disabled={!text.trim() || loading}
            className="text-green-600 font-bold px-3 disabled:opacity-40 hover:bg-green-50 rounded-full transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
