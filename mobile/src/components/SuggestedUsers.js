import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';

import {
    getSuggestedUsers,
    followUser,
    unfollowUser,
    getAvatarUrl,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';

const SuggestedUsers = ({ onUserPress }) => {
    const navigation = useNavigation();
    const { user: myUser } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState([]);
    const [actionLoadingIds, setActionLoadingIds] = useState([]);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await getSuggestedUsers();
            let data = response;

            if (response && !Array.isArray(response)) {
                if (Array.isArray(response.users)) data = response.users;
                else if (Array.isArray(response.data)) data = response.data;
            }

            setUsers(
                Array.isArray(data)
                    ? data.filter(u => u._id !== myUser?._id)
                    : []
            );
        } catch (error) {
            console.log('Failed to load suggestions', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async (userId) => {
        if (!myUser || actionLoadingIds.includes(userId)) return;

        const isFollowing = followingIds.includes(userId);

        try {
            setActionLoadingIds(prev => [...prev, userId]);

            // 🔥 optimistic UI
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

            // rollback if API fails
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

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="small" color="#2E7D32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>People You May Know</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('FindPeople')}
                >
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            {/* Cards */}
            <FlatList
                horizontal
                data={users}
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => {
                    const isFollowing = followingIds.includes(item._id);
                    const isLoading = actionLoadingIds.includes(item._id);

                    return (
                        <MotiView
                            from={{ opacity: 0, translateX: 40 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ delay: index * 80 }}
                            style={styles.card}
                        >
                            <TouchableOpacity
                                style={styles.cardInner}
                                onPress={() => onUserPress?.(item._id)}
                                activeOpacity={0.85}
                            >
                                <Image
                                    source={{ uri: getAvatarUrl(item.avatarUrl) }}
                                    style={styles.avatar}
                                />

                                <Text style={styles.name} numberOfLines={1}>
                                    {item.name}
                                </Text>

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

                            {/* Remove suggestion */}
                            <TouchableOpacity
                                style={styles.closeBtn}
                                onPress={() =>
                                    setUsers(prev =>
                                        prev.filter(u => u._id !== item._id)
                                    )
                                }
                            >
                                <Ionicons name="close" size={16} color="#bbb" />
                            </TouchableOpacity>
                        </MotiView>
                    );
                }}
            />
        </View>
    );
};

export default SuggestedUsers;


const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: '#fff',
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#333',
    },
    seeAll: {
        fontSize: 13,
        color: '#2E7D32',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 12,
    },
    card: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        marginHorizontal: 4,
        padding: 12,
        alignItems: 'center',
        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 2,
    },
    cardInner: {
        alignItems: 'center',
        width: '100%',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f0f0f0',
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
        marginBottom: 12,
        textAlign: 'center',
    },
    followBtn: {
        backgroundColor: '#2E7D32',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    followingBtn: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    followText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    followingText: {
        color: '#2E7D32',
    },
    closeBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 100,
    },
});
