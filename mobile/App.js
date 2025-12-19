import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Device from 'expo-device';
// import { Audio } from 'expo-av'; // Deprecated in SDK 54

import AnimatedSplashScreen from './src/screens/SplashScreen';

/* ---------------- CONTEXT ---------------- */
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

/* ---------------- NAVIGATOR ---------------- */
import RootNavigator from './src/navigation/RootNavigator';

/* ======================================================
   NOTIFICATIONS CONFIG
====================================================== */

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

import Constants from 'expo-constants';

// ... (existing imports)

async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) return;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    try {
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.manifest?.extra?.eas?.projectId ??
            Constants?.manifest2?.extra?.expoClient?.extra?.eas?.projectId;

        if (!projectId) {
            console.log("Push Notifications: Project ID not found.");
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Expo Push Token:', token);
    } catch (e) {
        console.log("Push token error:", e);
    }
}

/* ======================================================
   APP ROOT
====================================================== */

export default function App() {
    const [appReady, setAppReady] = React.useState(false);
    const [splashAnimationFinished, setSplashAnimationFinished] = React.useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the native splash screen visible while we load resources
                await SplashScreen.preventAutoHideAsync();

                // Pre-load fonts, make any API calls you need to do here
                // For example: await Font.loadAsync(Entypo.font);

                // Artificially wait for a bit to ensure smooth transition
                await new Promise(resolve => setTimeout(resolve, 100));

                // Audio configuration
                // await Audio.setAudioModeAsync({
                //     playsInSilentModeIOS: true,
                //     shouldDuckAndroid: true,
                // });

                registerForPushNotificationsAsync();

            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppReady(true);
                // Hide the native splash screen immediately, letting our CustomSplashScreen take over
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    if (!appReady || !splashAnimationFinished) {
        return (
            <AnimatedSplashScreen onFinish={() => setSplashAnimationFinished(true)} />
        );
    }

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <ThemeProvider>
                    <StatusBar style="dark" />
                    <RootNavigator />
                </ThemeProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
