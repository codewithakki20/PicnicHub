import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    AppState,
} from 'react-native';

import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { getAvatarUrl } from '../../services/api';

const { width } = Dimensions.get('window');

/* ======================================================
   REEL PLAYER
====================================================== */

const SocialReelPlayer = ({ item, isActive, onLike }) => {
    const lastTap = useRef(0);

    const player = useVideoPlayer(item.videoUrl, (p) => {
        p.loop = true;
        p.muted = true;
    });

    // Play / pause based on visibility
    useEffect(() => {
        isActive ? player.play() : player.pause();
    }, [isActive, player]);

    // Pause when app goes background
    useEffect(() => {
        const sub = AppState.addEventListener('change', (state) => {
            if (state !== 'active') player.pause();
        });
        return () => sub.remove();
    }, [player]);

    // Double tap to like
    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            onLike?.();
        }
        lastTap.current = now;
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={handleTap}>
                <VideoView
                    player={player}
                    style={styles.media}
                    contentFit="cover"
                    nativeControls={false}
                />
            </TouchableWithoutFeedback>

            <View style={styles.reelBadge}>
                <Ionicons name="videocam" size={12} color="#fff" />
                <Text style={styles.reelBadgeText}>REEL</Text>
            </View>
        </>
    );
};

/* ======================================================
   MAIN POST CARD
====================================================== */

const SocialPostCards = ({
    item,
    type,
    isActive,
    onPress,
    onLike,
    onComment,
    onShare,
    onProfilePress,
    onFollow,
    onEdit,
    onDelete,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    /* ---------- USER NORMALIZATION ---------- */
    const rawUser = item.user || item.uploaderId || item.authorId;
    const user = typeof rawUser === 'object' && rawUser !== null ? rawUser : {};

    const avatar = getAvatarUrl(
        user.avatarUrl ||
        user.avatar ||
        user.profilePic ||
        user.photo
    );

    const username =
        user.username ||
        user.name ||
        user.fullName ||
        item.uploaderName ||
        'user';

    /* ---------- DATE ---------- */
    const date = new Date(item.createdAt);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

    /* ---------- OPTIMISTIC LIKE ---------- */
    const [liked, setLiked] = useState(!!item.isLiked);
    const [likes, setLikes] = useState(Number(item.likes) || 0);

    const handleLike = () => {
        setLiked((v) => !v);
        setLikes((c) => (liked ? c - 1 : c + 1));
        onLike?.();
    };

    const commentCount = item.comments?.length || 0;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 350 }}
            style={styles.container}
        >
            <TouchableOpacity activeOpacity={0.95} onPress={onPress}>

                {/* ================= HEADER ================= */}
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.userInfo}
                        onPress={onProfilePress}
                        activeOpacity={0.8}
                    >
                        <Image source={{ uri: avatar }} style={styles.avatar} />

                        <View>
                            <Text style={styles.username}>@{username}</Text>

                            {!!item.location && (
                                <View style={styles.locationRow}>
                                    <Ionicons name="location-sharp" size={10} color="#777" />
                                    <Text style={styles.locationText}>
                                        {typeof item.location === 'string'
                                            ? item.location
                                            : item.location?.address || item.location?.name}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dateText}>{day} {month}</Text>

                        {onFollow && (
                            <TouchableOpacity
                                style={[
                                    styles.miniFollowBtn,
                                    user.isFollowing && styles.miniFollowingBtn,
                                ]}
                                onPress={onFollow}
                            >
                                <Text
                                    style={[
                                        styles.miniFollowText,
                                        user.isFollowing && styles.miniFollowingText,
                                    ]}
                                >
                                    {user.isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {(onEdit || onDelete) && (
                            <TouchableOpacity
                                style={{ marginLeft: 10, padding: 4 }}
                                onPress={() => setMenuVisible(true)}
                            >
                                <Ionicons name="ellipsis-vertical" size={16} color="#555" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* ================= MENU ================= */}
                <Modal
                    transparent
                    visible={menuVisible}
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.menuContainer}>
                                {onEdit && (
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            setMenuVisible(false);
                                            onEdit(item);
                                        }}
                                    >
                                        <Ionicons name="create-outline" size={20} />
                                        <Text style={styles.menuText}>Edit</Text>
                                    </TouchableOpacity>
                                )}

                                {onDelete && (
                                    <>
                                        <View style={styles.menuDivider} />
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={() => {
                                                setMenuVisible(false);
                                                onDelete(item);
                                            }}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                                            <Text style={[styles.menuText, { color: '#d32f2f' }]}>
                                                Delete
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* ================= MEDIA ================= */}
                <View style={styles.mediaContainer}>
                    {type === 'reel' ? (
                        <SocialReelPlayer
                            item={item}
                            isActive={isActive}
                            onLike={handleLike}
                        />
                    ) : (
                        <>
                            <Image
                                source={{
                                    uri:
                                        item.coverImage ||
                                        item.thumbnailUrl ||
                                        item.media?.[0]?.url ||
                                        item.mediaUrl ||
                                        item.image ||
                                        'https://via.placeholder.com/500',
                                }}
                                style={styles.media}
                            />

                            {type === 'blog' && (
                                <View
                                    style={[
                                        styles.reelBadge,
                                        { backgroundColor: 'rgba(25,118,210,0.85)' },
                                    ]}
                                >
                                    <Ionicons name="document-text" size={12} color="#fff" />
                                    <Text style={styles.reelBadgeText}>BLOG</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* ================= FOOTER ================= */}
                <View style={styles.footer}>
                    {(item.title || item.caption || item.description) && (
                        <Text style={styles.caption} numberOfLines={3}>
                            <Text style={styles.captionUsername} onPress={onProfilePress}>
                                @{username}{' '}
                            </Text>
                            {item.title || item.caption || item.description}
                        </Text>
                    )}

                    <View style={styles.actionsRow}>
                        <View style={styles.leftActions}>
                            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                                <Ionicons
                                    name={liked ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color={liked ? '#ff3b30' : '#262626'}
                                />
                                {likes > 0 && (
                                    <Text style={styles.actionText}>{likes}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onComment}
                                style={styles.actionButton}
                            >
                                <Ionicons name="chatbubble-outline" size={22} />
                                {commentCount > 0 && (
                                    <Text style={styles.actionText}>{commentCount}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onShare}
                                style={styles.actionButton}
                            >
                                <Ionicons name="paper-plane-outline" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        </MotiView>
    );
};

export default SocialPostCards;

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        backgroundColor: '#eee',
    },
    username: { fontSize: 14, fontWeight: '600' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    locationText: { fontSize: 11, color: '#777', marginLeft: 3 },
    dateText: { fontSize: 12, color: '#999' },
    mediaContainer: { width, height: width, backgroundColor: '#eee' },
    media: { width: '100%', height: '100%' },
    reelBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    reelBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 4,
    },
    footer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 },
    caption: { fontSize: 14, lineHeight: 20 },
    captionUsername: { fontWeight: '600' },
    actionsRow: { marginTop: 10 },
    leftActions: { flexDirection: 'row', alignItems: 'center' },
    actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 18 },
    actionText: { marginLeft: 6, fontWeight: '600' },
    miniFollowBtn: {
        marginLeft: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#f2f2f2',
    },
    miniFollowingBtn: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    miniFollowText: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },
    miniFollowingText: { color: '#2E7D32' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#fff',
        width: '70%',
        borderRadius: 12,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuText: { fontSize: 16, marginLeft: 14 },
    menuDivider: { height: 1, backgroundColor: '#f0f0f0' },
});
