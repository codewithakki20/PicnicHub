import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { CheckCircle, XCircle } from "lucide-react-native";
import { AuthContext } from "../../context/AuthContext";
import { verifyResetOtp } from "../../services/api";
import AuthLayout from "../../components/layout/AuthLayout";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

const schema = Yup.object().shape({
    otp: Yup.string().length(6).required(),
    password: Yup.string().min(6).required(),
});

const ResetPasswordScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const { resetPassword } = useContext(AuthContext);
    const [otpVerified, setOtpVerified] = useState(null);

    const handleOtpBlur = async (otp) => {
        if (otp?.length === 6) {
            try {
                await verifyResetOtp(email, otp);
                setOtpVerified(true);
            } catch (error) {
                setOtpVerified(false);
            }
        } else {
            setOtpVerified(null);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter OTP and new password"
        >
            <Formik
                initialValues={{ otp: "", password: "" }}
                validationSchema={schema}
                onSubmit={async (v) => {
                    await resetPassword(email, v.otp, v.password);
                    navigation.navigate("Login");
                }}
            >
                {({ handleChange, handleSubmit, values, setFieldValue }) => (
                    <>
                        <AppInput
                            label="OTP"
                            value={values.otp}
                            onChangeText={(text) => {
                                handleChange("otp")(text);
                                setOtpVerified(null);
                            }}
                            onBlur={() => handleOtpBlur(values.otp)}
                            keyboardType="number-pad"
                            wrapperStyle={
                                otpVerified === true
                                    ? { borderColor: "#22c55e" }
                                    : otpVerified === false
                                        ? { borderColor: "#ef4444" }
                                        : {}
                            }
                            rightIcon={
                                otpVerified === true ? (
                                    <CheckCircle size={20} color="#22c55e" />
                                ) : otpVerified === false ? (
                                    <XCircle size={20} color="#ef4444" />
                                ) : null
                            }
                        />
                        <AppInput
                            label="New Password"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            password
                        />
                        <PrimaryButton
                            title="Reset Password"
                            onPress={handleSubmit}
                        />
                    </>
                )}
            </Formik>
        </AuthLayout>
    );
};

export default ResetPasswordScreen;
