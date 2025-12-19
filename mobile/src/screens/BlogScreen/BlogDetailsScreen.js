import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Share,
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

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

const BlogDetailsScreen = ({ route, navigation }) => {
    const { blog } = route.params;
    const insets = useSafeAreaInsets();

    const scrollY = useSharedValue(0);
    const contentHeight = useSharedValue(1);
    const containerHeight = useSharedValue(1);

    const [bookmarked, setBookmarked] = useState(false);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            scrollY.value = e.contentOffset.y;
        },
    });

    const imageStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(
                    scrollY.value,
                    [-120, 0, HEADER_HEIGHT],
                    [1.45, 1, 1],
                    Extrapolate.CLAMP
                ),
            },
            {
                translateY: interpolate(
                    scrollY.value,
                    [-120, 0, HEADER_HEIGHT],
                    [-50, 0, HEADER_HEIGHT * 0.45],
                    Extrapolate.CLAMP
                ),
            },
        ],
    }));

    const progressStyle = useAnimatedStyle(() => {
        const maxScroll = contentHeight.value - containerHeight.value;
        return {
            width: interpolate(
                scrollY.value,
                [0, maxScroll > 0 ? maxScroll : 1],
                [0, width],
                Extrapolate.CLAMP
            ),
        };
    });

    const onShare = async () => {
        await Share.share({
            message: `${blog.title}\n\nRead this on PicnicHub 🌿`,
        });
    };

    const readingTime = Math.max(
        1,
        Math.round((blog.content?.length || 0) / 1000)
    );

    return (
        <View style={styles.container}>
            {/* Progress */}
            <Animated.View style={[styles.progressBar, progressStyle]} />

            {/* Header Image */}
            <Animated.Image
                source={{
                    uri:
                        blog.coverImage ||
                        blog.image ||
                        blog.thumbnail ||
                        'https://via.placeholder.com/600',
                }}
                style={[styles.headerImage, imageStyle]}
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0.55)', 'transparent']}
                style={styles.headerOverlay}
            />

            {/* Back */}
            <TouchableOpacity
                style={[styles.backBtn, { top: insets.top + 12 }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>

            {/* Actions */}
            <View style={[styles.actions, { top: insets.top + 12 }]}>

                <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
                    <Ionicons name="share-social-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                onContentSizeChange={(_, h) => (contentHeight.value = h)}
                onLayout={e =>
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

                    <Text style={styles.body}>
                        {blog.content || blog.description || 'No content available.'}
                    </Text>
                </View>
            </Animated.ScrollView>
        </View>
    );
};

export default BlogDetailsScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

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
