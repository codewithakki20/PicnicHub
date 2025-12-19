import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Switch,
    Image,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { getAvatarUrl } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

const ProfileSettingsScreen = ({ navigation }) => {
    const { logout, user } = useContext(AuthContext);
    const { colors, isDark, toggleTheme } = useTheme();

    const [notifications, setNotifications] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    // Initial Load for notifications only
    useEffect(() => {
        (async () => {
            const nt = await AsyncStorage.getItem("notifications");
            if (nt !== null) setNotifications(nt === "true");
        })();
    }, []);

    const toggleNotifications = async (v) => {
        setNotifications(v);
        await AsyncStorage.setItem("notifications", String(v));
    };

    const handleLogout = () => {
        Alert.alert(
            "Log out?",
            "You’ll need to sign in again.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log out",
                    style: "destructive",
                    onPress: async () => {
                        setLoggingOut(true);
                        await logout();
                        setLoggingOut(false);
                    },
                },
            ]
        );
    };

    // Dynamic Styles for Text
    const textStyle = { color: colors.text };
    const subTextStyle = { color: colors.subText };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, textStyle]}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Profile Card */}
                <TouchableOpacity
                    style={[styles.profileCard, { backgroundColor: colors.card }]}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("EditProfile")}
                >
                    <Image
                        source={{
                            uri: getAvatarUrl(user?.avatarUrl || user?.avatar),
                        }}
                        style={styles.avatar}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={[styles.name, textStyle]}>{user?.name}</Text>
                        <Text style={[styles.email, subTextStyle]}>{user?.email}</Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color={colors.subText}
                    />
                </TouchableOpacity>

                {/* Sections */}
                <Card title="Account" colors={colors}>
                    <Row
                        icon="person-outline"
                        label="Edit Profile"
                        onPress={() => navigation.navigate("EditProfile")}
                        colors={colors}
                    />
                    <Row
                        icon="lock-closed-outline"
                        label="Change Password"
                        onPress={() => navigation.navigate("ChangePassword")}
                        noBorder
                        colors={colors}
                    />
                </Card>

                <Card title="Preferences" colors={colors}>
                    <Row
                        icon="moon-outline"
                        label="Dark Mode"
                        colors={colors}
                        right={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                thumbColor={isDark ? colors.primary : "#f4f4f4"}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                            />
                        }
                    />
                    <Row
                        icon="notifications-outline"
                        label="Notifications"
                        colors={colors}
                        right={
                            <Switch
                                value={notifications}
                                onValueChange={toggleNotifications}
                                thumbColor={notifications ? colors.primary : "#f4f4f4"}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                            />
                        }
                        noBorder
                    />
                </Card>

                <Card title="Support" colors={colors}>
                    <Row
                        icon="help-buoy-outline"
                        label="Help & Support"
                        onPress={() => navigation.navigate("HelpSupport")}
                        noBorder
                        colors={colors}
                    />
                </Card>

                <Card title="About" colors={colors}>
                    <Row
                        icon="document-text-outline"
                        label="Terms & Privacy"
                        onPress={() => navigation.navigate("TermsPrivacy")}
                        colors={colors}
                    />
                    <Row
                        icon="information-circle-outline"
                        label="App Version"
                        right={<Text style={[styles.version, { color: colors.subText }]}>v1.0.0</Text>}
                        noBorder
                        colors={colors}
                    />
                </Card>

                {/* Logout */}
                <TouchableOpacity
                    style={[styles.logout, { backgroundColor: colors.card }]}
                    onPress={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? (
                        <ActivityIndicator color="#FF3B30" />
                    ) : (
                        <Text style={styles.logoutText}>Log Out</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

/* ---------------- Reusable ---------------- */

const Card = ({ title, children, colors }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.subText }]}>{title}</Text>
        {children}
    </View>
);

const Row = ({ icon, label, onPress, right, noBorder, colors }) => (
    <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={[
            styles.row,
            { borderColor: colors.border },
            noBorder && { borderBottomWidth: 0 },
        ]}
    >
        <View style={styles.rowLeft}>
            {icon && (
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.text}
                    style={{ marginRight: 12 }}
                />
            )}
            <Text style={[styles.rowText, { color: colors.text }]}>{label}</Text>
        </View>

        {right ||
            (onPress && (
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.subText}
                />
            ))}
    </TouchableOpacity>
);

export default ProfileSettingsScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        margin: 16,
        borderRadius: 16,
        elevation: 3,
    },

    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 14,
        backgroundColor: "#eee",
    },

    name: { fontSize: 16, fontWeight: "700" },
    email: { fontSize: 13, marginTop: 2 },

    card: {
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        overflow: "hidden",
    },

    cardTitle: {
        fontSize: 13,
        marginLeft: 16,
        marginTop: 14,
        marginBottom: 6,
        fontWeight: "600",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },

    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    rowText: { fontSize: 16 },

    version: {},

    logout: {
        marginHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: "center",
    },

    logoutText: {
        color: "#FF3B30",
        fontWeight: "700",
        fontSize: 16,
    },
});
