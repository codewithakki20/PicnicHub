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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, MotiImage } from "moti";

import { AuthContext } from "../../context/AuthContext";
import { getMe, getMemories, getReels, getAvatarUrl } from "../../services/api";

const { width } = Dimensions.get("window");
const GRID = width / 3;

const ProfileScreen = ({ navigation }) => {
    const { user: contextUser } = useContext(AuthContext);

    const [user, setUser] = useState(contextUser);
    const [memories, setMemories] = useState([]);
    const [reels, setReels] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [refreshing, setRefreshing] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    /* ---------------- Fetch ---------------- */

    const fetchProfile = async () => {
        try {
            const me = await getMe();
            const freshUser = me?.data || me;
            setUser(freshUser);

            const [memRes, reelRes] = await Promise.all([
                getMemories({ userId: freshUser._id }),
                getReels({ userId: freshUser._id }),
            ]);

            setMemories(memRes.memories || []);
            setReels(reelRes.reels || []);
        } catch (e) {
            console.log("Profile fetch error:", e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    /* ---------------- Grid ---------------- */

    const renderGridItem = useCallback(
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
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.username}>
                    @{user?.name?.replace(/\s+/g, "").toLowerCase()}
                </Text>

                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('FindPeople')}
                        style={styles.iconBtn}
                    >
                        <Ionicons name="person-add-outline" size={24} color="#111" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowCreate(!showCreate)}
                        style={styles.iconBtn}
                    >
                        <Ionicons
                            name={showCreate ? "close" : "add"}
                            size={26}
                            color="#111"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("ProfileSettings")}
                        style={styles.iconBtn}
                    >
                        <Ionicons name="settings-outline" size={24} color="#111" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Create Menu */}
            {showCreate && (
                <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={styles.createMenu}
                >
                    <CreateItem
                        label="New Reel"
                        icon="videocam-outline"
                        onPress={() => navigation.navigate("UploadReel")}
                    />
                    <CreateItem
                        label="New Story"
                        icon="book-outline"
                        onPress={() =>
                            navigation.navigate("UploadStory", { isStory: true })
                        }
                    />
                    <CreateItem
                        label="New Memory"
                        icon="image-outline"
                        onPress={() => navigation.navigate("UploadMemory")}
                    />
                </MotiView>
            )}

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <MotiImage
                    source={{
                        uri: getAvatarUrl(user?.avatarUrl || user?.avatar)
                    }}
                    style={styles.avatar}
                    from={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
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
                        <Stat
                            label="Followers"
                            value={user?.followers?.length || 0}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("FollowList", {
                                userId: user._id,
                                type: "following",
                            })
                        }
                    >
                        <Stat
                            label="Following"
                            value={user?.following?.length || 0}
                        />
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

            {/* Edit Profile Button */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("EditProfile")}
            >
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

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

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={activeTab === "posts" ? memories : reels}
                keyExtractor={item => item._id}
                numColumns={3}
                renderItem={renderGridItem}
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

export default ProfileScreen;

/* ---------------- Components ---------------- */

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

const CreateItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.createItem} onPress={onPress}>
        <Ionicons name={icon} size={20} color="#222" />
        <Text style={styles.createText}>{label}</Text>
    </TouchableOpacity>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    topBar: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    username: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111",
    },

    iconBtn: { marginLeft: 14 },

    createMenu: {
        marginHorizontal: 16,
        backgroundColor: "#fff",
        borderRadius: 14,
        elevation: 10,
        overflow: "hidden",
    },

    createItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },

    createText: {
        marginLeft: 12,
        fontWeight: "600",
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 10,
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

    bio: { paddingHorizontal: 20, marginTop: 12 },
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

    editButton: {
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: "#efefef",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    editButtonText: {
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
