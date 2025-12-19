import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

import { getBlogs } from '../../services/api';
import BlogCards from '../../components/cards/blogCards';

/* ---------------- Skeleton ---------------- */

const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
        <View style={styles.skeletonImage}>
            <MotiView
                from={{ translateX: -180 }}
                animate={{ translateX: 180 }}
                transition={{ loop: true, duration: 900 }}
                style={StyleSheet.absoluteFill}
            >
                <LinearGradient
                    colors={[
                        'transparent',
                        'rgba(255,255,255,0.45)',
                        'transparent',
                    ]}
                    style={{ width: '100%', height: '100%' }}
                />
            </MotiView>
        </View>

        <View style={styles.skeletonText}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '60%' }]} />
        </View>
    </View>
);

/* ---------------- Screen ---------------- */

const BlogScreen = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await getBlogs();
            setBlogs(res?.blogs || []);
        } catch (e) {
            console.log('Blog fetch error:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBlogs();
    }, []);

    /* 🧠 Derived categories */
    const categories = useMemo(() => {
        const set = new Set(['All']);
        blogs.forEach(b => b.category && set.add(b.category));
        return Array.from(set);
    }, [blogs]);

    /* 🔍 Filter logic */
    const filteredBlogs = useMemo(() => {
        let data = blogs;

        if (activeCategory !== 'All') {
            data = data.filter(b => b.category === activeCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                b =>
                    b.title?.toLowerCase().includes(q) ||
                    b.subtitle?.toLowerCase().includes(q) ||
                    b.excerpt?.toLowerCase().includes(q)
            );
        }

        return data;
    }, [blogs, search, activeCategory]);

    const renderItem = ({ item, index }) => (
        <BlogCards
            item={item}
            index={index}
            onPress={() =>
                navigation.navigate('BlogDetails', { blog: item })
            }
        />
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ padding: 20 }}>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* HERO HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Picnic Blogs</Text>
                <Text style={styles.headerSubtitle}>
                    Stories, guides & inspiration 🌿
                </Text>
            </View>


            {/* CATEGORIES */}
            <FlatList
                horizontal
                data={categories}
                keyExtractor={i => i}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categories}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setActiveCategory(item)}
                        style={[
                            styles.categoryChip,
                            activeCategory === item && styles.activeChip,
                        ]}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                activeCategory === item &&
                                styles.activeCategoryText,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* LIST */}
            <FlatList
                data={filteredBlogs}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="newspaper-outline"
                            size={48}
                            color="#bbb"
                        />
                        <Text style={styles.emptyText}>
                            No blogs found
                        </Text>
                        <Text style={styles.emptySub}>
                            Try another keyword or category
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default BlogScreen;

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
        marginTop: 4,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#333',
    },

    categories: {
        paddingHorizontal: 12,
        paddingBottom: 8,
    },

    categoryChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },

    activeChip: {
        backgroundColor: '#1B5E20',
        borderColor: '#1B5E20',
    },

    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },

    activeCategoryText: {
        color: '#fff',
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },

    emptyText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#444',
        marginTop: 12,
    },

    emptySub: {
        fontSize: 13,
        color: '#888',
        marginTop: 4,
    },

    skeletonCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 24,
        overflow: 'hidden',
    },

    skeletonImage: {
        height: 200,
        backgroundColor: '#eee',
    },

    skeletonText: {
        padding: 16,
    },

    skeletonLine: {
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 7,
        marginBottom: 10,
        width: '80%',
    },
});
