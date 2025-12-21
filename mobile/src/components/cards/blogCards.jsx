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

const BlogCards = ({ item, index = 0, onPress }) => {
    const dateText = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        })
        : '';

    const title = item.title || 'Untitled blog';
    const subtitle =
        item.subtitle ||
        item.excerpt ||
        'A short read worth your time.';

    const author =
        item.authorId?.name ||
        item.user?.name ||
        item.author ||
        'PicnicHub';

    const locationName = item.location?.name || (typeof item.location === 'string' ? item.location : null);

    return (
        <MotiView
            from={{ opacity: 0, translateY: 18 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                delay: index * 40,
                type: 'timing',
                duration: 400,
            }}
        >
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.95}
                onPress={() => onPress(item)}
            >
                {/* COVER */}
                <View>
                    <Image
                        source={{
                            uri:
                                item.coverImage ||
                                item.image ||
                                item.thumbnail ||
                                'https://via.placeholder.com/600',
                        }}
                        style={styles.image}
                    />

                    {/* CATEGORY */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {item.category || 'General'}
                        </Text>
                    </View>
                </View>

                {/* CONTENT */}
                <View style={styles.content}>
                    <Text numberOfLines={2} style={styles.title}>
                        {title}
                    </Text>

                    <Text numberOfLines={2} style={styles.subtitle}>
                        {subtitle}
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.author}>{author}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.date}>{dateText}</Text>

                        {locationName && (
                            <>
                                <Text style={styles.dot}>•</Text>
                                <Ionicons name="location-outline" size={12} color="#666" style={{ marginRight: 2 }} />
                                <Text style={styles.date}>{locationName}</Text>
                            </>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </MotiView>
    );
};

export default React.memo(BlogCards);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 22,
        marginBottom: 24,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },

    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },

    badge: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: 'rgba(255,255,255,0.96)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 18,
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#2E7D32',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },

    content: {
        padding: 18,
    },

    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111',
        lineHeight: 26,
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        marginBottom: 14,
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    author: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },

    dot: {
        marginHorizontal: 6,
        color: '#bbb',
        fontSize: 14,
    },

    date: {
        fontSize: 12,
        color: '#999',
    },
});
