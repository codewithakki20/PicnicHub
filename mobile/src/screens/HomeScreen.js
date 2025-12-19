import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
    useCallback,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    TouchableWithoutFeedback,
    Keyboard,
    Share,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "../context/AuthContext";
import {
    getMemories,
    getReels,
    getStories,
    likeMemory,
    likeReel,
    getAvatarUrl,
    followUser,
} from "../services/api";

import SocialPost from "../components/cards/SocialPostCards";
import StoryCircle from "../components/cards/StoryCircleCards";
import SuggestedUsers from "../components/SuggestedUsers";

const { width } = Dimensions.get("window");

/* ---------------- Skeleton ---------------- */

const SkeletonCard = () => (
    <View style={styles.skeleton}>
        <MotiView
            from={{ translateX: -220 }}
            animate={{ translateX: 220 }}
            transition={{ loop: true, duration: 900 }}
            style={StyleSheet.absoluteFill}
        >
            <LinearGradient
                colors={[
                    "transparent",
                    "rgba(255,255,255,0.6)",
                    "transparent",
                ]}
                style={{ width: "100%", height: "100%" }}
            />
        </MotiView>
    </View>
);

/* ---------------- Screen ---------------- */

const HomeScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);

    const [memories, setMemories] = useState([]);
    const [reels, setReels] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeReelKey, setActiveReelKey] = useState(null);

    /* ---------------- Fetch ---------------- */

    const fetchHome = async () => {
        try {
            const [memRes, reelRes, storyRes] = await Promise.all([
                getMemories(),
                getReels(),
                getStories(),
            ]);

            setMemories(
                (memRes?.memories || []).map(m => ({
                    ...m,
                    likes: m.likes?.length || 0,
                }))
            );

            setReels(
                (reelRes?.reels || []).map(r => ({
                    ...r,
                    likes: r.likes?.length || 0,
                }))
            );

            setStories(storyRes?.data || []);
        } catch (e) {
            console.log("Home fetch error", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHome();
        }, [])
    );

    /* ---------------- Stories ---------------- */

    const renderStories = () => {
        // Find if I have a story in the fetched list
        const myUploadedStory = stories.find(s => s?.user?._id === user?._id);

        const myStory = {
            _id: "me",
            isMyStory: true,
            avatar: getAvatarUrl(user?.avatarUrl || user?.avatar),
            hasStory: !!myUploadedStory, // true if found
            stories: myUploadedStory?.stories || [], // Check stories from backend
        };

        const others = stories
            .filter(s => s?.user?._id !== user?._id)
            .map(s => ({
                _id: s.user._id,
                name: s.user.name,
                avatar: getAvatarUrl(s.user.avatarUrl),
                isSeen: !s.hasUnseen,
                stories: s.stories,
            }));

        return (
            <View style={styles.storiesWrapper}>
                <Text style={styles.sectionTitle}>Stories</Text>

                <FlatList
                    horizontal
                    data={[myStory, ...others]}
                    keyExtractor={i => i._id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                    renderItem={({ item }) => (
                        <StoryCircle
                            user={item}
                            isMyStory={item.isMyStory}
                            isSeen={item.isSeen}
                            onPress={() => {
                                if (item.isMyStory) {
                                    if (item.hasStory) {
                                        navigation.navigate("StoryView", {
                                            stories: item.stories,
                                            user: item, // Pass self as user
                                        });
                                    } else {
                                        navigation.navigate("UploadMemory", {
                                            isStory: true,
                                        });
                                    }
                                } else {
                                    navigation.navigate("StoryView", {
                                        stories: item.stories,
                                        user: item,
                                    });
                                }
                            }}
                        />
                    )}
                />
            </View>
        );
    };

    /* ---------------- Feed ---------------- */

    const feed = useMemo(() => {
        return [...memories, ...reels]
            .map(i => ({
                key: i._id,
                type: i.videoUrl ? "reel" : "memory",
                data: i,
                date: new Date(i.createdAt),
            }))
            .sort((a, b) => b.date - a.date);
    }, [memories, reels]);

    /* ---------------- Viewability ---------------- */

    const viewConfig = useRef({
        itemVisiblePercentThreshold: 70,
    }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        const active = viewableItems.find(v => v.item.type === "reel");
        setActiveReelKey(active?.item.key || null);
    }).current;

    /* ---------------- Like ---------------- */

    const toggleLike = async (item, type) => {
        const update = list =>
            list.map(i =>
                i._id === item._id
                    ? {
                        ...i,
                        isLiked: !i.isLiked,
                        likes: i.isLiked ? i.likes - 1 : i.likes + 1,
                    }
                    : i
            );

        type === "reel"
            ? setReels(p => update(p))
            : setMemories(p => update(p));

        type === "reel"
            ? await likeReel(item._id)
            : await likeMemory(item._id);
    };

    const handleFollow = async (userId) => {
        const updateList = (list) => list.map(item => {
            const itemUser = item.user || item.uploaderId || {};
            const itemUserId = itemUser._id || itemUser;
            if (String(itemUserId) === String(userId)) {
                return {
                    ...item,
                    user: { ...itemUser, isFollowing: !itemUser.isFollowing },
                    uploaderId: { ...itemUser, isFollowing: !itemUser.isFollowing } // varied structure support
                };
            }
            return item;
        });

        setMemories(prev => updateList(prev));
        setReels(prev => updateList(prev));

        try {
            await followUser(userId);
        } catch (error) {
            console.log("Follow user error", error);
        }
    };

    /* ---------------- Render ---------------- */

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <SkeletonCard />
                <SkeletonCard />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList
                    data={feed}
                    keyExtractor={i => i.key}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                fetchHome();
                            }}
                            tintColor="#1B5E20"
                        />
                    }
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ListHeaderComponent={
                        <>
                            {/* HEADER */}
                            <View style={styles.header}>
                                <View style={styles.headerLeft}>
                                    <Image
                                        source={require("../../assets/logo1.png")}
                                        style={{ width: 30, height: 30 }}
                                    />
                                    <Text style={styles.logo}>PicnicHub</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("Notifications")
                                    }
                                >
                                    <Ionicons
                                        name="notifications-outline"
                                        size={24}
                                        color="#1B5E20"
                                    />
                                    <View style={styles.badge} />
                                </TouchableOpacity>
                            </View>

                            {renderStories()}

                            <SuggestedUsers
                                onUserPress={(id) => navigation.navigate("UserProfile", { userId: id })}
                            />

                            <View style={styles.feedDivider} />
                        </>
                    }
                    renderItem={({ item }) => (
                        <SocialPost
                            item={item.data}
                            type={item.type}
                            isActive={
                                item.type === "reel" &&
                                activeReelKey === item.key
                            }
                            onLike={() =>
                                toggleLike(item.data, item.type)
                            }
                            onComment={() =>
                                navigation.navigate("Comments", {
                                    data: item.data,
                                    type: item.type,
                                })
                            }
                            onShare={() =>
                                Share.share({
                                    message:
                                        "Check this out on PicnicHub 🌿",
                                })
                            }
                            onPress={() =>
                                navigation.navigate(
                                    item.type === "reel"
                                        ? "ReelViewer"
                                        : "MemoryDetails",
                                    { data: item.data }
                                )
                            }
                            onProfilePress={() => {
                                const id =
                                    item.data.user?._id ||
                                    item.data.uploaderId?._id;
                                if (id)
                                    navigation.navigate("UserProfile", {
                                        userId: id,
                                    });
                            }}
                            onFollow={() => {
                                const id = item.data.user?._id || item.data.uploaderId?._id;
                                if (id) handleFollow(id);
                            }}
                        />
                    )}
                />
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default HomeScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },

    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    logo: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1B5E20",
        marginLeft: 8,
    },

    badge: {
        position: "absolute",
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF3B30",
    },

    storiesWrapper: {
        backgroundColor: "#fff",
        paddingVertical: 12,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#333",
        marginLeft: 16,
        marginBottom: 8,
    },

    feedDivider: {
        height: 10,
        backgroundColor: "#f2f2f2",
    },

    skeleton: {
        height: 280,
        margin: 16,
        borderRadius: 14,
        backgroundColor: "#eaeaea",
        overflow: "hidden",
    },
});
