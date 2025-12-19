import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Pressable,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';
import { deleteStory } from '../services/api';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000;

const StoryViewScreen = ({ route, navigation }) => {
    const { stories: initialStories, user } = route.params;
    const { user: currentUser } = useContext(AuthContext);

    const [stories, setStories] = useState(initialStories);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const progress = useRef(new Animated.Value(0)).current;
    const animation = useRef(null);
    const startTime = useRef(0);
    const remaining = useRef(STORY_DURATION);

    const story = stories[index];

    /* ---------------- Progress ---------------- */

    const start = (duration = STORY_DURATION) => {
        progress.setValue(0);
        startTime.current = Date.now();

        animation.current = Animated.timing(progress, {
            toValue: 1,
            duration,
            useNativeDriver: false,
        });

        animation.current.start(({ finished }) => {
            if (finished && !paused) next();
        });
    };

    const pause = () => {
        if (paused) return;
        setPaused(true);

        progress.stopAnimation(v => {
            remaining.current = STORY_DURATION * (1 - v);
        });
    };

    const resume = () => {
        if (!paused) return;
        setPaused(false);
        start(remaining.current);
    };

    useEffect(() => {
        progress.stopAnimation();
        remaining.current = STORY_DURATION;
    }, [index]);

    /* ---------------- Navigation ---------------- */

    const next = () => {
        if (index < stories.length - 1) {
            setIndex(i => i + 1);
        } else {
            close();
        }
    };

    const prev = () => {
        if (index > 0) {
            setIndex(i => i - 1);
        } else {
            start();
        }
    };

    const handleTap = e => {
        const x = e.nativeEvent.locationX;
        x < width / 2 ? prev() : next();
    };

    const close = () => navigation.goBack();

    /* ---------------- Delete ---------------- */

    const isOwner =
        user?.isMyStory ||
        (currentUser?._id && user?._id && String(currentUser._id) === String(user._id));

    const handleDelete = async () => {
        pause();
        try {
            await deleteStory(story._id || story.id);

            const updated = stories.filter((_, i) => i !== index);
            if (!updated.length) return close();

            setStories(updated);
            setIndex(i => Math.min(i, updated.length - 1));
        } catch (e) {
            console.log('Delete failed', e);
            resume();
        }
    };

    /* ---------------- Render ---------------- */

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* STORY MEDIA */}
            <Pressable
                style={StyleSheet.absoluteFill}
                onPress={handleTap}
                onPressIn={pause}
                onPressOut={resume}
            >
                <Image
                    source={{
                        uri:
                            story.imageUrl ||
                            story.mediaUrl ||
                            story.media?.[0]?.url ||
                            'https://via.placeholder.com/800x1600',
                    }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoadEnd={() => start()}
                />
            </Pressable>

            {/* OVERLAY */}
            <SafeAreaView style={styles.overlay}>
                {/* Progress */}
                <View style={styles.progressRow}>
                    {stories.map((_, i) => (
                        <View key={i} style={styles.progressBg}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width:
                                            i < index
                                                ? '100%'
                                                : i === index
                                                    ? progress.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0%', '100%'],
                                                    })
                                                    : '0%',
                                    },
                                ]}
                            />
                        </View>
                    ))}
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userRow}>
                        <Image
                            source={{
                                uri:
                                    user.avatar ||
                                    'https://via.placeholder.com/100',
                            }}
                            style={styles.avatar}
                        />
                        <Text style={styles.username}>{user.name}</Text>
                        <Text style={styles.time}>
                            {' '}
                            •{' '}
                            {new Date(story.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        {isOwner && (
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={styles.iconBtn}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={close}
                            style={styles.iconBtn}
                        >
                            <Ionicons name="close" size={26} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default StoryViewScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    image: {
        width,
        height,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    progressRow: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 4,
    },

    progressBg: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderRadius: 2,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        marginTop: 10,
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },

    username: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },

    time: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconBtn: {
        padding: 8,
    },
});
