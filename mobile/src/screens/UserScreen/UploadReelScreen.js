import React, { useState, useEffect, useRef } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from 'expo-video';
import { MotiView } from "moti";
import { createReel } from "../../services/api";

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

const MAX_DURATION = 60; // seconds

const UploadReelScreen = ({ navigation }) => {
    const videoRef = useRef(null);

    const [video, setVideo] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    /* ---------------- Permissions ---------------- */

    useEffect(() => {
        (async () => {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    /* ---------------- Pick Video ---------------- */

    const pickVideo = async () => {
        if (loading) return;

        if (!hasPermission) {
            Alert.alert(
                "Permission required",
                "Please allow access to your videos."
            );
            return;
        }

        try {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 1,
            });

            if (!res.canceled) {
                const asset = res.assets[0];

                if (asset.duration && asset.duration > MAX_DURATION * 1000) {
                    Alert.alert(
                        "Video too long",
                        "Reels must be 60 seconds or less."
                    );
                    return;
                }

                setVideo(asset);
                setIsPlaying(false);
            }
        } catch (e) {
            console.log("Video picker error:", e);
            Alert.alert("Error", "Could not open video library.");
        }
    };

    /* ---------------- Upload ---------------- */

    const handleUpload = async () => {
        if (!video || loading) return;

        if (!description.trim()) {
            Alert.alert("Add caption", "Reels need a short caption.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("description", description.trim());
            formData.append("video", {
                uri: video.uri,
                type: "video/mp4",
                name: "reel.mp4",
            });

            await createReel(formData);

            navigation.goBack();
            Alert.alert("Reel shared 🎉");
        } catch (e) {
            console.log("Upload error:", e);
            Alert.alert("Upload failed", "Please try again.");
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

                <Text style={styles.headerTitle}>New Reel</Text>

                <TouchableOpacity
                    disabled={!video || loading}
                    onPress={handleUpload}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#2E7D32" />
                    ) : (
                        <Text
                            style={[
                                styles.postText,
                                (!video || loading) && { opacity: 0.4 },
                            ]}
                        >
                            Share
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Video Picker */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={pickVideo}
                    disabled={loading}
                >
                    <MotiView
                        from={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 300 }}
                        style={styles.videoBox}
                    >
                        {!video ? (
                            <View style={styles.placeholderCenter}>
                                <Ionicons
                                    name="videocam-outline"
                                    size={48}
                                    color="#777"
                                />
                                <Text style={styles.placeholderText}>
                                    Tap to select a video
                                </Text>
                            </View>
                        ) : (
                            <>
                                <VideoPreview
                                    uri={video.uri}
                                    videoRef={videoRef}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />

                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => setVideo(null)}
                                    style={styles.removeBtn}
                                >
                                    <Ionicons
                                        name="close"
                                        size={20}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </MotiView>
                </TouchableOpacity>

                {/* Caption */}
                <View style={styles.inputBox}>
                    <TextInput
                        placeholder="Write a caption…"
                        placeholderTextColor="#999"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        editable={!loading}
                        style={styles.input}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadReelScreen;

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

    removeBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 6,
        borderRadius: 20,
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
        marginTop: 20,
    },

    input: {
        color: "#fff",
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },
});
