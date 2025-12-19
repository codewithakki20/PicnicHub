import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
    getSuggestedUsers,
    followUser,
    unfollowUser,
    getAvatarUrl,
} from '../../services/api';
import { MotiView } from 'moti';

const FindPeopleScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState([]);
    const [actionLoadingIds, setActionLoadingIds] = useState([]);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await getSuggestedUsers();
            const data =
                Array.isArray(res) ? res :
                    Array.isArray(res?.users) ? res.users :
                        Array.isArray(res?.data) ? res.data : [];

            setUsers(data);
        } catch (error) {
            console.log('Failed to load suggestions', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async (userId) => {
        if (actionLoadingIds.includes(userId)) return;

        const isFollowing = followingIds.includes(userId);

        try {
            setActionLoadingIds(prev => [...prev, userId]);

            // 🚀 optimistic UI
            setFollowingIds(prev =>
                isFollowing
                    ? prev.filter(id => id !== userId)
                    : [...prev, userId]
            );

            isFollowing
                ? await unfollowUser(userId)
                : await followUser(userId);
        } catch (error) {
            console.log('Follow toggle error', error);

            // rollback on failure
            setFollowingIds(prev =>
                isFollowing
                    ? [...prev, userId]
                    : prev.filter(id => id !== userId)
            );
        } finally {
            setActionLoadingIds(prev =>
                prev.filter(id => id !== userId)
            );
        }
    };

    const renderItem = ({ item, index }) => {
        const isFollowing = followingIds.includes(item._id);
        const isLoading = actionLoadingIds.includes(item._id);

        return (
            <MotiView
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 40 }}
                style={styles.card}
            >
                <TouchableOpacity
                    style={styles.cardContent}
                    activeOpacity={0.85}
                    onPress={() =>
                        navigation.navigate('UserProfile', { userId: item._id })
                    }
                >
                    <Image
                        source={{ uri: getAvatarUrl(item.avatarUrl) }}
                        style={styles.avatar}
                    />

                    <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.username}>
                            @{item.username || item.name.replace(/\s+/g, '').toLowerCase()}
                        </Text>
                    </View>

                    <TouchableOpacity
                        disabled={isLoading}
                        onPress={() => toggleFollow(item._id)}
                        style={[
                            styles.followBtn,
                            isFollowing && styles.followingBtn,
                        ]}
                    >
                        <Text
                            style={[
                                styles.followText,
                                isFollowing && styles.followingText,
                            ]}
                        >
                            {isLoading
                                ? '...'
                                : isFollowing
                                    ? 'Following'
                                    : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </MotiView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Discover People</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>
                                No new suggestions right now.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default FindPeopleScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
    },
    backBtn: {
        padding: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eee',
    },
    info: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    username: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    followBtn: {
        backgroundColor: '#2E7D32',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    followingBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    followText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    followingText: {
        color: '#333',
    },
    empty: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 15,
    },
});
