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

import { updateMemory, getAvatarUrl } from "../../services/api";
import LocationSelect from "../../components/LocationSelect";

const EditMemoryScreen = ({ navigation, route }) => {
    const { memory } = route.params || {};

    // Fixed duplicate declaration issue
    const [title, setTitle] = useState(memory?.title || "");
    const [caption, setCaption] = useState(memory?.description || "");
    const [year, setYear] = useState(memory?.year ? String(memory.year) : new Date().getFullYear().toString());
    const [tags, setTags] = useState(memory?.tags ? (Array.isArray(memory.tags) ? memory.tags.join(', ') : memory.tags) : "");
    const [location, setLocation] = useState(memory?.locationId?._id || memory?.locationId || memory?.location?._id || memory?.location || "");
    const [image, setImage] = useState(memory?.imageUrl ? { uri: getAvatarUrl(memory.imageUrl), isExisting: true } : null);

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
                aspect: [4, 5],
            });

            if (!res.canceled) {
                setImage({ ...res.assets[0], isExisting: false });
            }
        } catch (e) {
            console.log("Image picker error:", e);
            Alert.alert("Error", "Could not open image picker.");
        }
    };

    /* ---------------- Update ---------------- */

    const handleUpdate = async () => {
        if (loading) return;

        if (!title.trim()) {
            Alert.alert("Missing title", "Please add a title.");
            return;
        }

        if (!caption.trim()) {
            Alert.alert("Missing caption", "Please add a caption.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("description", caption.trim());
            formData.append("year", year);
            formData.append("tags", tags);
            if (location.trim()) {
                formData.append("locationId", location.trim());
            }

            // Only append image if it's new (not existing)
            if (image && !image.isExisting) {
                formData.append("images", {
                    uri: image.uri,
                    name: "memory.jpg",
                    type: "image/jpeg",
                });
            }

            await updateMemory(memory._id, formData);

            navigation.goBack();
            Alert.alert("Memory updated 🎉");
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    disabled={loading}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={28} color="#222" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Edit Memory</Text>

                <TouchableOpacity
                    disabled={loading}
                    onPress={handleUpdate}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#34C759" />
                    ) : (
                        <MotiText
                            from={{ opacity: 0.6 }}
                            animate={{ opacity: 1 }}
                            style={styles.postText}
                        >
                            Save
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
                            style={styles.imageBox}
                        >
                            {image ? (
                                <>
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={styles.imagePreview}
                                    />
                                    <View style={styles.editBadge}>
                                        <Ionicons name="pencil" size={16} color="#fff" />
                                    </View>
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

                    {/* Title */}
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Memory title..."
                        placeholderTextColor="#999"
                        editable={!loading}
                        style={styles.titleInput}
                    />

                    {/* Description */}
                    <TextInput
                        value={caption}
                        onChangeText={setCaption}
                        placeholder="Write a caption..."
                        placeholderTextColor="#999"
                        editable={!loading}
                        multiline
                        style={styles.descInput}
                    />

                    {/* Year */}
                    <View style={styles.inputRow}>
                        <Ionicons name="calendar-outline" size={20} color="#666" />
                        <TextInput
                            value={year}
                            onChangeText={setYear}
                            placeholder="Year (e.g. 2025)"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            editable={!loading}
                            style={styles.locationInput}
                        />
                    </View>

                    {/* Tags */}
                    <View style={styles.inputRow}>
                        <Ionicons name="pricetags-outline" size={20} color="#666" />
                        <TextInput
                            value={tags}
                            onChangeText={setTags}
                            placeholder="Tags (comma separated)..."
                            placeholderTextColor="#999"
                            editable={!loading}
                            style={styles.locationInput}
                        />
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

export default EditMemoryScreen;

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

    editBadge: {
        position: "absolute",
        bottom: 12,
        right: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 8,
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

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#eee",
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
