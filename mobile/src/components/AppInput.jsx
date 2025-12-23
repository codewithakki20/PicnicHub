import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { COLORS, RADIUS, SPACING } from "../theme/theme";

const AppInput = ({
    label,
    error,
    password = false,
    style,
    inputStyle,
    wrapperStyle,
    rightIcon,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {/* Label */}
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Input */}
            <View
                style={[
                    styles.inputWrapper,
                    error && styles.errorBorder,
                    wrapperStyle,
                ]}
            >
                <TextInput
                    style={[styles.input, inputStyle]}
                    secureTextEntry={password && !showPassword}
                    placeholderTextColor={COLORS.muted}
                    {...props}
                />

                {rightIcon && (
                    <View style={styles.iconBtn}>
                        {rightIcon}
                    </View>
                )}

                {password && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(p => !p)}
                        activeOpacity={0.7}
                        style={styles.iconBtn}
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={COLORS.muted} />
                        ) : (
                            <Eye size={20} color={COLORS.muted} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Error */}
            {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default AppInput;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },

    label: {
        marginBottom: 6,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.4,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: "#FAFAFA",
        minHeight: 52,
    },

    errorBorder: {
        borderColor: COLORS.error,
    },

    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        color: COLORS.text,
    },

    iconBtn: {
        paddingHorizontal: SPACING.sm,
    },

    error: {
        marginTop: 4,
        fontSize: 13,
        color: COLORS.error,
    },
});
