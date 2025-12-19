import React, { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/ui/PrimaryButton";

const schema = Yup.object().shape({
    email: Yup.string().email().required(),
});

const ForgotPasswordScreen = ({ navigation }) => {
    const { forgotPassword } = useContext(AuthContext);

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email to reset password"
        >
            <Formik
                initialValues={{ email: "" }}
                validationSchema={schema}
                onSubmit={async (v) => {
                    await forgotPassword(v.email);
                    navigation.navigate("ResetPassword", { email: v.email });
                }}
            >
                {({ handleChange, handleSubmit, values }) => (
                    <>
                        <AppInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <PrimaryButton
                            title="Send Reset OTP"
                            onPress={handleSubmit}
                        />
                    </>
                )}
            </Formik>
        </AuthLayout>
    );
};

export default ForgotPasswordScreen;
