import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import getPublicUrl from "../../utils/getPublicUrl";
import userApi from "../../api/userApi";
import { useEffect, useState, useRef } from "react";

/* ================= HELPERS ================= */

const resolveAvatar = (u) =>
    getPublicUrl(u?.avatarUrl || u?.avatar || u?.profilePicture) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u?.name || u?.username || "User"
    )}&background=random`;

/* ================= COMPONENT ================= */

export default function RightSidebar() {
    const { user } = useAuthContext();
    const [suggestions, setSuggestions] = useState([]);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        if (!user) return;

        userApi
            .getSuggestedUsers()
            .then((list) => {
                if (!mountedRef.current) return;
                setSuggestions(list.slice(0, 5));
            })
            .catch((err) => {
                console.error("Failed to load suggestions", err);
            });

        return () => {
            mountedRef.current = false;
        };
    }, [user?._id]);

    if (!user) return null;

    return (
        <aside className="hidden lg:block w-[320px] pl-8 py-8 space-y-6">

            {/* ================= USER ================= */}
            <div className="flex items-center justify-between">
                <Link
                    to={`/user/${user._id}`}
                    className="flex items-center gap-3 group"
                >
                    <img
                        src={resolveAvatar(user)}
                        alt={user.username}
                        className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:underline">
                            {user.username || user.name || "User"}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {user.name || "Picnic User"}
                        </span>
                    </div>
                </Link>

                {/* Future: account switcher */}
                <button className="text-xs font-bold text-blue-500 hover:text-blue-700">
                    Switch
                </button>
            </div>

            {/* ================= SUGGESTIONS ================= */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        Suggested for you
                    </span>
                    <Link
                        to="/user/find-people"
                        className="text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-slate-500"
                    >
                        See All
                    </Link>
                </div>

                <div className="space-y-4">
                    {suggestions.map((u) => (
                        <SuggestionRow key={u._id} user={u} />
                    ))}

                    {!suggestions.length && (
                        <p className="text-xs text-slate-400">
                            No suggestions right now
                        </p>
                    )}
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <footer className="pt-4 text-[11px] text-slate-300 dark:text-slate-600 space-y-4">
                <nav className="flex flex-wrap gap-x-2 gap-y-1">
                    <Link to="/about-us" className="hover:underline">About</Link>
                    <Link to="/help-support" className="hover:underline">Help</Link>
                    <Link to="/press" className="hover:underline">Press</Link>
                    <Link to="/api" className="hover:underline">API</Link>
                    <Link to="/jobs" className="hover:underline">Jobs</Link>
                    <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
                    <Link to="/terms-of-service" className="hover:underline">Terms</Link>
                </nav>
                <div>© 2025 PICNICHUB FROM ANTIGRAVITY</div>
            </footer>
        </aside>
    );
}

/* ================= SUGGESTION ROW ================= */

function SuggestionRow({ user }) {
    const [following, setFollowing] = useState(false);

    const handleFollow = async () => {
        try {
            setFollowing(true); // Optimistic
            await userApi.followUser(user._id);
        } catch (error) {
            console.error(error);
            setFollowing(false); // Revert
        }
    };

    return (
        <div className="flex items-center justify-between">
            <Link
                to={`/user/${user._id}`}
                className="flex items-center gap-3 group"
            >
                <img
                    src={resolveAvatar(user)}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:underline">
                        {user.username || user.name || "User"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                        New to PicnicHub
                    </span>
                </div>
            </Link>

            <button
                onClick={handleFollow}
                disabled={following}
                className={`text-xs font-bold transition ${following
                    ? "text-slate-400 cursor-default"
                    : "text-blue-500 hover:text-blue-700"
                    }`}
            >
                {following ? "Following" : "Follow"}
            </button>
        </div>
    );
}
