import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Share,
    StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

/* ======================================================
   BLOG DETAILS
====================================================== */

const BlogDetailsScreen = ({ route, navigation }) => {
    const { blog } = route.params;
    const insets = useSafeAreaInsets();
    const { width: contentWidth } = useWindowDimensions();

    /* ---------------- STATE ---------------- */
    const [bookmarked, setBookmarked] = useState(!!blog.isBookmarked);

    /* ---------------- ANIMATION VALUES ---------------- */
    const scrollY = useSharedValue(0);
    const contentHeight = useSharedValue(1);
    const containerHeight = useSharedValue(1);

    /* ---------------- SCROLL HANDLER ---------------- */
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollY.value = e.contentOffset.y;
        },
    });

    /* ---------------- HEADER IMAGE ---------------- */
    const imageStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(
                    scrollY.value,
                    [-120, 0, HEADER_HEIGHT],
                    [1.4, 1, 1],
                    Extrapolate.CLAMP
                ),
            },
            {
                translateY: interpolate(
                    scrollY.value,
                    [-120, 0, HEADER_HEIGHT],
                    [-60, 0, HEADER_HEIGHT * 0.45],
                    Extrapolate.CLAMP
                ),
            },
        ],
    }));

    /* ---------------- PROGRESS BAR ---------------- */
    const progressStyle = useAnimatedStyle(() => {
        const maxScroll = Math.max(
            1,
            contentHeight.value - containerHeight.value
        );

        return {
            width: interpolate(
                scrollY.value,
                [0, maxScroll],
                [0, width],
                Extrapolate.CLAMP
            ),
        };
    });

    /* ---------------- SHARE ---------------- */
    const onShare = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        await Share.share({
            message: `${blog.title}\n\nRead this on PicnicHub 🌿`,
        });
    }, [blog.title]);

    /* ---------------- BOOKMARK ---------------- */
    const onBookmark = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setBookmarked((v) => !v);

        // 🔗 Hook backend here if needed
        // blogApi.toggleBookmark(blog._id)
    }, []);

    /* ---------------- META ---------------- */
    const readingTime = useMemo(() => {
        const text = blog.content || blog.description || '';
        return Math.max(1, Math.round(text.length / 1000));
    }, [blog.content, blog.description]);

    const coverImage =
        blog.coverImage ||
        blog.image ||
        blog.thumbnail ||
        'https://via.placeholder.com/600';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent />

            {/* ================= PROGRESS ================= */}
            <Animated.View style={[styles.progressBar, progressStyle]} />

            {/* ================= HEADER IMAGE ================= */}
            <Animated.Image
                source={{ uri: coverImage }}
                style={[styles.headerImage, imageStyle]}
            />

            {/* ================= GRADIENT ================= */}
            <LinearGradient
                colors={['rgba(0,0,0,0.55)', 'transparent']}
                style={styles.headerOverlay}
            />

            {/* ================= BACK ================= */}
            <TouchableOpacity
                style={[styles.backBtn, { top: insets.top + 12 }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>

            {/* ================= ACTIONS ================= */}
            <View style={[styles.actions, { top: insets.top + 12 }]}>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={onBookmark}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={22}
                        color="#fff"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={onShare}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share-social-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* ================= CONTENT ================= */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                onContentSizeChange={(_, h) => (contentHeight.value = h)}
                onLayout={(e) =>
                    (containerHeight.value = e.nativeEvent.layout.height)
                }
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: HEADER_HEIGHT - 40,
                    paddingBottom: 60,
                }}
            >
                <View style={styles.content}>
                    <Text style={styles.category}>
                        {blog.category || 'General'} • {readingTime} min read
                    </Text>

                    <Text style={styles.title}>{blog.title}</Text>

                    <Text style={styles.meta}>
                        {blog.user?.name || blog.author || 'Author'} ·{' '}
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </Text>

                    <RenderHtml
                        contentWidth={contentWidth}
                        source={{
                            html:
                                blog.content ||
                                blog.description ||
                                '<p>No content available.</p>',
                        }}
                        tagsStyles={{
                            p: {
                                fontSize: 17,
                                lineHeight: 28,
                                color: '#333',
                                marginBottom: 12,
                            },
                            h1: { fontSize: 24, fontWeight: 'bold', marginVertical: 12 },
                            h2: { fontSize: 22, fontWeight: 'bold', marginVertical: 12 },
                            strong: { fontWeight: '700', color: '#000' },
                            span: { fontSize: 17, lineHeight: 28, color: '#333' },
                            img: { marginVertical: 10, borderRadius: 8 },
                        }}
                    />
                </View>
            </Animated.ScrollView>
        </View>
    );
};

export default BlogDetailsScreen;

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 3,
        backgroundColor: '#2E7D32',
        zIndex: 100,
    },

    headerImage: {
        position: 'absolute',
        width,
        height: HEADER_HEIGHT,
        resizeMode: 'cover',
    },

    headerOverlay: {
        position: 'absolute',
        width,
        height: HEADER_HEIGHT,
    },

    backBtn: {
        position: 'absolute',
        left: 20,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    actions: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        zIndex: 10,
    },

    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        padding: 26,
        minHeight: height,
    },

    category: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2E7D32',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 18,
        color: '#111',
        lineHeight: 38,
    },

    meta: {
        fontSize: 14,
        color: '#777',
        marginBottom: 28,
    },

    body: {
        fontSize: 17,
        lineHeight: 32,
        color: '#333',
    },
});
