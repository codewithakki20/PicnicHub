import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchNotifications();
        }, [])
    );

    /* ---------------- Derived State ---------------- */

    const unreadCount = useMemo(
        () => notifications.filter(n => !n.isRead).length,
        [notifications]
    );

    /* ---------------- Helpers ---------------- */

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    /* ---------------- Actions ---------------- */

    const markAsRead = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(n =>
                    n._id === id ? { ...n, isRead: true } : n
                )
            );
            await api.put(`/notifications/${id}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        // Since backend doesn't have mark-all endpoint yet, we just loop locally or add endpoint later.
        // For now, we update local state optimistically.
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);

        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );

        // Ideally call a bulk endpoint. calling loop for now (only if few) or skipping for safety.
        // Implementation limitation: Backend needs 'markAllRead' endpoint.
        // For this task, we'll leave it as UI-only for bulk, or call individually.
        // Better UX: Call loop
        unreadIds.forEach(id => api.put(`/notifications/${id}/read`).catch(e => { }));
    };

    const removeNotification = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.filter(n => n._id !== id)
            );
            await api.delete(`/notifications/${id}`);
        } catch (error) {
            console.error('Error deleting notification:', error);
            // Revert could be here, but simple error log is okay for now
            fetchNotifications(); // Sync on error
        }
    };

    const handleNotificationPress = (item) => {
        markAsRead(item._id);

        if (!item.referenceId) return;

        // Route based on item.onModel or item.type
        switch (item.type) {
            case 'like_memory':
            case 'comment_memory':
                // Check if referenceId is a string or object. 
                // Populate might return object. Navigation usually needs ID.
                const memoryId = typeof item.referenceId === 'object' ? item.referenceId._id : item.referenceId;
                navigation.navigate('MemoryDetails', { memoryId });
                break;
            case 'follow':
                const userId = typeof item.senderId === 'object' ? item.senderId._id : item.senderId;
                navigation.navigate('UserProfile', { userId });
                break;
            case 'new_story':
                // logic to view story
                break;
            default:
                break;
        }
    };

    /* ---------------- Icon & Text Resolver ---------------- */

    const getIcon = (type) => {
        if (type.includes('like')) return 'heart-outline';
        if (type.includes('comment')) return 'chatbubble-outline';
        if (type.includes('follow')) return 'person-add-outline';
        if (type === 'new_story') return 'add-circle-outline';
        return 'notifications-outline';
    };

    const getTitle = (item) => {
        const senderName = item.senderId?.name || 'Someone';
        switch (item.type) {
            case 'like_memory': return `${senderName} liked your memory`;
            case 'like_reel': return `${senderName} liked your reel`;
            case 'comment_memory': return `${senderName} commented on your memory`;
            case 'comment_reel': return `${senderName} commented on your reel`;
            case 'follow': return `${senderName} started following you`;
            case 'new_story': return `${senderName} added to their story`;
            default: return 'New Notification';
        }
    };

    /* ---------------- Swipe Action ---------------- */

    const renderRightActions = (id) => (
        <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeNotification(id)}
        >
            <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>
    );

    /* ---------------- Render Item ---------------- */

    const renderItem = ({ item, index }) => (
        <Swipeable renderRightActions={() => renderRightActions(item._id)}>
            <MotiView
                from={{ opacity: 0, translateY: 14 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 40 }}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleNotificationPress(item)}
                    style={[
                        styles.item,
                        !item.isRead && styles.unreadItem,
                    ]}
                >
                    {!item.isRead && <View style={styles.unreadBar} />}

                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={getIcon(item.type)}
                            size={22}
                            color="#2E7D32"
                        />
                    </View>

                    <View style={styles.content}>
                        <Text
                            style={[
                                styles.title,
                                !item.isRead && styles.unreadTitle,
                            ]}
                        >
                            {getTitle(item)}
                        </Text>

                        {/* Optional message if available, else omit */}
                        <Text style={styles.message}>{item.message}</Text>

                        <Text style={styles.time}>
                            {formatTimeAgo(item.createdAt)}
                        </Text>
                    </View>

                    {!item.isRead && <View style={styles.dot} />}
                </TouchableOpacity>
            </MotiView>
        </Swipeable>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Notifications
                </Text>

                <TouchableOpacity
                    disabled={unreadCount === 0}
                    onPress={markAllAsRead}
                >
                    <Text
                        style={[
                            styles.markAllText,
                            unreadCount === 0 && { opacity: 0.4 },
                        ]}
                    >
                        Mark all
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="notifications-off-outline"
                            size={52}
                            color="#bbb"
                        />
                        <Text style={styles.emptyText}>
                            {loading ? "Loading..." : "You're all caught up ✨"}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default NotificationsScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    backButton: {
        padding: 6,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },

    markAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
    },

    listContent: {
        paddingVertical: 6,
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },

    unreadItem: {
        backgroundColor: '#F7FDF7',
    },

    unreadBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#2E7D32',
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    content: {
        flex: 1,
    },

    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },

    unreadTitle: {
        fontWeight: '700',
    },

    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },

    time: {
        fontSize: 12,
        color: '#999',
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2E7D32',
        marginLeft: 8,
    },

    deleteBtn: {
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
    },

    emptyContainer: {
        padding: 50,
        alignItems: 'center',
    },

    emptyText: {
        marginTop: 14,
        color: '#999',
        fontSize: 16,
        fontWeight: '500',
    },
});
