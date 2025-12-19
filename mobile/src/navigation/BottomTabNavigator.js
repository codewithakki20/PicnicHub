import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

/* ---------------- SCREENS ---------------- */
import HomeScreen from '../screens/HomeScreen';
import MemoriesScreen from '../screens/MemoriesScreen/MemoriesScreen';
import MemoryDetailsScreen from '../screens/MemoriesScreen/MemoryDetailsScreen';
import ReelsScreen from '../screens/ReelsScreen/ReelsScreen';
import ReelViewerScreen from '../screens/ReelsScreen/ReelViewerScreen';
import BlogScreen from '../screens/BlogScreen/BlogScreen';
import ProfileScreen from '../screens/UserScreen/ProfileScreen';
import EditProfileScreen from '../screens/UserScreen/EditProfileScreen';
import ProfileSettingsScreen from '../screens/UserScreen/ProfileSettingsScreen';
import ChangePasswordScreen from '../screens/UserScreen/ChangePasswordScreen';
import TermsPrivacyScreen from '../screens/UserScreen/TermsPrivacyScreen';
import FindPeopleScreen from '../screens/UserScreen/FindPeopleScreen';
import CommentsScreen from '../screens/CommentsScreen';

/* ---------------- UI ---------------- */
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* ======================================================
   STACKS (INSIDE TABS)
====================================================== */

/* 🏠 Home */
const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MemoryDetails" component={MemoryDetailsScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
);

/* 🖼 Memories */
const MemoriesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Memories" component={MemoriesScreen} />
        <Stack.Screen name="MemoryDetails" component={MemoryDetailsScreen} />
    </Stack.Navigator>
);

/* 🎬 Reels */
const ReelsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Reels" component={ReelsScreen} />
        <Stack.Screen name="ReelViewer" component={ReelViewerScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
);

/* 👤 Profile */
const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
        <Stack.Screen name="FindPeople" component={FindPeopleScreen} />

    </Stack.Navigator>
);

/* ======================================================
   BOTTOM TAB NAVIGATOR
====================================================== */
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{ tabBarIconName: 'home' }}
            />
            <Tab.Screen
                name="MemoriesTab"
                component={MemoriesStack}
                options={{ tabBarIconName: 'images' }}
            />
            <Tab.Screen
                name="ReelsTab"
                component={ReelsStack}
                options={{ tabBarIconName: 'videocam' }}
            />
            <Tab.Screen
                name="BlogsTab"
                component={BlogScreen}
                options={{ tabBarIconName: 'newspaper' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{ tabBarIconName: 'person' }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
