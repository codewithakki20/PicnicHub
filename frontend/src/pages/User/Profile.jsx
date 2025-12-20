import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe } from "../../store/authSlice";

import {
  Grid,
  Video,
  Film,
  BookOpen,
  Settings,
  MapPin,
  Link as LinkIcon,
  Users,
  Building2,
  GraduationCap,
} from "lucide-react";

import getPublicUrl from "../../utils/getPublicUrl";
import Spinner from "../../components/ui/Spinner";

import memoryApi from "../../api/memoryApi";
import reelsApi from "../../api/reelsApi";
import blogApi from "../../api/blogApi";
import BlogCard from "../../components/cards/BlogCard";

/* ================= HELPERS ================= */

const resolveUrl = (url) =>
  url ? (url.startsWith("http") ? url : getPublicUrl(url)) : "";

const safeWebsite = (url) =>
  url ? (url.startsWith("http") ? url : `https://${url}`) : null;

/* ================= GRID ITEM ================= */

const ProfilePost = ({ item, type = "memory", onClick }) => {
  const hoverTimer = useRef(null);

  const media =
    type === "reel"
      ? item.coverImage || item.thumbnail || item.videoUrl
      : item.media?.[0]?.url || item.images?.[0];

  const likes = item.likesCount ?? item.likes?.length ?? 0;
  const comments = item.commentsCount ?? item.comments?.length ?? 0;

  return (
    <div
      onClick={onClick}
      className="relative aspect-square cursor-pointer group bg-slate-100 overflow-hidden rounded-xl"
    >
      {type === "reel" ? (
        <video
          src={resolveUrl(item.videoUrl)}
          poster={resolveUrl(item.coverImage || item.thumbnail)}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onMouseEnter={(e) => {
            hoverTimer.current = setTimeout(() => e.target.play(), 250);
          }}
          onMouseLeave={(e) => {
            clearTimeout(hoverTimer.current);
            e.target.pause();
            e.target.currentTime = 0;
          }}
        />
      ) : (
        <img
          src={resolveUrl(media) || "/placeholder.jpg"}
          alt=""
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-semibold">
        <span>❤️ {likes}</span>
        <span>💬 {comments}</span>
      </div>

      {type === "reel" && (
        <Video size={16} className="absolute top-2 right-2 text-white" />
      )}
    </div>
  );
};

/* ================= PAGE ================= */

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);

  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "memories";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  const [memories, setMemories] = useState([]);
  const [reels, setReels] = useState([]);
  const [blogs, setBlogs] = useState([]);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    dispatch(fetchMe())
      .unwrap()
      .catch(() => navigate("/auth/login"))
      .finally(() => setLoading(false));
  }, [dispatch, navigate]);

  /* ================= SYNC TAB ↔ URL ================= */

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    p.set("tab", activeTab);
    navigate({ search: p.toString() }, { replace: true });
  }, [activeTab, navigate, location.search]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      if (activeTab === "memories" && !memories.length) {
        const res = await memoryApi.getMemories({ my: true });
        setMemories(res.memories || []);
      }

      if (activeTab === "reels" && !reels.length) {
        const res = await reelsApi.getReels({ my: true });
        setReels(res.reels || []);
      }

      if (activeTab === "blogs" && user.role === "admin" && !blogs.length) {
        const res = await blogApi.getBlogs({ my: true });
        setBlogs(res.blogs || []);
      }
    };

    load();
  }, [activeTab, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const website = safeWebsite(user.website);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER CARD */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-200 mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* AVATAR */}
            <img
              src={resolveUrl(user.avatarUrl || user.avatar) || "/default-avatar.png"}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-emerald-200"
            />

            {/* INFO */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900">
                {user.name}
              </h1>

              <p className="text-slate-600 mt-2 max-w-xl">
                {user.bio || "Capture moments, share stories."}
              </p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm font-semibold text-slate-600">
                <span>{memories.length} Memories</span>
                <span>{reels.length} Reels</span>
                <button onClick={() => navigate(`/user/${user._id}/follow-list?tab=followers`)}>
                  {user.followersCount ?? user.followers?.length ?? 0} Followers
                </button>
                <button onClick={() => navigate(`/user/${user._id}/follow-list?tab=following`)}>
                  {user.followingCount ?? user.following?.length ?? 0} Following
                </button>
              </div>

              {(user.college || user.branch || user.course || user.year) && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {user.college && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                      <Building2 size={14} />
                      {user.college}
                    </div>
                  )}
                  {user.course && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                      <BookOpen size={14} />
                      {user.course}
                    </div>
                  )}
                  {user.branch && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                      <GraduationCap size={14} />
                      {user.branch}
                    </div>
                  )}
                  {user.year && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold">
                      <span>🎓 {user.year}</span>
                    </div>
                  )}
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-1 text-slate-500 mt-2">
                  <MapPin size={14} /> {user.location}
                </div>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 mt-1"
                >
                  <LinkIcon size={14} />
                  {website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <Link
                to="/user/edit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => navigate("/user/settings")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full border border-slate-200 p-1 flex gap-1">
            <Tab label="Memories" icon={Grid} active={activeTab === "memories"} onClick={() => setActiveTab("memories")} />
            <Tab label="Reels" icon={Film} active={activeTab === "reels"} onClick={() => setActiveTab("reels")} />
            {user.role === "admin" && (
              <Tab label="Blogs" icon={BookOpen} active={activeTab === "blogs"} onClick={() => setActiveTab("blogs")} />
            )}
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "memories" && (
          <GridWrap>
            {memories.length ? memories.map((m) => (
              <ProfilePost key={m._id} item={m} onClick={() => navigate(`/memories/${m._id}`)} />
            )) : <EmptyState text="No memories yet" />}
          </GridWrap>
        )}

        {activeTab === "reels" && (
          <GridWrap>
            {reels.length ? reels.map((r) => (
              <ProfilePost key={r._id} item={r} type="reel" onClick={() => navigate(`/reels/${r._id}`)} />
            )) : <EmptyState text="No reels yet" />}
          </GridWrap>
        )}

        {activeTab === "blogs" && (
          <GridWrap cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogs.length ? blogs.map((b) => <BlogCard key={b._id} blog={b} />) : <EmptyState text="No blogs yet" />}
          </GridWrap>
        )}
      </div>
    </div>
  );
}

/* ================= SMALL ================= */

const Tab = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition
      ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const GridWrap = ({ children, cols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) => (
  <div className={`grid ${cols} gap-6 animate-fade-in`}>
    {children}
  </div>
);

const EmptyState = ({ text }) => (
  <div className="col-span-full flex flex-col items-center py-20 text-slate-400">
    <Users size={48} className="mb-4" />
    <p className="text-lg font-semibold">{text}</p>
  </div>
);
