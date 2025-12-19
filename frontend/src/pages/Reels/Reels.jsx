import { useState, useRef, useEffect } from "react";
import { Play, Heart, MessageCircle, Share2, MoreHorizontal, Volume2, VolumeX, ArrowUp, ArrowDown, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import reelsApi from "../../api/reelsApi";
import userApi from "../../api/userApi";
import getPublicUrl from "../../utils/getPublicUrl";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Spinner from "../../components/ui/Spinner";

/* =========================
   REELS PAGE (Instagram Style)
========================= */

export default function Reels() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Fetch Logic
  const fetchReels = async (page) => {
    try {
      const res = await reelsApi.getReels({ page, limit: 5 });
      return res?.reels || res || [];
    } catch (e) {
      return [];
    }
  };

  const { items: reels, loader, end } = useInfiniteScroll(fetchReels);

  // Auto-play logic using Intersection Observer
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setCurrentReelIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    const elements = document.querySelectorAll(".reel-item");
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [reels]);

  // Scroll Navigation
  const scrollToIndex = (index) => {
    const el = document.querySelector(`[data-index="${index}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Container: Dark mode, full screen height, handling safe areas
    <div className="h-[100vh] w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative" ref={containerRef}>

      {/* Mobile Header (Absolute) */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2 md:hidden drop-shadow-md">
        <span className="text-xl font-bold font-insta">Reels</span>
      </div>

      {/* Navigation Buttons (Desktop Only) */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        <button
          onClick={() => scrollToIndex(currentReelIndex - 1)}
          className="p-3 bg-slate-800/50 hover:bg-slate-700/80 rounded-full backdrop-blur-md transition disabled:opacity-30"
          disabled={currentReelIndex === 0}
        >
          <ArrowUp size={20} />
        </button>
        <button
          onClick={() => scrollToIndex(currentReelIndex + 1)}
          className="p-3 bg-slate-800/50 hover:bg-slate-700/80 rounded-full backdrop-blur-md transition disabled:opacity-30"
          disabled={end && currentReelIndex === reels.length - 1}
        >
          <ArrowDown size={20} />
        </button>
      </div>

      {reels.map((reel, index) => (
        <ReelItem
          key={reel._id}
          reel={reel}
          isActive={index === currentReelIndex}
          index={index}
        />
      ))}

      {/* Loader at bottom */}
      <div ref={loader} className="h-20 flex justify-center items-center snap-center bg-black w-full pb-20 md:pb-0">
        {!end && <Spinner />}
        {end && <span className="text-slate-500 text-sm">No more reels</span>}
      </div>

    </div>
  );
}

/* =========================
   SINGLE REEL ITEM
========================= */
function ReelItem({ reel, isActive, index }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // Interaction State
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(reel.comments?.length || 0);

  // UI State
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Initialize Liked State
  useEffect(() => {
    if (user && reel.likes) {
      const isLiked = reel.likes.some(like => {
        const likeId = typeof like === 'string' ? like : (like._id || like.id);
        const userId = user._id || user.id;
        return likeId === userId;
      });
      setLiked(isLiked);
    }
  }, [user, reel.likes]);

  // Sync Play/Pause with Active State
  useEffect(() => {
    if (isActive && !isDeleted) {
      if (videoRef.current?.paused) videoRef.current.play().catch(() => { });
    } else {
      videoRef.current?.pause();
    }
  }, [isActive, isDeleted]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleLike = async () => {
    if (!user) return alert("Please login to like reels");

    // Optimistic Update
    const isNowLiked = !liked;
    setLiked(isNowLiked);
    setLikesCount(prev => isNowLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      await reelsApi.toggleReelLike(reel._id || reel.id);
    } catch (e) {
      console.error(e);
      // Revert if failed
      setLiked(!isNowLiked);
      setLikesCount(prev => !isNowLiked ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const handleShare = async () => {
    const url = window.location.href; // In real app, might want specific reel URL
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Watch ${reel.user?.username || "this"}'s reel on PicnicHub`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleDeleteReel = async () => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      await reelsApi.deleteReel(reel._id || reel.id);
      setIsDeleted(true);
      setShowOptions(false);
    } catch (error) {
      console.error("Failed to delete reel:", error);
      alert("Failed to delete reel");
    }
  };

  if (isDeleted) {
    return (
      <div className="reel-item h-full w-full flex justify-center items-center snap-start bg-black text-white/50" data-index={index}>
        <div className="text-center">
          <Trash2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>Reel deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="reel-item h-full w-full flex md:justify-center items-center snap-start relative"
      data-index={index}
    >
      {/* VIDEO CONTAINER */}
      <div className="relative w-full h-full md:h-[90vh] md:w-auto md:aspect-[9/16] bg-slate-900 md:rounded-xl overflow-hidden shadow-2xl">

        <video
          ref={videoRef}
          src={getPublicUrl(reel.videoUrl)}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onClick={toggleMute}
        />

        {/* Mute Indicator */}
        <div className="absolute top-16 md:top-4 right-4 bg-black/40 p-2 rounded-full backdrop-blur-sm cursor-pointer z-20 pointer-events-auto" onClick={toggleMute}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </div>

        {/* BOTTOM OVERLAY INFO (Content) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 md:pb-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            {/* User */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={getPublicUrl(reel.uploaderId?.avatarUrl || reel.uploaderId?.avatar || reel.user?.avatarUrl || reel.user?.avatar)}
                className="w-9 h-9 rounded-full border border-white/20 object-cover"
                alt=""
                onClick={() => navigate(`/user/${reel.uploaderId?._id || reel.uploaderId || reel.userId}`)}
              />
              <span
                className="font-bold text-sm hover:underline cursor-pointer drop-shadow-md text-white"
                onClick={() => navigate(`/user/${reel.uploaderId?._id || reel.uploaderId || reel.userId}`)}
              >
                {reel.uploaderId?.username || reel.uploaderId?.name || reel.user?.username || reel.user?.name || "User"}
              </span>

              {/* Follow Button */}
              <ReelFollowButton userId={reel.uploaderId?._id || reel.uploaderId || reel.userId} initialIsFollowing={reel.isFollowing} />
            </div>

            {/* Caption */}
            <div className="max-w-[85%]">
              <p className="text-sm mb-3 drop-shadow-md leading-snug text-white">
                {reel.caption}
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE: ACTIONS OVERLAY (Bottom Right) */}
        <div className="absolute bottom-24 right-3 z-30 flex flex-col items-center gap-6 md:hidden">
          <ActionIcon icon={Heart} label={likesCount} active={liked} onClick={handleLike} color="text-red-500" />
          <ActionIcon icon={MessageCircle} label={commentsCount} onClick={() => setShowComments(true)} />
          <ActionIcon icon={Share2} onClick={handleShare} />
          <ActionIcon icon={MoreHorizontal} onClick={() => setShowOptions(true)} />
          <div className="mt-2 w-7 h-7 rounded-md border-2 border-white overflow-hidden shadow-sm">
            <img src={getPublicUrl(reel.thumbnail || reel.uploaderId?.avatar)} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Comments Drawer */}
        {showComments && (
          <CommentsDrawer
            reel={reel}
            onClose={() => setShowComments(false)}
            onCommentUpdate={(delta) => setCommentsCount(prev => prev + delta)}
          />
        )}

        {/* Options Drawer */}
        {showOptions && (
          <OptionsDrawer
            reel={reel}
            onClose={() => setShowOptions(false)}
            onDelete={handleDeleteReel}
            onShare={handleShare}
          />
        )}

      </div>

      {/* DESKTOP: SIDE ACTIONS (Outside Container) */}
      <div className="hidden md:flex flex-col gap-6 ml-6 justify-end h-[90vh] pb-8">
        <ActionIcon icon={Heart} label={likesCount} active={liked} onClick={handleLike} color="text-red-500" />
        <ActionIcon icon={MessageCircle} label={commentsCount} onClick={() => setShowComments(true)} />
        <ActionIcon icon={Share2} onClick={handleShare} />
        <ActionIcon icon={MoreHorizontal} onClick={() => setShowOptions(true)} />
        <div className="mt-4 w-8 h-8 rounded-lg border-2 border-white/20 overflow-hidden cursor-pointer hover:scale-105 transition">
          <img src={getPublicUrl(reel.thumbnail || reel.uploaderId?.avatar)} className="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  );
}

function ActionIcon({ icon: Icon, label, active, onClick, color = "text-white" }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onClick}>
      <div className={`p-3 rounded-full hover:bg-slate-800/50 transition ${active ? 'bg-transparent' : ''}`}>
        <Icon
          size={28}
          className={`transition-transform group-hover:scale-110 ${active ? `${color} fill-current` : "text-white"}`}
          strokeWidth={active ? 0 : 2}
        />
      </div>
      {label !== undefined && <span className="text-xs font-medium">{label}</span>}
    </div>
  )
}

/* =========================
 COMMENTS DRAWER
========================= */
function CommentsDrawer({ reel, onClose, onCommentUpdate }) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState(Array.isArray(reel.comments) ? reel.comments : []);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reelsApi.getComments(reel._id || reel.id);
        const fetchedComments = (res && res.comments) ? res.comments : (Array.isArray(res) ? res : []);
        setComments(fetchedComments);
        // We could sync count here too if we wanted perfect accuracy
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [reel._id, reel.id]);

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await reelsApi.addComment(reel._id || reel.id, { text });
      const newComment = res.comment || res;
      setComments(prev => [...prev, newComment]);
      setText("");
      if (onCommentUpdate) onCommentUpdate(1);
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
      if (onCommentUpdate) onCommentUpdate(-1);
    } catch (e) {
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="w-full md:w-[450px] h-[75vh] bg-white text-slate-900 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-bold text-lg">Comments <span className="text-slate-400 text-sm ml-1">{comments.length}</span></h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 gap-2">
              <MessageCircle size={48} />
              <p>No comments yet</p>
            </div>
          ) : (
            comments.map((c, i) => {
              const commentUser = c.user || c.author || c.authorId || {};
              const userObj = (typeof commentUser === 'object' && commentUser !== null) ? commentUser : {};

              const avatar = userObj.avatarUrl || userObj.avatar || c.authorAvatar || c.userAvatar;
              const username = userObj.username || userObj.name || c.authorName || c.username || "User";
              let commentText = c.text || c.content || c.body || c.comment || "";
              if (typeof commentText === 'object') commentText = "";

              const userId = userObj._id || userObj.id || c.userId || (typeof commentUser === "string" ? commentUser : null);
              const isMyComment = user && (userId === user._id || userId === user.id);
              const isMyReel = user && (reel.uploaderId === user._id || reel.user?._id === user._id);

              return (
                <div key={c._id || i} className="flex gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300 fill-mode-backwards" style={{ animationDelay: `${i * 50}ms` }}>
                  <img
                    src={getPublicUrl(avatar) || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full border border-slate-200 flex-shrink-0 object-cover"
                    alt={username}
                    onError={(e) => e.target.src = "/default-avatar.png"}
                  />
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
                    <p className="text-xs text-slate-400 mt-1">Reply</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 bg-white p-1 pr-2 rounded-full border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all shadow-sm">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 pl-4 py-2 bg-transparent outline-none text-sm min-w-0"
              onKeyDown={e => e.key === 'Enter' && handlePost()}
            />
            <button
              onClick={handlePost}
              disabled={!text.trim() || loading}
              className="text-emerald-600 font-bold text-sm px-3 py-1.5 hover:bg-emerald-50 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReelFollowButton({ userId, initialIsFollowing }) {
  const { user } = useAuthContext();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [loading, setLoading] = useState(false);

  if (user?._id === userId) return null;

  const toggleFollow = async (e) => {
    e.stopPropagation();
    if (!user) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await userApi.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await userApi.followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`text-xs border px-3 py-1 backdrop-blur-md rounded-lg font-semibold transition z-50 pointer-events-auto
                ${isFollowing
          ? "bg-transparent text-white/70 border-white/40 hover:bg-white/10"
          : "bg-white/10 text-white border-white/50 hover:bg-white/20"
        }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

/* =========================
   OPTIONS DRAWER (Delete, Report, etc.)
========================= */
function OptionsDrawer({ reel, onClose, onDelete, onShare }) {
  const { user } = useAuthContext();
  const userId = reel.uploaderId?._id || reel.uploaderId || reel.userId;
  const isOwner = user && (user._id === userId || user.id === userId);

  return (
    <div
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full md:w-[350px] bg-white text-slate-900 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 flex justify-center mb-2">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        <div className="flex flex-col gap-1">
          {isOwner && (
            <button
              onClick={onDelete}
              className="w-full p-4 text-center text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition flex items-center justify-center gap-3"
            >
              <Trash2 size={20} />
              Delete Reel
            </button>
          )}

          <button
            onClick={() => {
              onShare();
              onClose();
            }}
            className="w-full p-4 text-center text-slate-900 font-medium hover:bg-slate-50 rounded-xl transition flex items-center justify-center gap-3"
          >
            <Share2 size={20} />
            Share
          </button>

          <button
            onClick={onClose}
            className="w-full p-4 text-center text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
