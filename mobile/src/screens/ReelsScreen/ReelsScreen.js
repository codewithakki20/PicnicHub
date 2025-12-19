import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Share,
    Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { getReels, likeReel, followUser, deleteReel } from "../../services/api";
import ReelsCards from "../../components/cards/ReelsCards";
import { AuthContext } from "../../context/AuthContext";

const { height } = Dimensions.get("window");

const ReelsScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [muted, setMuted] = useState(false);

    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            fetchReels();
        }, [])
    );

    const fetchReels = async () => {
        try {
            const res = await getReels();
            setReels(res?.reels || []);
        } catch (err) {
            console.log("Fetch reels error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchReels();
    }, []);

    /* ❤️ Optimistic like */
    const handleLike = async (id) => {
        setReels(prev =>
            prev.map(r =>
                r._id === id
                    ? {
                        ...r,
                        isLiked: !r.isLiked,
                        likes: r.isLiked
                            ? (r.likes || 1) - 1
                            : (r.likes || 0) + 1,
                        likesCount: r.isLiked
                            ? Math.max(0, (r.likesCount || 0) - 1)
                            : (r.likesCount || 0) + 1,
                    }
                    : r
            )
        );

        try {
            await likeReel(id);
        } catch (e) {
            console.log("Like error", e);
        }
    };

    /* ➕ Optimistic Follow */
    const handleFollow = async (userId) => {
        // Optimize: update ALL reels from this user
        setReels(prev =>
            prev.map(r => {
                const rUser = r.user || r.uploaderId || {};
                const rUserId = rUser._id || rUser;
                // Check if this reel belongs to the user being followed/unfollowed
                if (String(rUserId) === String(userId)) {
                    // Toggle isFollowing on the user object inside the reel
                    return {
                        ...r,
                        user: {
                            ...rUser,
                            isFollowing: !rUser.isFollowing
                        }
                    };
                }
                return r;
            })
        );

        try {
            await followUser(userId);
        } catch (error) {
            console.log("Follow error", error);
            // Revert on error could be implemented here by re-toggling
        }
    };

    /* 🎯 Viewability-based autoplay */
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 85,
    }).current;

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems?.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    /* 📤 Share */
    const handleShare = async (item) => {
        try {
            const user = item.uploaderId?.username || item.user?.username || 'PicnicHub';
            await Share.share({
                message: `Check out this reel by @${user} on PicnicHub! 🌿`,
                title: 'Share Reel'
            });
        } catch (e) {
            console.log("Share error", e);
        }
    };

    /* 🗑️ Delete */
    const handleDelete = (item) => {
        Alert.alert(
            "Delete Reel",
            "Are you sure you want to delete this reel?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setReels(prev => prev.filter(r => r._id !== item._id));
                            await deleteReel(item._id);
                        } catch (error) {
                            Alert.alert("Error", "Could not delete reel");
                            fetchReels();
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, index }) => (
        <ReelsCards
            currentUser={user}
            item={item}
            shouldPlay={index === activeIndex}
            muted={muted}
            onLike={handleLike}
            onFollow={handleFollow}
            onComment={() =>
                navigation.navigate("Comments", { data: item, type: 'reel' })
            }
            onShare={() => handleShare(item)}
            onDelete={handleDelete}
            onProfilePress={() => {
                const userId =
                    item.user?._id || item.uploaderId?._id;
                if (userId)
                    navigation.navigate("UserProfile", { userId });
            }}
        />
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <FlatList
                data={reels}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                extraData={{ activeIndex, muted }}
                pagingEnabled
                snapToInterval={height}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                    />
                }
                windowSize={5}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                removeClippedSubviews
            />

            {/* HEADER */}
            <View style={[styles.header, { top: insets.top + 8 }]}>
                <Text style={styles.headerTitle}>Reels</Text>

                <View style={{ flexDirection: "row", gap: 16 }}>
                    <TouchableOpacity onPress={() => setMuted(m => !m)}>
                        <Ionicons
                            name={muted ? "volume-mute" : "volume-high"}
                            size={26}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("UploadReel")}
                    >
                        <Ionicons
                            name="camera-outline"
                            size={30}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ReelsScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },

    header: {
        position: "absolute",
        width: "100%",
        zIndex: 100,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        textShadowColor: "rgba(0,0,0,0.6)",
        textShadowRadius: 12,
    },
});
