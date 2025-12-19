import React from "react";
import {
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING, TEXT } from "../../theme/theme";

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.wrapper}>
                    <Image
                        source={require("../../../assets/logo1.png")}
                        style={styles.logo}
                    />

                    <Text style={TEXT.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

                    <View style={styles.content}>{children}</View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    wrapper: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
    },
    logo: {
        width: 110,
        height: 110,
        alignSelf: "center",
        resizeMode: "contain",
        marginBottom: SPACING.sm,
    },
    subtitle: {
        ...TEXT.subtitle,
        textAlign: "center",
        marginTop: SPACING.xs,
    },
    content: {
        marginTop: SPACING.lg,
    },
});
