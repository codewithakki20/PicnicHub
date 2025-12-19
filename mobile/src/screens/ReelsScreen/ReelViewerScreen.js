import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { deleteReel, followUser } from '../../services/api';

const { width, height } = Dimensions.get('window');

const ReelViewerScreen = ({ route, navigation }) => {
    const { data } = route.params || {};
    const { user } = useContext(AuthContext);
    const [muted, setMuted] = React.useState(false);

    // Expo Video Player
    const videoSource = data?.videoUrl ?? '';
    const player = useVideoPlayer(videoSource, player => {
        if (videoSource) {
            player.loop = true;
            player.muted = muted;
            player.play();
        }
    });

    React.useEffect(() => {
        if (player) {
            player.muted = muted;
            player.volume = muted ? 0 : 1;
        }
    }, [muted, player]);

    if (!data) return null;

    const getOwnerId = (item) => item?.user?._id || item?.user || item?.uploaderId?._id || item?.uploaderId;
    const ownerId = getOwnerId(data);
    const isOwner = user?._id && ownerId && String(ownerId) === String(user._id);

    // const { followUser } = require('../../services/api'); // Moved to imports
    const [isFollowing, setIsFollowing] = React.useState(
        data?.user?.isFollowing || data?.uploaderId?.isFollowing || false
    );

    const handleFollow = async () => {
        const targetId = ownerId;
        if (!targetId) return;

        setIsFollowing(prev => !prev); // Optimistic

        try {
            await followUser(targetId);
        } catch (error) {
            console.log("Follow error", error);
            setIsFollowing(prev => !prev); // Revert
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Reel",
            "Are you sure you want to delete this reel?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteReel(data._id);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert("Error", "Could not delete reel");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <VideoView
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={false}
            />

            <SafeAreaView style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.rightActions}>
                        <TouchableOpacity
                            onPress={() => setMuted(m => !m)}
                            style={[styles.iconButton, { marginRight: 8 }]}
                        >
                            <Ionicons
                                name={muted ? "volume-mute" : "volume-high"}
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        {!isOwner && (
                            <TouchableOpacity
                                onPress={handleFollow}
                                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                            >
                                <Text style={[styles.followText, isFollowing && styles.followingText]}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {isOwner && (
                            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default ReelViewerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        width: width,
        height: height,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center', // Align items vertically
    },
    iconButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    followBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(46, 125, 50, 0.8)', // Semi-transparent green
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2E7D32',
    },
    followingBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: '#fff',
    },
    followText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    followingText: {
        color: '#fff',
    }
});
