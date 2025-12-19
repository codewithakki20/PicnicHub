import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CommentsCards = ({ comment, onLike, onReply, onDelete, isOwner }) => {
    const user = comment.user || comment.authorId || {};
    const avatar =
        user.avatarUrl || user.avatar || "https://via.placeholder.com/100";
    const name = user.name || "User";

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <Image source={{ uri: avatar }} style={styles.avatar} />

            {/* Comment */}
            <View style={styles.right}>
                <View style={styles.bubble}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.text}>{comment.text}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Text style={styles.time}>
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>

                    <TouchableOpacity onPress={() => onLike(comment._id)}>
                        <Text
                            style={[
                                styles.actionText,
                                comment.isLiked && { color: "#ff3b30" },
                            ]}
                        >
                            Like
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onReply(comment)}>
                        <Text style={styles.actionText}>Reply</Text>
                    </TouchableOpacity>

                    {isOwner && (
                        <TouchableOpacity onPress={() => onDelete(comment)}>
                            <Text style={[styles.actionText, { color: "#ff3b30" }]}>Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Like Icon */}
            <TouchableOpacity
                onPress={() => onLike(comment._id)}
                style={styles.likeBtn}
            >
                <Ionicons
                    name={comment.isLiked ? "heart" : "heart-outline"}
                    size={16}
                    color={comment.isLiked ? "#ff3b30" : "#aaa"}
                />
            </TouchableOpacity>
        </View>
    );
};

export default CommentsCards;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 12,
        marginBottom: 18,
    },

    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        marginRight: 10,
        backgroundColor: "#eee",
    },

    right: {
        flex: 1,
    },

    bubble: {
        backgroundColor: "#f2f3f5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderTopLeftRadius: 6,
        alignSelf: "flex-start",
        maxWidth: "100%",
    },

    name: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111",
        marginBottom: 2,
    },

    text: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginTop: 6,
        marginLeft: 6,
    },

    time: {
        fontSize: 11,
        color: "#999",
    },

    actionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
    },

    likeBtn: {
        paddingLeft: 8,
        paddingTop: 6,
    },
});
