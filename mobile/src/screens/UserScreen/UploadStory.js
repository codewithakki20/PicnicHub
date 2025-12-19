import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MotiView, MotiText } from "moti";

import { createStory } from "../../services/api";

const UploadStoryScreen = ({ navigation }) => {
    const isStory = true;

    const [desc, setDesc] = useState("");
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
                quality: 1,
                allowsEditing: true,
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
            formData.append("description", desc);

            formData.append("image", {
                uri: image.uri,
                name: "story.jpg",
                type: "image/jpeg",
            });

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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color="#222" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Add to Story</Text>

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
                            style={[
                                styles.postText,
                                !image && { color: "#aaa" },
                            ]}
                        >
                            Share
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
                    >
                        <MotiView
                            from={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 300 }}
                            style={styles.imageBox}
                        >
                            {image ? (
                                <>
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={styles.imagePreview}
                                    />

                                    <TouchableOpacity
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

                    {/* Caption */}
                    <TextInput
                        value={desc}
                        onChangeText={setDesc}
                        placeholder="Add a caption…"
                        placeholderTextColor="#999"
                        multiline
                        style={styles.descInput}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadStoryScreen;

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
        height: 420,
        aspectRatio: 9 / 16,
        backgroundColor: "#f2f2f2",
        borderRadius: 18,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        overflow: "hidden",
        marginBottom: 16,
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

    descInput: {
        minHeight: 80,
        maxHeight: 140,
        textAlignVertical: "top",
        fontSize: 16,
        color: "#333",
    },
});
