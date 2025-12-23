import React, { useContext, useEffect } from "react";
import { Text, Alert, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

import AuthLayout from "../../components/layout/AuthLayout";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { AuthContext } from "../../context/AuthContext";
import { TEXT, COLORS } from "../../theme/theme";

WebBrowser.maybeCompleteAuthSession();

/* ================= VALIDATION ================= */

const schema = Yup.object({
    email: Yup.string()
        .trim()
        .email("Enter a valid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

/* ================= SCREEN ================= */

const LoginScreen = ({ navigation }) => {
    const { login, googleSignIn, loading } = useContext(AuthContext);

    /* ================= GOOGLE AUTH ================= */

    const [request, response, promptAsync] = Google.useAuthRequest({
        // REQUIRED for Expo Go
        expoClientId:
            "804426225602-0e5pdjmqatct84401kuegm1vour1ubdg.apps.googleusercontent.com",

        // REQUIRED for Android standalone build
        androidClientId:
            "804426225602-72qssocdlk3hegsdbtblahp8jd00c8gq.apps.googleusercontent.com",
        // Recommended (even if not testing iOS now)
        iosClientId:
            "IOS_CLIENT_ID.apps.googleusercontent.com",
    });

    useEffect(() => {
        // Log the redirect URI to the console for debugging
        const redirectUri = makeRedirectUri({
            // path: 'auth', // Remove path if not needed or to match default
        });
        console.log("GOOGLE OAUTH REDIRECT URI:", redirectUri);
    }, []);

    useEffect(() => {
        if (response?.type === "success") {
            const { authentication } = response;
            handleGoogleAuth(authentication);
        }
    }, [response]);

    /* ================= GOOGLE HANDLER ================= */

    const handleGoogleAuth = async (auth) => {
        try {
            // Fetch Google profile
            const res = await fetch(
                "https://www.googleapis.com/userinfo/v2/me",
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                }
            );

            const user = await res.json();

            await googleSignIn({
                idToken: auth.idToken || auth.accessToken,
                googleId: user.id,
                email: user.email,
                name: user.name,
                avatar: user.picture,
            });
        } catch (e) {
            Alert.alert("Google Login Error", e.message);
        }
    };

    /* ================= UI ================= */

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
                        await login(v.email.trim().toLowerCase(), v.password);
                    } catch (e) {
                        Alert.alert(
                            "Login failed",
                            e.response?.data?.message ||
                            "Something went wrong. Try again."
                        );
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

                        <View style={{ marginTop: 20 }}>
                            <PrimaryButton
                                title="Continue with Google"
                                disabled={!request}
                                onPress={() => promptAsync()}
                                style={{ backgroundColor: "#DB4437" }}
                            />
                        </View>

                        <View style={{ marginTop: 20, alignItems: "center" }}>
                            <Text style={{ color: COLORS.muted, fontSize: 14 }}>
                                Don&apos;t have an account?{" "}
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
