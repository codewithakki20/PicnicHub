import React, { useContext } from "react";
import { Alert, Text, View, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AuthLayout from "../../components/layout/AuthLayout";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { AuthContext } from "../../context/AuthContext";
import { TEXT, COLORS } from "../../theme/theme";

const schema = Yup.object({
    name: Yup.string()
        .trim()
        .min(2, "Name is too short")
        .required("Full name is required"),

    email: Yup.string()
        .trim()
        .email("Enter a valid email")
        .required("Email is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const SignupScreen = ({ navigation }) => {
    const { register, loading } = useContext(AuthContext);

    return (
        <AuthLayout
            title="Create account"
            subtitle="Join PicnicHub today 🌿"
        >
            <Formik
                initialValues={{ name: "", email: "", password: "" }}
                validationSchema={schema}
                validateOnMount
                onSubmit={async (v) => {
                    try {
                        const email = v.email.trim().toLowerCase();
                        await register(v.name.trim(), email, v.password);
                        navigation.navigate("OtpVerify", { email });
                    } catch (e) {
                        const msg =
                            e.response?.data?.message ||
                            "Something went wrong. Try again.";
                        Alert.alert("Signup failed", msg);
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
                            label="Full Name"
                            value={values.name}
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            error={touched.name && errors.name}
                        />

                        <AppInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            autoCapitalize="none"
                            keyboardType="email-address"
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

                        <PrimaryButton
                            title="Sign Up"
                            loading={loading.register}
                            disabled={!isValid || loading.register}
                            onPress={handleSubmit}
                        />

                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            <Text style={{ color: COLORS.muted, fontSize: 14 }}>
                                Already have an account?{" "}
                                <Text
                                    style={[TEXT.link, { fontSize: 14 }]}
                                    onPress={() => navigation.navigate("Login")}
                                >
                                    Login
                                </Text>
                            </Text>
                        </View>
                    </>
                )}
            </Formik>
        </AuthLayout>
    );
};

export default SignupScreen;
