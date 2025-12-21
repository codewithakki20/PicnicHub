import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
    LogBox,
    Image,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MotiView, MotiText } from "moti";
import { createMemory } from "../../services/api";
import LocationSelect from "../../components/LocationSelect";

// Ignore specific warnings if necessary
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

const UploadMemoryScreen = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState("");

    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([]);

    const [loading, setLoading] = useState(false);

    /* ---------------- Permissions ---------------- */
    const [permission, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    useEffect(() => {
        if (!permission) requestPermission();
    }, []);

    /* ---------------- Pickers ---------------- */

    const pickImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], // Use string directly
                allowsMultipleSelection: true,
                selectionLimit: 10,
                quality: 0.8,
            });

            if (!result.canceled) {
                setSelectedImages(prev => [...prev, ...result.assets]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const pickVideos = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'], // Use string directly
                allowsMultipleSelection: true,
                selectionLimit: 5,
                quality: 1, // Videos usually don't have quality option in same way, but ok
            });

            if (!result.canceled) {
                setSelectedVideos(prev => [...prev, ...result.assets]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const removeImage = (uri) => {
        setSelectedImages(prev => prev.filter(a => a.uri !== uri));
    };

    const removeVideo = (uri) => {
        setSelectedVideos(prev => prev.filter(a => a.uri !== uri));
    };

    /* ---------------- Upload ---------------- */

    const handleCreate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Missing Fields", "Please add a title and description.");
            return;
        }

        if (selectedImages.length === 0 && selectedVideos.length === 0) {
            Alert.alert("No Media", "Please add at least one photo or video.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("year", year);
            formData.append("tags", tags);
            if (location) formData.append("location", location);
            // User requested UI. We implement UI.

            // Append Images
            selectedImages.forEach((img, index) => {
                formData.append("images", {
                    uri: img.uri,
                    name: `image_${index}.jpg`,
                    type: "image/jpeg",
                });
            });

            // Append Videos
            selectedVideos.forEach((vid, index) => {
                formData.append("videos", {
                    uri: vid.uri,
                    name: `video_${index}.mp4`,
                    type: "video/mp4", // Improve mime type detection if needed
                });
            });

            await createMemory(formData);

            navigation.goBack();
            Alert.alert("Success", "Memory created successfully! 🎉");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to create memory. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Memory</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Media Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="share-outline" size={20} color="#333" />
                        <Text style={styles.cardTitle}>Media</Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.mediaButtons}>
                        <TouchableOpacity style={styles.mediaBtn} onPress={pickImages}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="image-outline" size={24} color="#1565C0" />
                            </View>
                            <View>
                                <Text style={styles.mediaBtnTitle}>Add Photos</Text>
                                <Text style={styles.mediaBtnSub}>JPG, PNG</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.mediaSpacer} />

                        <TouchableOpacity style={styles.mediaBtn} onPress={pickVideos}>
                            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="videocam-outline" size={24} color="#2E7D32" />
                            </View>
                            <View>
                                <Text style={styles.mediaBtnTitle}>Add Videos</Text>
                                <Text style={styles.mediaBtnSub}>MP4, MOV</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Previews */}
                    {(selectedImages.length > 0 || selectedVideos.length > 0) && (
                        <View style={styles.previewGrid}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {selectedImages.map((img, i) => (
                                    <View key={`img-${i}`} style={styles.previewItem}>
                                        <Image source={{ uri: img.uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => removeImage(img.uri)}
                                        >
                                            <Ionicons name="close" size={12} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {selectedVideos.map((vid, i) => (
                                    <View key={`vid-${i}`} style={styles.previewItem}>
                                        <View style={[styles.previewImage, styles.videoPlaceholder]}>
                                            <Ionicons name="play" size={24} color="#fff" />
                                        </View>
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => removeVideo(vid.uri)}
                                        >
                                            <Ionicons name="close" size={12} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Details Section */}
                <View style={styles.card}>
                    {/* Title */}
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Give your memory a name..."
                        placeholderTextColor="#999"
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tell the story behind this moment..."
                        placeholderTextColor="#999"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    {/* Year */}
                    <Text style={styles.label}>
                        <Ionicons name="calendar-outline" size={16} color="#333" /> Year
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2025"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={year}
                        onChangeText={setYear}
                    />

                    {/* Location */}
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

                    {/* Tags */}
                    <Text style={styles.label}>
                        <Ionicons name="pricetag-outline" size={16} color="#333" /> Tags
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Add tags..."
                        placeholderTextColor="#999"
                        value={tags}
                        onChangeText={setTags}
                    />
                </View>

                {/* Footer Button */}
                <TouchableOpacity
                    style={styles.createBtn}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="sparkles-outline" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                            <Text style={styles.createBtnText}>Create Memory</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default UploadMemoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },
    scrollContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    mediaButtons: {
        // flexDirection: 'column',
        gap: 12,
    },
    mediaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    mediaSpacer: {
        height: 12,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    mediaBtnTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    mediaBtnSub: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    previewGrid: {
        marginTop: 16,
        flexDirection: 'row',
    },
    previewItem: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 10,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    videoPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
    },
    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    input: {
        backgroundColor: '#F7F9FC',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    inputWithIcon: {
        backgroundColor: '#F7F9FC',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    createBtn: {
        backgroundColor: '#111827', // Dark navy/black like mockup
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#111827",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    createBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
