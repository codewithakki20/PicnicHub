import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getFollowers, getFollowing, getAvatarUrl, followUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const FollowListScreen = ({ navigation, route }) => {
    const { userId, type } = route.params; // type: 'followers' | 'following'
    const { user: currentUser } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isFollowers = type === "followers";
    const title = isFollowers ? "Followers" : "Following";

    useEffect(() => {
        fetchUsers();
    }, [userId, type]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = isFollowers
                ? await getFollowers(userId)
                : await getFollowing(userId);
            setUsers(data);
        } catch (error) {
            console.error("Fetch follow list error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserPress = (id) => {
        if (id === currentUser?._id) {
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserProfile", { userId: id });
        }
    };

    /* ---------------- Render Item ---------------- */

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userRow}
            onPress={() => handleUserPress(item._id)}
        >
            <Image
                source={{ uri: getAvatarUrl(item.avatarUrl) }}
                style={styles.avatar}
            />
            <View style={styles.userInfo}>
                <Text style={styles.name}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#1B5E20" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>
                                {isFollowers
                                    ? "No followers yet."
                                    : "Not following anyone yet."}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
    },
    listContent: {
        paddingVertical: 10,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    emptyText: {
        color: "#999",
        fontSize: 16,
    },
});

export default FollowListScreen;
