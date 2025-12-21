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
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from 'expo-video';
import { MotiView } from "moti";
import { createReel } from "../../services/api";
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

const MAX_DURATION = 60; // seconds

const UploadReelScreen = ({ navigation }) => {
    const videoRef = useRef(null);

    const [video, setVideo] = useState(null);
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
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

        if (!caption.trim()) {
            Alert.alert("Add caption", "Reels need a short caption.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("caption", caption.trim());

            if (location) {
                formData.append("locationId", location);
            }

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
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity disabled={loading} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Reel</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Video Picker Area */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={pickVideo}
                    disabled={loading}
                >
                    <MotiView
                        from={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.uploadCard}
                    >
                        {!video ? (
                            <View style={styles.emptyState}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="cloud-upload-outline" size={32} color="#5B7083" />
                                </View>
                                <Text style={styles.uploadTitle}>Upload Video</Text>
                                <Text style={styles.uploadDesc}>
                                    Tap to browse. MP4 or MOV up to 60s.
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.videoContainer}>
                                <VideoPreview
                                    uri={video.uri}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => setVideo(null)}
                                    style={styles.removeBtn}
                                >
                                    <Ionicons name="close" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </MotiView>
                </TouchableOpacity>

                {/* Caption Section */}
                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <Ionicons name="sparkles-outline" size={18} color="#2E7D32" />
                        <Text style={styles.label}>Caption</Text>
                    </View>
                    <TextInput
                        placeholder="Write a catchy caption about your reel..."
                        placeholderTextColor="#9CA3AF"
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                        editable={!loading}
                        style={styles.captionInput}
                    />
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                    <LocationSelect
                        label={
                            <View style={styles.labelRow}>
                                <Ionicons name="location-outline" size={18} color="#2E7D32" />
                                <Text style={styles.label}>Location</Text>
                            </View>
                        }
                        value={location}
                        onChange={setLocation}
                        placeholder="Search for a location..."
                    />
                </View>

            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.shareBtn, (!video || loading) && styles.disabledBtn]}
                    onPress={handleUpload}
                    disabled={!video || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="film-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.shareBtnText}>Share Reel</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default UploadReelScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB", // Slightly off-white background
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },

    content: {
        padding: 20,
        paddingBottom: 100,
    },

    uploadCard: {
        height: 300,
        backgroundColor: "#F0F5F9",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E1E8ED",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },

    emptyState: {
        alignItems: "center",
        padding: 20,
    },

    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    uploadTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },

    uploadDesc: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 20,
        maxWidth: 200,
    },

    videoContainer: {
        width: "100%",
        height: "100%",
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

    removeBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 6,
        borderRadius: 20,
    },

    section: {
        marginBottom: 24,
    },

    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
        marginLeft: 6,
    },

    captionInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#1F2937",
        minHeight: 120,
        textAlignVertical: "top",
    },

    locationInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
    },

    locationInput: {
        flex: 1,
        fontSize: 16,
        color: "#1F2937",
        marginRight: 10,
    },

    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },

    shareBtn: {
        backgroundColor: "#6C757D", // Matching the grey-ish button in snippet or maybe dark? The snippet shows grey 'Share Reel'.
        // Actually, user snippet shows a grey button. Usually primary actions are brand color. 
        // But let's stick to the visual: Dark Grey / Bluish Grey.
        backgroundColor: "#6DA7C3", // Light blueish?
        // Let's use a nice slate grey/blue.
        backgroundColor: "#7c8ca1",
        // Wait, the screenshot shows a Dark Grey button.
        backgroundColor: "#5a6b7c",
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    disabledBtn: {
        backgroundColor: "#D1D5DB",
        elevation: 0,
    },

    shareBtnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
