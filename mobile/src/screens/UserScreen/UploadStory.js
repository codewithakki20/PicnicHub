import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MotiView } from "moti";

import { createStory } from "../../services/api";

const UploadStoryScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ---------------- Permissions ---------------- */

    useEffect(() => {
        (async () => {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    /* ---------------- Image Picker ---------------- */

    const pickImage = async () => {
        if (!hasPermission) {
            Alert.alert(
                "Permission required",
                "Please allow access to your photos."
            );
            return;
        }

        try {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.8,
                allowsEditing: true, // Stories are usually full screen, but editing allows cropping
                aspect: [9, 16],
            });

            if (!res.canceled) {
                setImage(res.assets[0]);
            }
        } catch (e) {
            console.log("Image picker error:", e);
            Alert.alert("Error", "Could not open image picker.");
        }
    };

    /* ---------------- Upload ---------------- */

    const handleUpload = async () => {
        if (!image || loading) return;

        setLoading(true);

        try {
            const formData = new FormData();
            // Story model only expects mediaUrl and mediaType. 
            // The backend upload middleware handles the file.

            formData.append("image", {
                uri: image.uri,
                name: "story.jpg",
                type: "image/jpeg",
            });
            formData.append("mediaType", "image");

            await createStory(formData);

            navigation.goBack();
            Alert.alert("Story shared ✨");
        } catch (e) {
            console.log("Upload error:", e);
            Alert.alert("Upload failed", "Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.closeBtn}
                >
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add to Story</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {image ? (
                    // PREVIEW STATE
                    <View style={styles.previewContainer}>
                        <Image
                            source={{ uri: image.uri }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.retryBtn}
                            onPress={() => setImage(null)}
                        >
                            <Ionicons name="reload" size={20} color="#fff" />
                            <Text style={styles.retryText}>Replace</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // EMPTY STATE
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={pickImage}
                        style={styles.uploadArea}
                    >
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.circleIcon}
                        >
                            <Ionicons name="image-outline" size={40} color="#89CFF0" />
                        </MotiView>

                        <Text style={styles.uploadTitle}>Upload Photo</Text>
                        <Text style={styles.uploadSubtitle}>
                            Tap to browse in files
                        </Text>

                        <View style={styles.pill}>
                            <Text style={styles.pillText}>JPG, PNG • Max 10MB</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    disabled={loading || !image}
                    onPress={handleUpload}
                    style={[
                        styles.mainBtn,
                        (!image || loading) && styles.disabledBtn
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="share-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.mainBtnText}>Share to Story</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default UploadStoryScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1A1A1A",
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    // Empty State
    uploadArea: {
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },

    circleIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#222",
    },

    uploadTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 8,
    },

    uploadSubtitle: {
        fontSize: 14,
        color: "#888",
        marginBottom: 24,
    },

    pill: {
        backgroundColor: "#1A1A1A",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#333",
    },

    pillText: {
        color: "#ccc",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    // Preview
    previewContainer: {
        width: '100%',
        height: '80%',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        position: 'relative',
    },

    previewImage: {
        width: '100%',
        height: '100%',
    },

    retryBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },

    retryText: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 12,
        fontWeight: '600',
    },

    // Footer
    footer: {
        padding: 20,
        paddingBottom: 20,
    },

    mainBtn: {
        backgroundColor: "#1A1A1A",
        height: 56,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#333",
    },

    disabledBtn: {
        opacity: 0.5,
    },

    mainBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
