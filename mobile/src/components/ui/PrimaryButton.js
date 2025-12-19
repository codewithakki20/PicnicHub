import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { COLORS, RADIUS, SPACING } from "../../theme/theme";

const PrimaryButton = ({ title, loading, disabled, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                (disabled || loading) && { opacity: 0.6 },
            ]}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: "center",
        marginTop: SPACING.sm,
    },
    text: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
});
