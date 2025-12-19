import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MotiView, MotiText } from "moti";

import { createMemory, createStory } from "../../services/api";

const UploadMemoryScreen = ({ navigation, route }) => {
    const isStory = route.params?.isStory || false;

    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);

    /* ---------------- Permissions ---------------- */

    useEffect(() => {
        (async () => {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    /* ---------------- Pick Image ---------------- */

    const pickImage = async () => {
        if (loading) return;

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
                quality: 1,
                allowsEditing: true,
                aspect: isStory ? [9, 16] : [4, 5],
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

        if (!isStory && !title.trim()) {
            Alert.alert("Missing title", "Please add a title.");
            return;
        }

        if (!isStory && !caption.trim()) {
            Alert.alert("Missing caption", "Please add a caption.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            if (!isStory) {
                formData.append("title", title.trim());
            }

            formData.append("description", caption.trim());

            if (location.trim()) {
                formData.append("location", location.trim());
            }

            if (isStory) {
                formData.append("image", {
                    uri: image.uri,
                    name: "story.jpg",
                    type: "image/jpeg",
                });
                await createStory(formData);
            } else {
                formData.append("images", {
                    uri: image.uri,
                    name: "memory.jpg",
                    type: "image/jpeg",
                });
                await createMemory(formData);
            }

            navigation.goBack();
            Alert.alert(isStory ? "Story shared ✨" : "Memory created 🎉");
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    disabled={loading}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={28} color="#222" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    {isStory ? "Add to Story" : "New Memory"}
                </Text>

                <TouchableOpacity
                    disabled={loading || !image}
                    onPress={handleUpload}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#34C759" />
                    ) : (
                        <MotiText
                            from={{ opacity: 0.6 }}
                            animate={{ opacity: image ? 1 : 0.4 }}
                            style={styles.postText}
                        >
                            {isStory ? "Share" : "Post"}
                        </MotiText>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Image Picker */}
                    <TouchableOpacity
                        onPress={pickImage}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        <MotiView
                            from={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 300 }}
                            style={[
                                styles.imageBox,
                                isStory && { height: 420, aspectRatio: 9 / 16 },
                            ]}
                        >
                            {image ? (
                                <>
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={styles.imagePreview}
                                    />
                                    <TouchableOpacity
                                        disabled={loading}
                                        style={styles.removeImageBtn}
                                        onPress={() => setImage(null)}
                                    >
                                        <Ionicons
                                            name="close"
                                            size={18}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.placeholderCenter}>
                                    <Ionicons
                                        name="image-outline"
                                        size={42}
                                        color="#aaa"
                                    />
                                    <Text style={styles.placeholderText}>
                                        Tap to select photo
                                    </Text>
                                </View>
                            )}
                        </MotiView>
                    </TouchableOpacity>

                    {/* Title (for memories only) */}
                    {!isStory && (
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Memory title..."
                            placeholderTextColor="#999"
                            editable={!loading}
                            style={styles.titleInput}
                        />
                    )}

                    {/* Description */}
                    <TextInput
                        value={caption}
                        onChangeText={setCaption}
                        placeholder={
                            isStory
                                ? "Add a caption…"
                                : "Write a caption..."
                        }
                        placeholderTextColor="#999"
                        editable={!loading}
                        multiline
                        style={styles.descInput}
                    />

                    {/* Location */}
                    {!isStory && (
                        <View style={styles.locationRow}>
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color="#666"
                            />
                            <TextInput
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Add location"
                                placeholderTextColor="#999"
                                editable={!loading}
                                style={styles.locationInput}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadMemoryScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: "#eee",
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },

    postText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#34C759",
    },

    content: {
        padding: 20,
    },

    imageBox: {
        width: "100%",
        height: 260,
        backgroundColor: "#f2f2f2",
        borderRadius: 18,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        overflow: "hidden",
        marginBottom: 18,
    },

    placeholderCenter: {
        alignItems: "center",
    },

    placeholderText: {
        marginTop: 8,
        color: "#888",
        fontSize: 14,
    },

    imagePreview: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    removeImageBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.55)",
        padding: 6,
        borderRadius: 20,
    },

    titleInput: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginBottom: 14,
    },

    descInput: {
        minHeight: 90,
        maxHeight: 160,
        textAlignVertical: "top",
        fontSize: 16,
        color: "#333",
        marginBottom: 18,
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    locationInput: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
        flex: 1,
    },
});
