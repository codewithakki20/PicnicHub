import React, { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
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
                {({ handleChange, handleSubmit, values }) => (
                    <>
                        <AppInput
                            label="OTP"
                            value={values.otp}
                            onChangeText={handleChange("otp")}
                            keyboardType="number-pad"
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
