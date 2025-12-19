import React, {
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, MotiImage } from "moti";

import { AuthContext } from "../../context/AuthContext";
import {
    getUser,
    getMemories,
    getReels,
    followUser,
    getAvatarUrl,
} from "../../services/api";

const { width } = Dimensions.get("window");
const GRID = width / 3;

const OtherUserProfileScreen = ({ navigation, route }) => {
    const { userId, user: paramUser } = route.params || {};
    const { user: myUser } = useContext(AuthContext);

    const [user, setUser] = useState(paramUser || null);
    const [memories, setMemories] = useState([]);
    const [reels, setReels] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(!paramUser);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    /* ---------------- Fetch ---------------- */

    const fetchProfile = async () => {
        try {
            const [userRes, memRes, reelRes] = await Promise.all([
                getUser(userId),
                getMemories({ userId }),
                getReels({ userId }),
            ]);

            const fetchedUser = userRes.data || userRes;
            setUser(fetchedUser);

            const following =
                myUser?.following?.some(
                    f => (typeof f === "string" ? f : f._id) === userId
                ) ||
                fetchedUser?.followers?.some(
                    f => (typeof f === "string" ? f : f._id) === myUser?._id
                );

            setIsFollowing(!!following);
            setMemories(memRes.memories || []);
            setReels(reelRes.reels || []);
        } catch (e) {
            console.log("Profile fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    /* ---------------- Follow ---------------- */

    const handleFollow = async () => {
        if (followLoading || !myUser) return;
        try {
            setFollowLoading(true);
            const res = await followUser(userId);

            setIsFollowing(res.isFollowing);

            setUser(prev => ({
                ...prev,
                followers: res.isFollowing
                    ? [...(prev.followers || []), myUser?._id]
                    : (prev.followers || []).filter(
                        f =>
                            (typeof f === "string" ? f : f._id) !== myUser?._id
                    ),
            }));
        } catch (e) {
            console.log("Follow error:", e);
        } finally {
            setFollowLoading(false);
        }
    };

    /* ---------------- Grid ---------------- */

    const renderItem = useCallback(
        ({ item }) => {
            const isReel = activeTab === "reels";
            const uri = isReel
                ? item.coverImage
                : item.thumbnailUrl || item.media?.[0]?.url;

            return (
                <TouchableOpacity
                    style={styles.gridItem}
                    activeOpacity={0.85}
                    onPress={() =>
                        navigation.navigate(isReel ? "ReelViewer" : "MemoryDetails", {
                            data: item,
                        })
                    }
                >
                    <Image
                        source={{ uri: uri || "https://via.placeholder.com/150" }}
                        style={styles.gridImage}
                    />
                    {isReel && (
                        <View style={styles.reelBadge}>
                            <Ionicons name="play" size={16} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
            );
        },
        [activeTab]
    );

    /* ---------------- Header ---------------- */

    const Header = () => (
        <>
            {/* Top bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>

                <Text style={styles.username}>
                    @{user?.name?.replace(/\s+/g, "").toLowerCase()}
                </Text>

                <View style={{ width: 24 }} />
            </View>

            {/* Profile card */}
            <View style={styles.profileCard}>
                <MotiImage
                    from={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    source={{
                        uri: getAvatarUrl(user?.avatarUrl || user?.avatar)
                    }}
                    style={styles.avatar}
                />

                <View style={styles.stats}>
                    <Stat label="Memories" value={memories.length} />
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("FollowList", {
                                userId: user._id,
                                type: "followers",
                            })
                        }
                    >
                        <Stat label="Followers" value={user?.followers?.length || 0} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("FollowList", {
                                userId: user._id,
                                type: "following",
                            })
                        }
                    >
                        <Stat label="Following" value={user?.following?.length || 0} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bio */}
            <View style={styles.bio}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.bioText}>
                    {user?.bio || "No bio yet ✨"}
                </Text>

                {/* Education Info */}
                {(user?.college || user?.branch || user?.course || user?.year) && (
                    <View style={styles.eduBadges}>
                        {user?.college && (
                            <View style={[styles.badge, styles.badgeGreen]}>
                                <Ionicons name="business-outline" size={12} color="#2E7D32" />
                                <Text style={styles.badgeTextGreen}>{user.college}</Text>
                            </View>
                        )}
                        {user?.branch && (
                            <View style={[styles.badge, styles.badgeBlue]}>
                                <Ionicons name="school-outline" size={12} color="#1976D2" />
                                <Text style={styles.badgeTextBlue}>{user.branch}</Text>
                            </View>
                        )}
                        {user?.course && (
                            <View style={[styles.badge, styles.badgePurple]}>
                                <Ionicons name="book-outline" size={12} color="#7B1FA2" />
                                <Text style={styles.badgeTextPurple}>{user.course}</Text>
                            </View>
                        )}
                        {user?.year && (
                            <View style={[styles.badge, styles.badgeOrange]}>
                                <Ionicons name="calendar-outline" size={12} color="#F57C00" />
                                <Text style={styles.badgeTextOrange}>{user.year}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[
                        styles.followBtn,
                        isFollowing && styles.followingBtn,
                    ]}
                    onPress={handleFollow}
                    disabled={followLoading}
                >
                    {followLoading ? (
                        <ActivityIndicator
                            color={isFollowing ? "#111" : "#fff"}
                            size="small"
                        />
                    ) : (
                        <Text
                            style={[
                                styles.followText,
                                isFollowing && styles.followingText,
                            ]}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.messageBtn}>
                    <Text style={styles.messageText}>coming soon</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <Tab
                    active={activeTab === "posts"}
                    icon="grid-outline"
                    onPress={() => setActiveTab("posts")}
                />
                <Tab
                    active={activeTab === "reels"}
                    icon="videocam-outline"
                    onPress={() => setActiveTab("reels")}
                />
            </View>
        </>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#111" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={activeTab === "posts" ? memories : reels}
                keyExtractor={item => item._id}
                numColumns={3}
                renderItem={renderItem}
                ListHeaderComponent={Header}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        {activeTab === "posts"
                            ? "No memories yet"
                            : "No reels yet"}
                    </Text>
                }
            />
        </SafeAreaView>
    );
};

export default OtherUserProfileScreen;

/* ---------------- UI Bits ---------------- */

const Stat = ({ label, value }) => (
    <View style={styles.stat}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const Tab = ({ active, icon, onPress }) => (
    <TouchableOpacity
        style={[styles.tab, active && styles.tabActive]}
        onPress={onPress}
    >
        <Ionicons
            name={icon}
            size={24}
            color={active ? "#111" : "#aaa"}
        />
    </TouchableOpacity>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    center: { justifyContent: "center", alignItems: "center" },

    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        alignItems: "center",
    },

    username: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 8,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#eee",
    },

    stats: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
    },

    stat: { alignItems: "center" },
    statValue: { fontSize: 18, fontWeight: "800" },
    statLabel: { fontSize: 12, color: "#777" },

    bio: { paddingHorizontal: 20, marginTop: 14 },
    name: { fontSize: 16, fontWeight: "700" },
    bioText: { marginTop: 4, color: "#444" },

    eduBadges: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },

    badgeGreen: { backgroundColor: "#E8F5E9" },
    badgeBlue: { backgroundColor: "#E3F2FD" },
    badgePurple: { backgroundColor: "#F3E5F5" },
    badgeOrange: { backgroundColor: "#FFF3E0" },

    badgeTextGreen: { fontSize: 11, fontWeight: "600", color: "#2E7D32" },
    badgeTextBlue: { fontSize: 11, fontWeight: "600", color: "#1976D2" },
    badgeTextPurple: { fontSize: 11, fontWeight: "600", color: "#7B1FA2" },
    badgeTextOrange: { fontSize: 11, fontWeight: "600", color: "#F57C00" },

    actions: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 20,
        marginTop: 16,
    },

    followBtn: {
        flex: 1,
        backgroundColor: "#2E7D32",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    followingBtn: {
        backgroundColor: "#efefef",
    },

    followText: {
        color: "#fff",
        fontWeight: "700",
    },

    followingText: {
        color: "#111",
    },

    messageBtn: {
        flex: 1,
        backgroundColor: "#efefef",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    messageText: {
        fontWeight: "700",
        color: "#111",
    },

    tabs: {
        flexDirection: "row",
        marginTop: 24,
        borderTopWidth: 1,
        borderColor: "#eee",
    },

    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
    },

    tabActive: {
        borderBottomWidth: 2,
        borderColor: "#111",
    },

    gridItem: {
        width: GRID,
        height: GRID,
        padding: 1,
    },

    gridImage: {
        width: "100%",
        height: "100%",
    },

    reelBadge: {
        position: "absolute",
        top: 6,
        right: 6,
    },

    empty: {
        textAlign: "center",
        marginTop: 30,
        color: "#888",
    },
});
