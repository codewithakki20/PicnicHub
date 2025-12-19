import { useState, useEffect } from "react";
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
    "https://ui-avatars.com/api/?name=User&background=random";

function useDebounce(value, delay = 400) {
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

    /* ================= LOAD SUGGESTED ================= */

    useEffect(() => {
        const loadSuggested = async () => {
            try {
                setLoading(true);
                const res = await userApi.getSuggestedUsers();
                setSuggestedUsers(res.users || []);
            } catch (e) {
                console.error("Failed to load suggestions", e);
            } finally {
                setLoading(false);
            }
        };

        loadSuggested();
    }, []);

    /* ================= SEARCH USERS ================= */

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setResults([]);
            return;
        }

        const searchUsers = async () => {
            try {
                setLoading(true);
                const res = await userApi.fetchAllUsers({ limit: 100 });

                const q = debouncedSearch.toLowerCase();
                const filtered = (res.users || []).filter(
                    (u) =>
                        u.name?.toLowerCase().includes(q) ||
                        u.username?.toLowerCase().includes(q) ||
                        u.bio?.toLowerCase().includes(q)
                );

                setResults(filtered);
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        };

        searchUsers();
    }, [debouncedSearch]);

    /* ================= FOLLOW TOGGLE ================= */

    const toggleFollow = async (userId, isFollowing) => {
        try {
            if (isFollowing) {
                await userApi.unfollowUser(userId);
            } else {
                await userApi.followUser(userId);
            }

            const update = (list) =>
                list.map((u) =>
                    u._id === userId ? { ...u, isFollowing: !isFollowing } : u
                );

            setSuggestedUsers(update);
            setResults(update);
        } catch (e) {
            alert("Failed to update follow status");
        }
    };

    const usersToShow = debouncedSearch.trim()
        ? results
        : suggestedUsers;

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                        Find People
                    </h1>
                    <p className="text-slate-600">
                        Discover and connect with amazing people
                    </p>
                </div>

                {/* SEARCH */}
                <div className="bg-white rounded-2xl p-4 shadow border mb-8">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, username, or bio…"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-emerald-200 outline-none"
                        />
                    </div>
                </div>

                {/* TITLE */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Users size={20} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {debouncedSearch
                            ? `Search Results (${usersToShow.length})`
                            : "Suggested for You"}
                    </h2>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner />
                    </div>
                ) : usersToShow.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="bg-white rounded-2xl p-6 border shadow hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
        >
            {/* AVATAR */}
            <div className="flex justify-center mb-4">
                <img
                    src={resolveAvatar(user)}
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                    alt=""
                />
            </div>

            {/* INFO */}
            <div className="text-center mb-4">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">
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

            {/* FOLLOW */}
            <button
                onClick={handleFollow}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl font-semibold flex justify-center gap-2 ${user.isFollowing
                        ? "bg-slate-200 hover:bg-slate-300"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
            >
                {loading ? (
                    <Loader size={16} className="animate-spin" />
                ) : user.isFollowing ? (
                    <>
                        <UserMinus size={16} /> Unfollow
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
        <div className="flex flex-col items-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                {hasQuery ? (
                    <Search size={40} className="text-slate-400" />
                ) : (
                    <Users size={40} className="text-slate-400" />
                )}
            </div>
            <h3 className="text-xl font-bold mb-2">
                {hasQuery ? "No users found" : "No suggestions available"}
            </h3>
            <p className="text-slate-600 max-w-md">
                {hasQuery
                    ? `No users match “${query}”. Try another name.`
                    : "Follow more people to get better suggestions."}
            </p>
        </div>
    );
}
