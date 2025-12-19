import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { getAvatarUrl } from '../../services/api';

const { width } = Dimensions.get('window');

const SocialReelPlayer = ({ item, isActive }) => {
    const player = useVideoPlayer(item.videoUrl, player => {
        player.loop = true;
        player.muted = true;
    });

    React.useEffect(() => {
        if (isActive) {
            player.play();
        } else {
            player.pause();
        }
    }, [isActive, player]);

    return (
        <>
            <VideoView
                player={player}
                style={styles.media}
                contentFit="cover"
                nativeControls={false}
            />
            <View style={styles.reelBadge}>
                <Ionicons name="videocam" size={12} color="#fff" />
                <Text style={styles.reelBadgeText}>REEL</Text>
            </View>
        </>
    );
};

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
}) => {

    // 🔒 SAFE USER NORMALIZATION (MOST IMPORTANT)
    const rawUser = item.user || item.uploaderId;

    const user =
        typeof rawUser === 'object' && rawUser !== null
            ? rawUser
            : {};

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

    const date = new Date(item.createdAt);
    const day = date.getDate();
    const month = date
        .toLocaleString('default', { month: 'short' })
        .toUpperCase();

    const isLiked = !!item.isLiked;
    const likeCount = Number(item.likes) || 0;
    const commentCount = item.comments?.length || 0;

    return (
        <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 350 }}
            style={styles.container}
        >
            <TouchableOpacity activeOpacity={0.95} onPress={onPress}>

                {/* HEADER */}
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
                                    <Ionicons
                                        name="location-sharp"
                                        size={10}
                                        color="#777"
                                    />
                                    <Text style={styles.locationText}>
                                        {item.location?.address || item.location?.name}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.dateText}>
                            {day} {month}
                        </Text>
                        {onFollow && (
                            <TouchableOpacity
                                style={[
                                    styles.miniFollowBtn,
                                    user.isFollowing && styles.miniFollowingBtn
                                ]}
                                onPress={onFollow}
                            >
                                <Text style={[
                                    styles.miniFollowText,
                                    user.isFollowing && styles.miniFollowingText
                                ]}>
                                    {user.isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* MEDIA */}
                <View style={styles.mediaContainer}>
                    {type === 'reel' ? (
                        <SocialReelPlayer item={item} isActive={isActive} />
                    ) : (
                        <Image
                            source={{
                                uri:
                                    item.thumbnailUrl ||
                                    item.media?.[0]?.url ||
                                    item.mediaUrl ||
                                    item.image ||
                                    'https://via.placeholder.com/500',
                            }}
                            style={styles.media}
                        />
                    )}
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    {(item.title || item.caption || item.description) && (
                        <Text style={styles.caption} numberOfLines={2}>
                            <Text style={styles.captionUsername}>@{username} </Text>
                            {item.title || item.caption || item.description}
                        </Text>
                    )}

                    <View style={styles.actionsRow}>
                        <View style={styles.leftActions}>
                            <TouchableOpacity onPress={onLike} style={styles.actionButton}>
                                <Ionicons
                                    name={isLiked ? 'heart' : 'heart-outline'}
                                    size={24}
                                    color={isLiked ? '#ff3b30' : '#262626'}
                                />
                                {likeCount > 0 && (
                                    <Text style={styles.actionText}>{likeCount}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onComment}
                                style={styles.actionButton}
                            >
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={22}
                                    color="#262626"
                                />
                                {commentCount > 0 && (
                                    <Text style={styles.actionText}>{commentCount}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onShare}
                                style={styles.actionButton}
                            >
                                <Ionicons
                                    name="paper-plane-outline"
                                    size={22}
                                    color="#262626"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        </MotiView>
    );
};

export default SocialPostCards;

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
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        backgroundColor: '#eee',
    },

    username: {
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },

    locationText: {
        fontSize: 11,
        color: '#777',
        marginLeft: 3,
    },

    dateText: {
        fontSize: 12,
        color: '#999',
    },

    mediaContainer: {
        width,
        height: width,
        backgroundColor: '#eee',
    },

    media: {
        width: '100%',
        height: '100%',
    },

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

    footer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
    },

    caption: {
        fontSize: 14,
        color: '#262626',
        lineHeight: 20,
    },

    captionUsername: {
        fontWeight: '600',
    },

    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },

    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 18,
    },

    actionText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#262626',
    },
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
        paddingVertical: 3, // Adjust for border
    },
    miniFollowText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2E7D32',
    },
    miniFollowingText: {
        color: '#2E7D32',
    }
});
