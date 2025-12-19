import React, { useContext, useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

import { AuthContext } from '../context/AuthContext';
import { getComments, addComment, deleteComment } from '../services/api';
import CommentsCards from '../components/cards/CommentsCards';

const CommentsScreen = ({ route, navigation }) => {
    const { memory, data, type = 'memory', autoFocus = false } = route.params || {};
    const post = memory || data;

    const { user } = useContext(AuthContext); // user object from context

    // Debugging logs for comment deletion
    const checkOwnership = (comment) => {
        const commentAuthorId = comment.authorId?._id || comment.authorId || comment.user?._id;
        const myId = user?._id;
        return commentAuthorId === myId;
    };

    const listRef = useRef(null);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    /* ---------------- Fetch Comments ---------------- */

    useEffect(() => {
        fetchComments();
    }, [post?._id, type]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await getComments(post._id, type);
            setComments(res?.comments || []);
        } catch (e) {
            console.log('Fetch comments error:', e);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Actions ---------------- */

    const handleAddComment = async () => {
        if (!newComment.trim() || submitting) return;

        const tempId = `temp_${Date.now()}`;

        const tempComment = {
            _id: tempId,
            text: newComment.trim(),
            user: user, // Optimistic Update
            authorId: user?._id || user, // Handle both structures
            createdAt: new Date().toISOString(),
            isTemp: true,
        };

        setComments(prev => [...prev, tempComment]);
        setNewComment('');
        setSubmitting(true);

        // Reliable scroll
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
            const res = await addComment(post._id, tempComment.text, type);

            if (res?.comment || res) {
                const finalComment = res.comment || res;
                setComments(prev =>
                    prev.map(c => (c._id === tempId ? finalComment : c))
                );
                if (route.params?.onCommentAdded) {
                    route.params.onCommentAdded();
                }
            } else {
                fetchComments();
            }
        } catch (e) {
            console.log('Add comment failed:', e);
            setComments(prev => prev.filter(c => c._id !== tempId));
            Alert.alert("Error", "Could not post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLongPress = (comment) => {
        const commentAuthorId = comment.authorId?._id || comment.authorId || comment.user?._id || comment.user;
        const isMyComment = user?._id && commentAuthorId && String(commentAuthorId) === String(user._id);

        console.log("Debug Comment Check:", { commentAuthorId, contextId: user?._id, isMyComment });

        if (!isMyComment) return;

        Alert.alert(
            "Delete Comment",
            "Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Optimistic remove
                            setComments(prev => prev.filter(c => c._id !== comment._id));

                            await deleteComment(post._id, comment._id, type);
                        } catch (error) {
                            Alert.alert("Error", "Could not delete comment");
                            fetchComments(); // Revert
                        }
                    }
                }
            ]
        );
    };

    /* ---------------- Render ---------------- */

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Comments {comments.length ? `(${comments.length})` : ''}
                </Text>

                <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                </View>
            ) : (
                <FlatList
                    ref={listRef}
                    data={comments}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    removeClippedSubviews
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={7}
                    renderItem={({ item, index }) => (
                        <MotiView
                            from={{ opacity: 0, translateY: 8 }}
                            animate={{ opacity: item.isTemp ? 0.6 : 1, translateY: 0 }}
                            transition={{ delay: index * 20 }}
                        >
                            <TouchableOpacity activeOpacity={0.8} onLongPress={() => handleLongPress(item)}>
                                <CommentsCards
                                    comment={item}
                                    onLike={() => { }}
                                    onReply={() => { }}
                                    onDelete={handleLongPress}
                                    isOwner={checkOwnership(item)}
                                />
                            </TouchableOpacity>
                        </MotiView>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={44}
                                color="#bbb"
                            />
                            <Text style={styles.emptyText}>
                                No comments yet
                            </Text>
                            <Text style={styles.emptySub}>
                                Be the first to say something 👋
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment…"
                        placeholderTextColor="#999"
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                        autoFocus={autoFocus}
                    />

                    <TouchableOpacity
                        onPress={handleAddComment}
                        disabled={!newComment.trim() || submitting}
                        style={styles.sendBtn}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#2E7D32" />
                        ) : (
                            <Ionicons
                                name="send"
                                size={20}
                                color={newComment.trim() ? '#2E7D32' : '#ccc'}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CommentsScreen;

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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listContent: {
        padding: 16,
        paddingBottom: 100,
    },

    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },

    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginTop: 12,
    },

    emptySub: {
        fontSize: 13,
        color: '#888',
        marginTop: 4,
    },

    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },

    input: {
        flex: 1,
        backgroundColor: '#f1f3f5',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 120,
        fontSize: 14,
    },

    sendBtn: {
        marginLeft: 10,
        padding: 6,
    },
});
