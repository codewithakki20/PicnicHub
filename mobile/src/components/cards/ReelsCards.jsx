import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Pressable,
    Image,
} from "react-native";
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const ReelsCards = ({
    item,
    currentUser,
    shouldPlay,
    muted,
    onLike,
    onFollow,
    onComment,
    onShare,
    onProfilePress,
    onDelete,
}) => {
    const videoRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const lastTap = useRef(0);

    // 🔐 Safe user normalization
    // Backend populates uploaderId, but legacy might use user
    const rawUser = item.uploaderId || item.user;
    const user = typeof rawUser === "object" && rawUser !== null ? rawUser : {};

    const avatar =
        user.avatarUrl ||
        user.avatar ||
        user.profilePic ||
        "https://via.placeholder.com/150";

    const username =
        user.username ||
        user.name ||
        item.uploaderName ||
        "user";

    // 🎬 Expo Video Player
    const player = useVideoPlayer(item.videoUrl, player => {
        player.loop = true;
        player.muted = muted;
        player.play(); // Start logic handled by effect below
    });

    // Sync muted state
    React.useEffect(() => {
        if (player) {
            player.muted = muted;
            player.volume = muted ? 0 : 1;
        }
    }, [muted, player]);

    // Sync play/pause with shouldPlay and local paused state
    React.useEffect(() => {
        if (shouldPlay && !paused) {
            player.play();
        } else {
            player.pause();
        }
    }, [shouldPlay, paused, player]);

    /* ❤️ Double-tap to like */
    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            onLike(item._id);
        } else {
            setPaused(p => !p);
        }
        lastTap.current = now;
    };

    return (
        <Pressable style={styles.reel} onPress={handleTap}>
            {/* 🎬 VIDEO */}
            <VideoView
                player={player}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                nativeControls={false}
            />

            {/* ⏸️ Pause Indicator */}
            {paused && (
                <View style={styles.pauseOverlay}>
                    <Ionicons name="pause" size={48} color="#fff" />
                </View>
            )}

            {/* 🌑 Gradients */}
            <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent']}
                style={styles.gradientTop}
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientBottom}
            />

            {/* 👉 RIGHT ACTIONS */}
            <View style={styles.actions}>
                {/* LIKE */}
                <View style={styles.actionItem}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onLike(item._id)}
                    >
                        <Ionicons
                            name={item.isLiked ? "heart" : "heart-outline"}
                            size={28}
                            color={item.isLiked ? "#ff3b30" : "#fff"}
                        />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>
                        {item.likesCount !== undefined ? item.likesCount : (item.likes || 0)}
                    </Text>
                </View>

                {/* COMMENT */}
                <View style={styles.actionItem}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={onComment}
                    >
                        <Ionicons
                            name="chatbubble-outline"
                            size={26}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>
                        {item.commentsCount !== undefined ? item.commentsCount : (item.comments?.length || 0)}
                    </Text>
                </View>

                {/* SHARE */}
                <View style={styles.actionItem}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={onShare}
                    >
                        <Ionicons
                            name="paper-plane-outline"
                            size={26}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>Share</Text>
                </View>
            </View>

            {/* 👇 BOTTOM INFO */}
            <View style={styles.bottomInfo}>
                <View style={styles.userRow}>
                    <TouchableOpacity
                        style={styles.userInfo}
                        onPress={onProfilePress}
                    >
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        <Text style={styles.username}>@{username}</Text>
                    </TouchableOpacity>

                    {user._id === currentUser?._id ? (
                        <TouchableOpacity
                            style={[styles.followBtn, { backgroundColor: '#ff3b30' }]}
                            onPress={() => onDelete(item)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.followBtn,
                                user.isFollowing && styles.followingBtn,
                            ]}
                            onPress={() => onFollow(user._id)}
                        >
                            <Text
                                style={[
                                    styles.followText,
                                    user.isFollowing && styles.followingText,
                                ]}
                            >
                                {user.isFollowing ? "Following" : "Follow"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {!!item.description && (
                    <Text numberOfLines={3} style={styles.caption}>
                        {item.description}
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

export default ReelsCards;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    reel: {
        width,
        height,
        backgroundColor: "#000",
    },

    pauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.15)",
    },

    gradientTop: {
        position: "absolute",
        top: 0,
        height: 120,
        width: "100%",
    },

    gradientBottom: {
        position: "absolute",
        bottom: 0,
        height: 300,
        width: "100%",
    },

    actions: {
        position: "absolute",
        right: 16,
        bottom: 140, // Lifted for padding
        alignItems: "center",
    },

    actionItem: {
        alignItems: "center",
        marginBottom: 22,
    },

    actionButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },

    actionText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        marginTop: 6,
    },

    bottomInfo: {
        position: "absolute",
        left: 16,
        bottom: 100, // Lifted to clear tabs
        width: width * 0.75,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginRight: 10,
        backgroundColor: "#fff",
    },

    username: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },

    followBtn: {
        borderWidth: 1,
        borderColor: "#2E7D32", // Green
        backgroundColor: "rgba(46, 125, 50, 0.25)",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },

    followingBtn: {
        backgroundColor: "#2E7D32",
        borderColor: "#2E7D32",
    },

    followText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },

    followingText: {
        color: "#eee",
    },

    caption: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
        marginTop: 4,
    },
});
