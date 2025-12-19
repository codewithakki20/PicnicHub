import React, { useContext } from "react";
import { Text, Alert, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AuthLayout from "../../components/layout/AuthLayout";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { AuthContext } from "../../context/AuthContext";
import { TEXT, COLORS } from "../../theme/theme";

const schema = Yup.object({
    email: Yup.string()
        .trim()
        .email("Enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
    const { login, loading } = useContext(AuthContext);

    return (
        <AuthLayout
            title="Welcome back 👋"
            subtitle="Log in to continue your journey"
        >
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={schema}
                validateOnMount
                onSubmit={async (v) => {
                    try {
                        const email = v.email.trim().toLowerCase();
                        await login(email, v.password);
                    } catch (e) {
                        const msg =
                            e.response?.data?.message ||
                            "Something went wrong. Try again.";
                        Alert.alert("Login failed", msg);
                    }
                }}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isValid,
                }) => (
                    <>
                        <AppInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={touched.email && errors.email}
                        />

                        <AppInput
                            label="Password"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            password
                            error={touched.password && errors.password}
                        />

                        <Text
                            style={[
                                TEXT.link,
                                { fontSize: 14, marginBottom: 16, alignSelf: "flex-end" },
                            ]}
                            onPress={() => navigation.navigate("ForgotPassword")}
                        >
                            Forgot password?
                        </Text>

                        <PrimaryButton
                            title="Log In"
                            loading={loading.login}
                            disabled={!isValid || loading.login}
                            onPress={handleSubmit}
                        />

                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            <Text style={{ color: COLORS.muted, fontSize: 14 }}>
                                Don't have an account?{" "}
                                <Text
                                    style={[TEXT.link, { fontSize: 14 }]}
                                    onPress={() => navigation.navigate("Signup")}
                                >
                                    Sign up
                                </Text>
                            </Text>
                        </View>
                    </>
                )}
            </Formik>
        </AuthLayout>
    );
};

export default LoginScreen;
