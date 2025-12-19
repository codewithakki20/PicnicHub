import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Search,
    X,
    ChevronLeft
} from "lucide-react";
import userApi from "../../api/userApi";
import getPublicUrl from "../../utils/getPublicUrl";
import Spinner from "../../components/ui/Spinner";

export default function FollowList() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentUser = useSelector((s) => s.auth.user);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") || "followers"
    );
    const [searchQuery, setSearchQuery] = useState("");

    // Data
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [profileUser, setProfileUser] = useState(null);

    /* ================= LOAD USER INFO ================= */
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (currentUser && currentUser._id === id) {
                    setProfileUser(currentUser);
                } else {
                    const res = await userApi.fetchUser(id);
                    setProfileUser(res.user);
                }
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        };
        if (id) loadUser();
    }, [id, currentUser]);

    /* ================= LOAD FOLLOWERS/FOLLOWING ================= */
    useEffect(() => {
        const loadList = async () => {
            try {
                setLoading(true);
                // Load both to have them ready or just load current tab for efficiency?
                // Let's load the active tab's data.
                if (activeTab === "followers") {
                    const res = await userApi.getFollowers(id);
                    setFollowers(Array.isArray(res) ? res : (res.followers || []));
                } else {
                    const res = await userApi.getFollowing(id);
                    setFollowing(Array.isArray(res) ? res : (res.following || []));
                }
            } catch (error) {
                console.error("Failed to load list:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadList();
    }, [id, activeTab]);

    /* ================= SYNC TAB WITH URL ================= */
    useEffect(() => {
        setSearchParams({ tab: activeTab });
        setSearchQuery(""); // Clear search on tab switch
    }, [activeTab, setSearchParams]);

    /* ================= FOLLOW/UNFOLLOW LOGIC ================= */
    const handleFollowToggle = async (targetId, isFollowing) => {
        try {
            if (isFollowing) {
                await userApi.unfollowUser(targetId);
                // Update local state
                updateUserInLists(targetId, { isFollowing: false });
            } else {
                await userApi.followUser(targetId);
                updateUserInLists(targetId, { isFollowing: true });
            }
        } catch (error) {
            alert("Action failed. Please try again.");
        }
    };

    const handleRemoveFollower = async (targetId) => {
        if (!window.confirm("Remove this follower?")) return;
        // In a real app, you'd have an API to remove a follower.
        // For now, let's assume we just want to visually remove them or 
        // maybe the API doesn't support 'remove follower', only 'block' or 'unfollow'.
        // If the API supports it: await userApi.removeFollower(targetId);

        // Since we don't have removeFollower in the viewed api file, we'll skip the API call 
        // or just pretend for UI demo if strictly requested. 
        // However, I will implement standard "Unfollow" logic for the "Following" tab, 
        // and hide the action for "Followers" tab unless it's the current user viewing their own followers (where they might want to remove).
        // For safety, I will disable the 'Remove' button action since API is missing.
        alert("Remove follower feature coming soon.");
    };

    const updateUserInLists = (uid, updates) => {
        setFollowers(prev => prev.map(u => u._id === uid || u.id === uid ? { ...u, ...updates } : u));
        setFollowing(prev => prev.map(u => u._id === uid || u.id === uid ? { ...u, ...updates } : u));
    };

    /* ================= FILTER ================= */
    const listData = activeTab === "followers" ? followers : following;
    const filtered = listData.filter(u =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isOwnProfile = currentUser?._id === id;

    return (
        <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 px-4 flex justify-center items-start">

            <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">

                {/* HEADER */}
                <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4">
                    <div className="w-8">
                        <button onClick={() => navigate(-1)} className="text-slate-800">
                            <ChevronLeft size={24} />
                        </button>
                    </div>
                    <span className="font-semibold text-base text-slate-800">{profileUser?.username || profileUser?.name || "User"}</span>
                    <div className="w-8"></div>
                </div>

                {/* TABS */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("followers")}
                        className={`flex-1 py-3 text-sm font-semibold text-center border-b-[1px] transition-colors
                            ${activeTab === "followers" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        {followers.length || profileUser?.followersCount || 0} Followers
                    </button>
                    <button
                        onClick={() => setActiveTab("following")}
                        className={`flex-1 py-3 text-sm font-semibold text-center border-b-[1px] transition-colors
                            ${activeTab === "following" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        {following.length || profileUser?.followingCount || 0} Following
                    </button>
                </div>

                {/* SEARCH */}
                <div className="p-3 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            className="w-full bg-[#EFEFEF] rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none text-slate-900 placeholder-slate-500"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} fill="currentColor" />
                            </button>
                        )}
                    </div>
                </div>

                {/* LIST */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Spinner />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                            <div className="w-16 h-16 border-2 border-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-800">
                                <Search size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-light text-slate-900">
                                {searchQuery ? "No results found." : (activeTab === "followers" ? "No followers yet." : "Not following anyone.")}
                            </h3>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filtered.map(user => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    isOwnProfile={isOwnProfile}
                                    activeTab={activeTab}
                                    onToggleFollow={handleFollowToggle}
                                    onRemove={handleRemoveFollower}
                                    currentUserId={currentUser?._id}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const UserRow = ({ user, isOwnProfile, activeTab, onToggleFollow, onRemove, currentUserId }) => {
    // If we are viewing "Following" list, we usually see "Following" button (to object).
    // If we are viewing "Followers" list of OURSELVES, we see "Remove".
    // If we are viewing "Followers" list of OTHERS, we see "Follow" button (to object).

    const isMe = currentUserId === user._id; // The user in the row is ME
    const showRemove = isOwnProfile && activeTab === "followers"; // Viewing my own followers -> Show Remove

    // For the button logic:
    // If I'm viewing my following list -> I see "Following" button for everyone (toggle to unfollow).
    // If I'm viewing someone else's list -> I see "Follow/Following" depending on MY relationship to that user.

    // Simplified: Always show Follow/Following button unless it's 'Remove' case specific to Instagram.
    // BUT userApi usually returns `isFollowing` relative to the authenticated user.

    return (
        <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">

            <Link to={`/user/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <img
                    src={getPublicUrl(user.avatarUrl || user.avatar) || "/default-avatar.png"}
                    alt={user.username}
                    className="w-11 h-11 rounded-full object-cover border border-slate-100"
                />
                <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-slate-900 truncate">
                        {user.username || user.name}
                    </span>
                    <span className="text-sm text-slate-500 truncate">
                        {user.name}
                    </span>
                </div>
            </Link>

            <div className="ml-4">
                {isMe ? null : (
                    showRemove ? (
                        <button
                            onClick={() => onRemove(user._id)}
                            className="bg-[#EFEFEF] hover:bg-[#DBDBDB] text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                        >
                            Remove
                        </button>
                    ) : (
                        <FollowButton
                            isFollowing={user.isFollowing}
                            onClick={() => onToggleFollow(user._id, user.isFollowing)}
                        />
                    )
                )}
            </div>
        </div>
    );
};

const FollowButton = ({ isFollowing, onClick }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };

    if (isFollowing) {
        return (
            <button
                onClick={handleClick}
                disabled={loading}
                className="bg-[#EFEFEF] hover:bg-[#DBDBDB] text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
                Following
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="bg-[#0095F6] hover:bg-[#1877F2] text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
            Follow
        </button>
    );
};
