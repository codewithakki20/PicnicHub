import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TEXT } from "../../theme/theme";

const OTP_LENGTH = 6;

const OtpScreen = ({ route }) => {
    const { email } = route.params;
    const { verify, resendOtp, loading } = useContext(AuthContext);
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const refs = useRef([]);

    useEffect(() => {
        refs.current[0]?.focus();
    }, []);

    const handleChange = (v, i) => {
        if (!/^\d?$/.test(v)) return;
        const copy = [...otp];
        copy[i] = v;
        setOtp(copy);
        if (v && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
    };

    const handleVerify = async () => {
        try {
            await verify(email, otp.join(""));
        } catch (e) {
            const msg = e.response?.data?.message || "Verification failed";
            Alert.alert("Error", msg);
        }
    };

    return (
        <AuthLayout
            title="Verify Email"
            subtitle={`Code sent to ${email}`}
        >
            <View style={styles.row}>
                {otp.map((d, i) => (
                    <TextInput
                        key={i}
                        ref={(r) => (refs.current[i] = r)}
                        style={styles.box}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={d}
                        onChangeText={(v) => handleChange(v, i)}
                        textContentType="oneTimeCode"
                        selectTextOnFocus
                    />
                ))}
            </View>

            <PrimaryButton
                title="Verify"
                loading={loading.verify}
                onPress={handleVerify}
            />

            <TouchableOpacity onPress={() => resendOtp(email)}>
                <Text style={styles.resend}>Resend OTP</Text>
            </TouchableOpacity>
        </AuthLayout>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: SPACING.xl,
    },
    box: {
        width: 45,
        height: 55,
        borderWidth: 1.4,
        borderColor: COLORS.border,
        borderRadius: RADIUS.sm,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.text,
        backgroundColor: "#fafafa",
    },
    resend: {
        ...TEXT.link,
        textAlign: "center",
        marginTop: SPACING.md,
    },
});
