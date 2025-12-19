import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SocialPostCards from '../../components/cards/SocialPostCards';
import { AuthContext } from '../../context/AuthContext';
import { deleteMemory, likeMemory } from '../../services/api';

const MemoryDetailsScreen = ({ route, navigation }) => {
    const { data } = route.params || {};
    const { user } = useContext(AuthContext);

    // Local state to handle updates (likes, follows) within this screen
    const [item, setItem] = React.useState(data);

    React.useEffect(() => {
        if (data) setItem(data);
    }, [data]);

    if (item) {
        /*
        console.log("DEBUG MemoryDetails:", {
            contextUser: user?._id,
            dataUser: item.user?._id,
            dataUploader: item.uploaderId?._id,
            isOwner: String(item.user?._id || item.uploaderId?._id) === String(user?._id)
        });
        */
    }

    if (!item) return null;

    const getOwnerId = (obj) => obj?.user?._id || obj?.user || obj?.uploaderId?._id || obj?.uploaderId;
    const ownerId = getOwnerId(item);
    const isOwner = user?._id && ownerId && String(ownerId) === String(user._id);

    const handleOptions = () => {
        Alert.alert(
            'Options',
            null,
            [
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
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
                                            await deleteMemory(item._id);
                                            navigation.goBack();
                                        } catch (error) {
                                            Alert.alert("Error", "Could not delete memory");
                                        }
                                    },
                                },
                            ]
                        );
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const toggleLike = async () => {
        // Optimistic update
        const wasLiked = item.isLiked;
        const newLikesCount = wasLiked ? item.likes - 1 : item.likes + 1;

        setItem(prev => ({
            ...prev,
            isLiked: !wasLiked,
            likes: newLikesCount
        }));

        try {
            await likeMemory(item._id);
        } catch (error) {
            console.error("Like error", error);
            // Revert if error? For now, keep it simple.
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {isOwner && (
                    <TouchableOpacity onPress={handleOptions} style={{ padding: 4 }}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <SocialPostCards
                    item={item}
                    type="memory"
                    isActive={false}
                    onPress={() => { }}
                    onLike={toggleLike}
                    onComment={() => navigation.navigate("Comments", { data: item, type: 'memory' })}
                    onShare={() => { }}
                    onProfilePress={() => {
                        const id = item.user?._id || item.uploaderId?._id;
                        if (id) navigation.navigate("UserProfile", { userId: id });
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MemoryDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
});
