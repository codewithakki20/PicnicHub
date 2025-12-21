import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Alert,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from 'expo-video';
import { MotiView } from "moti";
import { updateReel, getAvatarUrl } from "../../services/api";
import LocationSelect from "../../components/LocationSelect";

const VideoPreview = ({ uri, isPlaying, setIsPlaying }) => {
    const player = useVideoPlayer(uri, player => {
        player.loop = true;
    });

    useEffect(() => {
        if (isPlaying) {
            player.play();
        } else {
            player.pause();
        }
    }, [isPlaying, player]);

    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setIsPlaying(!isPlaying)}
        >
            <VideoView
                player={player}
                style={styles.videoPreview}
                contentFit="cover"
                nativeControls={false}
            />

            {!isPlaying && (
                <View style={styles.playOverlay}>
                    <Ionicons
                        name="play-circle"
                        size={54}
                        color="rgba(255,255,255,0.9)"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const EditReelScreen = ({ navigation, route }) => {
    const { reel } = route.params || {};

    const [caption, setCaption] = useState(reel?.caption || "");
    const [location, setLocation] = useState(reel?.locationId?._id || reel?.location || "");
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Use existing video URL. Not allowing video replacement for now to keep it simple.
    // Ensure we handle full URLs properly
    const videoUri = reel?.videoUrl ? getAvatarUrl(reel.videoUrl) : null;

    /* ---------------- Update ---------------- */

    const handleUpdate = async () => {
        if (loading) return;

        if (!caption.trim()) {
            Alert.alert("Add caption", "Reels need a short caption.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("caption", caption.trim());
            if (location) formData.append("location", location);
            // No video file appended, so backend should keep existing video.

            await updateReel(reel._id, formData);

            navigation.goBack();
            Alert.alert("Reel updated 🎉");
        } catch (e) {
            console.log("Update error:", e);
            Alert.alert("Update failed", "Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Render ---------------- */

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity disabled={loading} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Edit Reel</Text>

                <TouchableOpacity
                    disabled={loading}
                    onPress={handleUpdate}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#2E7D32" />
                    ) : (
                        <Text style={styles.postText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Video Preview (Read Only) */}
                <MotiView
                    from={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 300 }}
                    style={styles.videoBox}
                >
                    {videoUri ? (
                        <VideoPreview
                            uri={videoUri}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                        />
                    ) : (
                        <View style={styles.placeholderCenter}>
                            <Ionicons
                                name="videocam-off-outline"
                                size={48}
                                color="#777"
                            />
                            <Text style={styles.placeholderText}>
                                Video not available
                            </Text>
                        </View>
                    )}
                </MotiView>

                {/* Caption */}
                <View style={styles.inputBox}>
                    <TextInput
                        placeholder="Write a caption…"
                        placeholderTextColor="#999"
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                        editable={!loading}
                        style={styles.input}
                    />
                </View>

                {/* Location */}
                <View style={[styles.inputBox, { marginTop: 15 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="location-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#999' }}>Location</Text>
                    </View>
                    <LocationSelect
                        label={
                            <Text style={styles.label}>
                                <Ionicons name="location-outline" size={16} color="#333" /> Location
                            </Text>
                        }
                        value={location}
                        onChange={setLocation}
                        placeholder="Search for a location..."
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditReelScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 18,
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },

    postText: {
        fontSize: 16,
        color: "#2E7D32",
        fontWeight: "600",
    },

    content: {
        padding: 20,
    },

    videoBox: {
        height: 360,
        backgroundColor: "#111",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#222",
        justifyContent: "center",
        marginBottom: 20,
    },

    placeholderCenter: {
        alignItems: "center",
    },

    placeholderText: {
        color: "#777",
        marginTop: 8,
    },

    videoPreview: {
        width: "100%",
        height: "100%",
    },

    playOverlay: {
        position: "absolute",
        alignSelf: "center",
        top: "45%",
    },

    inputBox: {
        backgroundColor: "#111",
        padding: 16,
        borderRadius: 16,
    },

    input: {
        color: "#fff",
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },

    simpleInput: {
        color: "#fff",
        fontSize: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    }
});
