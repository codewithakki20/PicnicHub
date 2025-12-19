import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

const MemoriesCards = ({
    item,
    index = 0,
    isLiked = false,
    onPress,
    onLike,
    onComment,
    onShare,
    onDelete,
    isOwner = false,
}) => {
    const date = new Date(item.createdAt);
    const day = date.getDate();
    const month = date
        .toLocaleString('default', { month: 'short' })
        .toUpperCase();

    const title =
        item.title || item.description || item.caption || 'A memory';

    const username =
        item.uploaderId?.username ||
        item.uploaderId?.name ||
        item.user?.username ||
        item.user?.name ||
        item.uploaderName ||
        'someone';

    const location =
        item.location?.address ||
        item.location?.name ||
        'Somewhere special ✨';

    return (
        <MotiView
            from={{ opacity: 0, translateY: 18 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                delay: index * 40,
                type: 'timing',
                duration: 400,
            }}
            style={styles.wrapper}
        >
            <TouchableOpacity
                activeOpacity={0.96}
                style={styles.card}
                onPress={onPress}
            >
                {/* IMAGE */}
                <View>
                    <Image
                        source={{
                            uri:
                                item.thumbnailUrl ||
                                item.media?.[0]?.url ||
                                item.mediaUrl ||
                                item.image ||
                                'https://via.placeholder.com/500',
                        }}
                        style={styles.image}
                    />

                    {/* DATE BADGE */}
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateDay}>{day}</Text>
                        <Text style={styles.dateMonth}>{month}</Text>
                    </View>
                </View>

                {/* BODY */}
                <View style={styles.body}>
                    {/* META */}
                    <View style={styles.metaRow}>
                        <Text style={styles.yearText}>{date.getFullYear()}</Text>
                        <Text style={styles.userText}>@{username}</Text>
                    </View>

                    {/* TITLE */}
                    <Text numberOfLines={2} style={styles.title}>
                        {title}
                    </Text>

                    {/* LOCATION */}
                    <View style={styles.locationRow}>
                        <Ionicons
                            name="location-sharp"
                            size={14}
                            color="#2E7D32"
                        />
                        <Text style={styles.locationText}>
                            {location}
                        </Text>
                    </View>

                    {/* DIVIDER */}
                    <View style={styles.divider} />

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={onLike}
                            style={[
                                styles.actionBtn,
                                isLiked && styles.likedBtn,
                            ]}
                        >
                            <Ionicons
                                name={isLiked ? 'heart' : 'heart-outline'}
                                size={18}
                                color={isLiked ? '#ff3b30' : '#444'}
                            />
                            <Text
                                style={[
                                    styles.actionText,
                                    isLiked && { color: '#ff3b30' },
                                ]}
                            >
                                {item.likesCount !== undefined ? item.likesCount : (item.likes || 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onComment}
                        >
                            <Ionicons
                                name="chatbubble-outline"
                                size={18}
                                color="#444"
                            />
                            <Text style={styles.actionText}>
                                {item.commentsCount !== undefined ? item.commentsCount : (item.comments?.length || 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onShare}
                        >
                            <Ionicons
                                name="share-social-outline"
                                size={18}
                                color="#444"
                            />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>

                        {isOwner && (
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => onDelete(item)}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color="#ff3b30"
                                />
                                <Text style={[styles.actionText, { color: '#ff3b30' }]}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
};

export default MemoriesCards;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 24,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },

    image: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
    },

    dateBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: 'center',
    },

    dateDay: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 18,
    },

    dateMonth: {
        fontSize: 11,
        fontWeight: '600',
        color: '#eee',
    },

    body: {
        padding: 16,
    },

    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    yearText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },

    userText: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        lineHeight: 24,
        marginBottom: 8,
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    locationText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
    },

    divider: {
        height: 1,
        backgroundColor: '#f2f2f2',
        marginVertical: 12,
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },

    likedBtn: {
        backgroundColor: '#ffecec',
    },

    actionText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
    },
});
