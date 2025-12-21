import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Pressable,
    Image,
    Modal,
    TouchableWithoutFeedback,
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
    onEdit,
}) => {
    const videoRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
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

            {/* 📍 LOCATION & MENU */}
            {(item.location || onEdit || onDelete) && (
                <View style={[styles.topRightInfo, { flexDirection: 'column', alignItems: 'flex-end', gap: 10 }]}>
                    {/* Location Badge */}
                    {!!item.location && (
                        <View style={styles.locationBadge}>
                            <Ionicons name="location-sharp" size={12} color="#fff" />
                            <Text style={styles.locationText}>
                                {typeof item.location === 'string'
                                    ? item.location
                                    : (item.location.name || item.location.address)}
                            </Text>
                        </View>
                    )}

                    {/* Menu Button */}
                    {(onEdit || onDelete) && (
                        <TouchableOpacity
                            style={styles.menuBtn}
                            onPress={() => setMenuVisible(true)}
                        >
                            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

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
                        <View style={{ width: 10 }} /> // Spacer if owner, menu is top right
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

            <Modal
                transparent={true}
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.menuContainer}>
                            {onEdit && (
                                <>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            onEdit(item);
                                        }}
                                    >
                                        <Ionicons name="create-outline" size={20} color="#333" />
                                        <Text style={styles.menuText}>Edit</Text>
                                    </TouchableOpacity>
                                    <View style={styles.menuDivider} />
                                </>
                            )}
                            {onDelete && (
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setMenuVisible(false);
                                        onDelete(item);
                                    }}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                                    <Text style={[styles.menuText, { color: '#d32f2f' }]}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </Pressable >
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

    topRightInfo: {
        position: 'absolute',
        top: 100, // Below header
        right: 16,
        alignItems: 'flex-end',
    },

    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    locationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },

    menuBtn: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#fff',
        width: '70%',
        borderRadius: 12,
        paddingVertical: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 14,
        color: '#333',
        fontWeight: '500',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 0,
    },
});
