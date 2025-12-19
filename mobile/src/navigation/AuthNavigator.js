import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/AuthScreen/LoginScreen";
import SignupScreen from "../screens/AuthScreen/SignupScreen";
import OtpScreen from "../screens/AuthScreen/OtpScreen";
import ForgotPasswordScreen from "../screens/AuthScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/AuthScreen/ResetPasswordScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
            name="OtpVerify"
            component={OtpScreen}
            options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
