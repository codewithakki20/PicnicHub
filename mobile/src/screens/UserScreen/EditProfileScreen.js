import React, { useState, useContext, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { MotiView, MotiImage } from "moti";

import { AuthContext } from "../../context/AuthContext";
import { updateProfile, getAvatarUrl, BASE_URL } from "../../services/api";

/* ---------------- Small Components ---------------- */

const Input = ({ label, value, onChange, multiline, hint, placeholder }) => (
    <View style={styles.inputBlock}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
            value={value}
            onChangeText={onChange}
            multiline={multiline}
            maxLength={multiline ? 150 : undefined}
            placeholder={placeholder}
            placeholderTextColor="#999"
            style={[
                styles.input,
                multiline && styles.textArea,
            ]}
        />

        {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
);

const PickerField = ({ label, value, onChange, options }) => (
    <View style={styles.inputBlock}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
            >
                {options.map((opt, idx) => (
                    <Picker.Item
                        key={idx}
                        label={opt.label}
                        value={opt.value}
                    />
                ))}
            </Picker>
        </View>
    </View>
);

/* ---------------- Main Component ---------------- */

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUserState } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [college, setCollege] = useState(user?.college || "");
    const [branch, setBranch] = useState(user?.branch || "");
    const [course, setCourse] = useState(user?.course || "");
    const [year, setYear] = useState(user?.year || "");
    const [avatar, setAvatar] = useState(null);

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    /* ---------------- Changes ---------------- */

    const hasChanges = useMemo(
        () =>
            name.trim() !== (user?.name || "") ||
            bio.trim() !== (user?.bio || "") ||
            college !== (user?.college || "") ||
            branch !== (user?.branch || "") ||
            course.trim() !== (user?.course || "") ||
            year.trim() !== (user?.year || "") ||
            avatar !== null,
        [name, bio, college, branch, course, year, avatar]
    );

    /* ---------------- Image Picker ---------------- */

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission needed", "Allow access to update profile photo.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0]);
        }
    };

    /* ---------------- Save ---------------- */

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Invalid name", "Name cannot be empty.");
            return;
        }

        if (!hasChanges) return;

        try {
            setSaving(true);
            setSaved(false);

            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("bio", bio.trim());
            formData.append("college", college);
            formData.append("branch", branch);
            formData.append("course", course.trim());
            formData.append("year", year.trim());

            if (avatar) {
                const filename = avatar.uri.split("/").pop();
                const ext = filename?.split(".").pop();
                formData.append("image", {
                    uri: avatar.uri,
                    name: filename,
                    type: `image/${ext || "jpeg"}`,
                });
            }

            const res = await updateProfile(formData);
            const updatedUser = res?.data || res?.user;

            if (updatedUser) updateUserState(updatedUser);

            setSaved(true);
            setTimeout(() => navigation.goBack(), 600);
        } catch (e) {
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Edit Profile</Text>

                <TouchableOpacity
                    disabled={!hasChanges || saving}
                    onPress={handleSave}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#2E7D32" />
                    ) : saved ? (
                        <Ionicons name="checkmark-circle" size={26} color="#34C759" />
                    ) : (
                        <Text
                            style={[
                                styles.saveText,
                                !hasChanges && { opacity: 0.3 },
                            ]}
                        >
                            Save
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Avatar */}
                    <MotiView
                        from={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={styles.avatarCard}
                    >
                        <MotiImage
                            source={{
                                uri: (() => {
                                    if (avatar?.uri) return avatar.uri;

                                    const url = user?.avatarUrl;
                                    if (!url) return "https://via.placeholder.com/150";
                                    if (url.startsWith('http')) return url;

                                    const rootUrl = BASE_URL.replace(/\/api\/v1\/?$/, '');
                                    return `${rootUrl}${url.startsWith('/') ? '' : '/'}${url}`;
                                })()
                            }}
                            style={styles.avatar}
                        />

                        <TouchableOpacity onPress={pickImage}>
                            <Text style={styles.changePhoto}>Change profile photo</Text>
                        </TouchableOpacity>
                    </MotiView>

                    {/* Inputs */}
                    <Input label="Name" value={name} onChange={setName} />

                    <Input
                        label="Bio"
                        value={bio}
                        onChange={setBio}
                        multiline
                        hint={`${bio.length}/150`}
                    />

                    <PickerField
                        label="College"
                        value={college}
                        onChange={setCollege}
                        options={[
                            { label: "Select your college", value: "" },
                            { label: "CMDians", value: "CMDians" },
                            { label: "LCITians", value: "LCITians" },
                        ]}
                    />

                    <PickerField
                        label="Branch"
                        value={branch}
                        onChange={setBranch}
                        options={[
                            { label: "Select your branch", value: "" },
                            { label: "Science", value: "Science" },
                            { label: "Commerce", value: "Commerce" },
                            { label: "Arts", value: "Arts" },
                            { label: "Engineering", value: "Engineering" },
                            { label: "Pharmacy", value: "Pharmacy" },
                            { label: "MBA", value: "MBA" },
                            { label: "Others", value: "Others" },
                        ]}
                    />

                    <Input
                        label="Course"
                        value={course}
                        onChange={setCourse}
                        placeholder="e.g. B.Tech CSE, B.Sc Physics"
                    />

                    <Input
                        label="Year"
                        value={year}
                        onChange={setYear}
                        placeholder="e.g. 1st Year, 2nd Year"
                    />

                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },

    saveText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2E7D32",
    },

    content: {
        padding: 20,
    },

    avatarCard: {
        alignItems: "center",
        marginBottom: 30,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#eee",
        marginBottom: 12,
    },

    changePhoto: {
        color: "#2E7D32",
        fontWeight: "700",
        fontSize: 14,
    },

    inputBlock: {
        marginBottom: 22,
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 6,
    },

    input: {
        backgroundColor: "#f4f5f7",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: "#111",
    },

    textArea: {
        minHeight: 90,
        textAlignVertical: "top",
    },

    hint: {
        fontSize: 12,
        color: "#999",
        marginTop: 6,
        alignSelf: "flex-end",
    },

    pickerContainer: {
        backgroundColor: "#f4f5f7",
        borderRadius: 14,
        overflow: "hidden",
    },

    picker: {
        backgroundColor: "#f4f5f7",
        color: "#111",
    },
});
