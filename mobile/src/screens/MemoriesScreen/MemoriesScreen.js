import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Share,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

import { getMemories, likeMemory, deleteMemory } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import MemoriesCards from '../../components/cards/MemoriesCards';

const HEADER_HEIGHT = 90;

/* ---------------- Skeleton ---------------- */

const MemorySkeleton = () => (
    <View style={{ marginBottom: 20 }}>
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage}>
                <MotiView
                    from={{ translateX: -250 }}
                    animate={{ translateX: 250 }}
                    transition={{ loop: true, duration: 900 }}
                    style={StyleSheet.absoluteFill}
                >
                    <LinearGradient
                        colors={[
                            'transparent',
                            'rgba(255,255,255,0.6)',
                            'transparent',
                        ]}
                        style={{ width: '100%', height: '100%' }}
                    />
                </MotiView>
            </View>

            <View style={{ padding: 14 }}>
                <View style={styles.skeletonLineShort} />
                <View style={styles.skeletonLineLong} />
            </View>
        </View>
    </View>
);

/* ---------------- Screen ---------------- */

const MemoriesScreen = ({ navigation }) => {
    const { user: currentUser } = useContext(AuthContext);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMemories = async () => {
        try {
            const res = await getMemories();
            const sorted = (res.memories || []).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setMemories(sorted);
        } catch (e) {
            console.log('Fetch memories error:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMemories();
    }, []);

    const handleShare = async (item) => {
        try {
            const title = item.title || 'A PicnicHub Memory';
            const user = item.user?.username || 'PicnicHub';
            await Share.share({
                message: `Check out ${title} by @${user} on PicnicHub! 🌿`,
                title: 'Share Memory'
            });
        } catch (error) {
            console.log('Share error:', error.message);
        }
    };

    const toggleLike = async (id) => {
        // Optimistic Update
        setMemories(prev =>
            prev.map(m => {
                if (m._id !== id) return m;
                const currentLikes = m.likes || 0;
                const isLiked = !m.isLiked;
                return {
                    ...m,
                    isLiked,
                    likes: isLiked ? (m.likes || 0) + 1 : Math.max(0, (m.likes || 1) - 1),
                    likesCount: isLiked ? (m.likesCount || 0) + 1 : Math.max(0, (m.likesCount || 1) - 1),
                };
            })
        );

        try {
            await likeMemory(id);
        } catch (error) {
            console.log('Like error:', error);
            // Revert if failed
            setMemories(prev =>
                prev.map(m => {
                    if (m._id !== id) return m;
                    const isLiked = !m.isLiked; // revert back
                    return {
                        ...m,
                        isLiked,
                        likes: isLiked ? (m.likes || 0) + 1 : Math.max(0, (m.likes || 1) - 1),
                        likesCount: isLiked ? (m.likesCount || 0) + 1 : Math.max(0, (m.likesCount || 1) - 1),
                    };
                })
            );
        }
    };

    const handleCommentUpdate = (id) => {
        setMemories(prev =>
            prev.map(m => {
                if (m._id !== id) return m;
                return {
                    ...m,
                    commentsCount: (m.commentsCount || 0) + 1,
                    comments: [...(m.comments || []), { _id: Date.now() }] // minimal mock to increase length
                };
            })
        );
    };

    const handleDelete = (item) => {
        Alert.alert(
            "Delete Memory",
            "Are you sure you want to delete this memory?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setMemories(prev => prev.filter(m => m._id !== item._id));
                            await deleteMemory(item._id);
                        } catch (error) {
                            Alert.alert("Error", "Could not delete memory");
                            fetchMemories();
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, index }) => (
        <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 40 }}
        >
            <MemoriesCards
                item={item}
                index={index}
                isLiked={item.isLiked}
                isOwner={item.uploaderId?._id === currentUser?._id || item.user?._id === currentUser?._id}
                onLike={() => toggleLike(item._id)}
                onComment={() =>
                    navigation.navigate('Comments', {
                        memory: item,
                        type: 'memory',
                        autoFocus: true,
                        autoFocus: true,
                    })
                }
                onShare={() => handleShare(item)}
                onDelete={handleDelete}
            />
        </MotiView>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ padding: 16 }}>
                    <MemorySkeleton />
                    <MemorySkeleton />
                    <MemorySkeleton />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* HERO HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Memories</Text>
                <Text style={styles.headerSubtitle}>
                    Your moments, your story 🌿
                </Text>
            </View>

            {/* FEED */}
            <FlatList
                data={memories}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#2E7D32"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyText}>No memories yet</Text>
                        <Text style={styles.emptySubText}>
                            Start capturing moments that matter ✨
                        </Text>

                        <TouchableOpacity
                            style={styles.emptyBtn}
                            onPress={() => navigation.navigate('UploadMemory')}
                        >
                            <Text style={styles.emptyBtnText}>
                                Create your first memory
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* FLOATING ADD BUTTON */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('UploadMemory')}
                activeOpacity={0.85}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default MemoriesScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },

    header: {
        padding: 20,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1B5E20',
    },

    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },

    listContent: {
        padding: 16,
        paddingBottom: 120,
    },

    /* Skeleton */
    skeletonCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
    },
    skeletonImage: {
        height: 200,
        backgroundColor: '#e5e5e5',
    },
    skeletonLineShort: {
        width: '50%',
        height: 10,
        backgroundColor: '#ccc',
        borderRadius: 6,
        marginBottom: 10,
    },
    skeletonLineLong: {
        width: '80%',
        height: 10,
        backgroundColor: '#ccc',
        borderRadius: 6,
    },

    /* Empty */
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    emptySubText: {
        fontSize: 14,
        color: '#777',
        marginTop: 6,
        textAlign: 'center',
    },
    emptyBtn: {
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1B5E20',
    },
    emptyBtnText: {
        color: '#fff',
        fontWeight: '600',
    },

    /* FAB */
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1B5E20',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
});
