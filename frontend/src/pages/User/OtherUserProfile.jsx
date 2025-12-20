import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Grid,
    Video,
    BookOpen,
    UserPlus,
    UserMinus,
    Share2,
    ArrowLeft,
    Users,
    Building2,
    GraduationCap,
} from "lucide-react";

import getPublicUrl from "../../utils/getPublicUrl";
import Spinner from "../../components/ui/Spinner";

import userApi from "../../api/userApi";
import memoryApi from "../../api/memoryApi";
import reelsApi from "../../api/reelsApi";
import blogApi from "../../api/blogApi";

import MemoryCard from "../../components/cards/MemoryCard";
import ReelCard from "../../components/cards/ReelCard";
import BlogCard from "../../components/cards/BlogCard";

/* ================= HELPERS ================= */

const avatarUrl = (u) =>
    getPublicUrl(u?.avatarUrl || u?.avatar) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u?.name || "User"
    )}&background=E5F4F1&color=0F766E`;

/* ================= PAGE ================= */

export default function OtherUserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((s) => s.auth.user);

    const [loading, setLoading] = useState(true);
    const [profileUser, setProfileUser] = useState(null);

    const [activeTab, setActiveTab] = useState("memories");
    const [isFollowing, setIsFollowing] = useState(false);

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const [memories, setMemories] = useState([]);
    const [reels, setReels] = useState([]);
    const [blogs, setBlogs] = useState([]);

    /* ================= LOAD USER ================= */

    useEffect(() => {
        if (!id || id === "undefined") {
            navigate("/404");
            return;
        }

        if (currentUser?._id === id) {
            navigate("/profile", { replace: true });
            return;
        }

        const loadUser = async () => {
            try {
                setLoading(true);
                const res = await userApi.fetchUser(id);
                const user = res.user || res;

                setProfileUser(user);

                const followers = user.followers || [];
                const following = user.following || [];

                setFollowersCount(followers.length);
                setFollowingCount(following.length);
                setIsFollowing(
                    currentUser ? followers.includes(currentUser._id) : false
                );
            } catch {
                navigate("/404");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id, currentUser, navigate]);

    /* ================= LOAD CONTENT ================= */

    useEffect(() => {
        if (!profileUser) return;

        const load = async () => {
            if (activeTab === "memories" && !memories.length) {
                const res = await memoryApi.getMemories({ userId: id });
                setMemories(res.memories || []);
            }
            if (activeTab === "reels" && !reels.length) {
                const res = await reelsApi.getReels({ userId: id });
                setReels(res.reels || []);
            }
            if (
                activeTab === "blogs" &&
                profileUser.role === "admin" &&
                !blogs.length
            ) {
                const res = await blogApi.getBlogs({ userId: id });
                setBlogs(res.blogs || []);
            }
        };

        load();
    }, [activeTab, profileUser, id]);

    /* ================= FOLLOW ================= */

    const toggleFollow = async () => {
        if (!currentUser) {
            navigate("/auth/login");
            return;
        }

        const prev = isFollowing;
        setIsFollowing(!prev);
        setFollowersCount((c) => (prev ? c - 1 : c + 1));

        try {
            prev ? await userApi.unfollowUser(id) : await userApi.followUser(id);
        } catch {
            setIsFollowing(prev);
            setFollowersCount((c) => (prev ? c + 1 : c - 1));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!profileUser) return null;

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
            <div className="max-w-6xl mx-auto px-4">

                {/* BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                {/* HERO */}
                <section className="relative rounded-[2.5rem] p-6 md:p-10 mb-12
          bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl">

                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        <img
                            src={avatarUrl(profileUser)}
                            alt={profileUser.name}
                            className="w-28 h-28 rounded-full object-cover ring-4 ring-emerald-200"
                        />

                        <div className="flex-1 space-y-3">
                            <h1 className="text-3xl font-extrabold text-slate-900">
                                {profileUser.name}
                            </h1>

                            <p className="text-slate-600 max-w-xl">
                                {profileUser.bio || "No bio yet — just vibes."}
                            </p>

                            <div className="flex flex-wrap gap-6 pt-2 text-sm font-semibold text-slate-600">
                                <span>{profileUser.memoryCount ?? memories.length} Memories</span>
                                <span>{profileUser.reelCount ?? reels.length} Reels</span>
                                <button onClick={() => navigate(`/user/${id}/follow-list?tab=followers`)}>
                                    {followersCount} Followers
                                </button>
                                <button onClick={() => navigate(`/user/${id}/follow-list?tab=following`)}>
                                    {followingCount} Following
                                </button>
                            </div>

                            {(profileUser.college || profileUser.branch || profileUser.course || profileUser.year) && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {profileUser.college && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                                            <Building2 size={14} />
                                            {profileUser.college}
                                        </div>
                                    )}
                                    {profileUser.course && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                                            <BookOpen size={14} />
                                            {profileUser.course}
                                        </div>
                                    )}
                                    {profileUser.branch && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                                            <GraduationCap size={14} />
                                            {profileUser.branch}
                                        </div>
                                    )}
                                    {profileUser.year && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold">
                                            <span>🎓 {profileUser.year}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3">
                            <button
                                onClick={toggleFollow}
                                className={`px-6 py-2.5 rounded-2xl font-semibold flex items-center gap-2 transition
                  ${isFollowing
                                        ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                    }`}
                            >
                                {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                {isFollowing ? "Following" : "Follow"}
                            </button>

                            <button className="px-6 py-2.5 rounded-2xl border border-slate-200
                font-semibold flex items-center gap-2 hover:bg-slate-50">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>
                </section>

                {/* STICKY TABS */}
                <div className="sticky top-20 z-20 mb-10">
                    <div className="mx-auto w-fit bg-white/80 backdrop-blur-xl
            border border-slate-200 rounded-full p-1 flex gap-1 shadow-lg">
                        <Tab icon={Grid} label="Memories" active={activeTab === "memories"} onClick={() => setActiveTab("memories")} />
                        <Tab icon={Video} label="Reels" active={activeTab === "reels"} onClick={() => setActiveTab("reels")} />
                        {profileUser.role === "admin" && (
                            <Tab icon={BookOpen} label="Blogs" active={activeTab === "blogs"} onClick={() => setActiveTab("blogs")} />
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                {activeTab === "memories" && (
                    <GridWrap>
                        {memories.length
                            ? memories.map((m) => (
                                <MemoryCard
                                    key={m._id}
                                    memory={m}
                                    onClick={() => navigate(`/memories/${m._id}`)}
                                />
                            ))
                            : <EmptyState text="No memories yet" />}
                    </GridWrap>
                )}

                {activeTab === "reels" && (
                    <GridWrap cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {reels.length
                            ? reels.map((r) => (
                                <ReelCard
                                    key={r._id}
                                    reel={r}
                                    onClick={() => navigate(`/reels/${r._id}`)}
                                />
                            ))
                            : <EmptyState text="No reels yet" />}
                    </GridWrap>
                )}

                {activeTab === "blogs" && (
                    <GridWrap cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.length
                            ? blogs.map((b) => (
                                <BlogCard
                                    key={b._id}
                                    blog={b}
                                    onClick={() => navigate(`/blogs/${b.slug}`)}
                                />
                            ))
                            : <EmptyState text="No blogs yet" />}
                    </GridWrap>
                )}
            </div>
        </div>
    );
}

/* ================= SMALL ================= */

const Tab = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition
      ${active
                ? "bg-slate-900 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
    >
        <Icon size={16} /> {label}
    </button>
);

const GridWrap = ({
    children,
    cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => (
    <div className={`grid ${cols} gap-8 animate-fade-in`}>
        {children}
    </div>
);

const EmptyState = ({ text }) => (
    <div className="col-span-full flex flex-col items-center py-24 text-slate-400">
        <Users size={56} className="mb-4" />
        <p className="text-xl font-semibold">{text}</p>
    </div>
);
