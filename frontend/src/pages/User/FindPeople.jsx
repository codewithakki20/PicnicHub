import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    UserPlus,
    UserMinus,
    Users,
    Loader,
} from "lucide-react";

import userApi from "../../api/userApi";
import getPublicUrl from "../../utils/getPublicUrl";
import Spinner from "../../components/ui/Spinner";

/* ================= UTILS ================= */

const resolveAvatar = (u) =>
    getPublicUrl(u?.avatar || u?.profilePicture) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u?.name || "User"
    )}&background=E5F7ED&color=14532D`;

function useDebounce(value, delay = 350) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

/* ================= PAGE ================= */

export default function FindPeople() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [results, setResults] = useState([]);

    /* ============ LOAD SUGGESTED ============ */

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await userApi.getSuggestedUsers();
                setSuggestedUsers(Array.isArray(res) ? res : res.users || []);
            } catch (e) {
                console.error("Failed to load suggestions", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ============ SEARCH USERS ============ */

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setResults([]);
            return;
        }

        (async () => {
            try {
                setLoading(true);
                const res = await userApi.fetchAllUsers({ limit: 200 });
                const q = debouncedSearch.toLowerCase();

                setResults(
                    (res.users || []).filter(
                        (u) =>
                            u.name?.toLowerCase().includes(q) ||
                            u.username?.toLowerCase().includes(q) ||
                            u.bio?.toLowerCase().includes(q)
                    )
                );
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [debouncedSearch]);

    /* ============ FOLLOW (OPTIMISTIC) ============ */

    const toggleFollow = async (userId, isFollowing) => {
        const update = (list) =>
            list.map((u) =>
                u._id === userId
                    ? {
                        ...u,
                        isFollowing: !isFollowing,
                        followersCount: isFollowing
                            ? Math.max(0, (u.followersCount || 1) - 1)
                            : (u.followersCount || 0) + 1,
                    }
                    : u
            );

        setSuggestedUsers(update);
        setResults(update);

        try {
            isFollowing
                ? await userApi.unfollowUser(userId)
                : await userApi.followUser(userId);
        } catch {
            // rollback on fail
            setSuggestedUsers(update);
            setResults(update);
            alert("Failed to update follow status");
        }
    };

    const usersToShow = useMemo(
        () => (debouncedSearch.trim() ? results : suggestedUsers),
        [debouncedSearch, results, suggestedUsers]
    );

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-slate-950 pt-24 pb-24">
            <div className="max-w-6xl mx-auto px-4">

                {/* ================= STICKY SEARCH ================= */}
                <div className="sticky top-20 z-20 bg-[#FAFAF8]/90 dark:bg-slate-950/90 backdrop-blur pb-6">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                        Find People
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-5">
                        Discover creators, travelers & storytellers
                    </p>

                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, username, or bio…"
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                    </div>
                </div>

                {/* ================= TITLE ================= */}
                <div className="flex items-center gap-3 mb-6 mt-8">
                    <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center">
                        <Users size={20} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {debouncedSearch
                            ? `Results (${usersToShow.length})`
                            : "Suggested for You"}
                    </h2>
                </div>

                {/* ================= CONTENT ================= */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Spinner />
                    </div>
                ) : usersToShow.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {usersToShow.map((u) => (
                            <UserCard
                                key={u._id}
                                user={u}
                                onView={() => navigate(`/user/${u._id}`)}
                                onToggleFollow={toggleFollow}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState query={debouncedSearch} />
                )}
            </div>
        </div>
    );
}

/* ================= USER CARD ================= */

function UserCard({ user, onView, onToggleFollow }) {
    const [loading, setLoading] = useState(false);

    const handleFollow = async (e) => {
        e.stopPropagation();
        setLoading(true);
        await onToggleFollow(user._id, user.isFollowing);
        setLoading(false);
    };

    return (
        <div
            onClick={onView}
            className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
        >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
                <img
                    src={resolveAvatar(user)}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-100 dark:ring-emerald-900"
                    alt=""
                />
            </div>

            {/* Info */}
            <div className="text-center mb-5">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {user.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {user.bio || "No bio available"}
                </p>

                <div className="flex justify-center gap-4 text-xs text-slate-500 mt-3">
                    <span>
                        <b>{user.followersCount || 0}</b> Followers
                    </span>
                    <span>•</span>
                    <span>
                        <b>{user.memoryCount || 0}</b> Memories
                    </span>
                </div>
            </div>

            {/* Follow */}
            <button
                onClick={handleFollow}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold flex justify-center gap-2 transition ${user.isFollowing
                    ? "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
            >
                {loading ? (
                    <Loader size={16} className="animate-spin" />
                ) : user.isFollowing ? (
                    <>
                        <UserMinus size={16} /> Following
                    </>
                ) : (
                    <>
                        <UserPlus size={16} /> Follow
                    </>
                )}
            </button>
        </div>
    );
}

/* ================= EMPTY ================= */

function EmptyState({ query }) {
    const hasQuery = !!query;

    return (
        <div className="flex flex-col items-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                {hasQuery ? (
                    <Search size={42} className="text-slate-400" />
                ) : (
                    <Users size={42} className="text-slate-400" />
                )}
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                {hasQuery ? "No users found" : "No suggestions yet"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                {hasQuery
                    ? `No users match “${query}”. Try searching something else.`
                    : "Follow more people and this space will get smarter."}
            </p>
        </div>
    );
}
