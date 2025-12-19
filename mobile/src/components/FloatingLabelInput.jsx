import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { MotiView, useAnimationState } from "moti";
import { Eye, EyeOff } from "lucide-react-native";

const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    placeholder = "",
    keyboardType = "default",
    secureTextEntry = false,
    error,
    onBlur,
    onFocus,
    autoCapitalize = "none",
    inputStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const labelState = useAnimationState({
        initial: {
            translateY: 0,
            scale: 1,
            color: "#777",
        },
        floated: {
            translateY: -24,
            scale: 0.85,
            color: "#2E7D32",
        },
        error: {
            translateY: -24,
            scale: 0.85,
            color: "#ff4d4d",
        },
    });

    useEffect(() => {
        if (error) {
            labelState.transitionTo("error");
        } else if (isFocused || value?.length > 0) {
            labelState.transitionTo("floated");
        } else {
            labelState.transitionTo("initial");
        }
    }, [isFocused, value, error]);

    const resolvedSecure = secureTextEntry && !showPassword;

    return (
        <View style={styles.container}>
            {/* Floating Label */}
            <MotiView
                state={labelState}
                style={styles.labelWrapper}
                transition={{ type: "timing", duration: 180 }}
            >
                <Text style={styles.labelText}>{label}</Text>
            </MotiView>

            {/* Input */}
            <View
                style={[
                    styles.inputRow,
                    error && styles.errorBorder,
                    isFocused && styles.focusedBorder,
                ]}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, inputStyle]}
                    placeholder={isFocused ? placeholder : ""}
                    placeholderTextColor="#bbb"
                    keyboardType={keyboardType}
                    secureTextEntry={resolvedSecure}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    {...props}
                />

                {/* Password toggle */}
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword((p) => !p)}
                        style={styles.iconBtn}
                        activeOpacity={0.7}
                    >
                        {showPassword ? (
                            <EyeOff size={18} color="#666" />
                        ) : (
                            <Eye size={18} color="#666" />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Error */}
            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default FloatingLabelInput;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },

    labelWrapper: {
        position: "absolute",
        left: 16,
        top: 18,
        zIndex: 10,
    },

    labelText: {
        fontSize: 16,
        fontWeight: "600",
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },

    focusedBorder: {
        borderColor: "#2E7D32",
    },

    errorBorder: {
        borderColor: "#ff4d4d",
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#111",
        paddingVertical: 12,
    },

    iconBtn: {
        padding: 8,
    },

    errorText: {
        marginTop: 6,
        fontSize: 13,
        color: "#ff4d4d",
    },
});
