import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';



/* ---------------- NAVIGATORS ---------------- */

import BottomTabNavigator from './BottomTabNavigator';

/* ---------------- GLOBAL SCREENS ---------------- */
import BlogDetailsScreen from '../screens/BlogScreen/BlogDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StoryViewScreen from '../screens/StoryViewScreen';
import UploadMemoryScreen from '../screens/UserScreen/UploadMemoryScreen';
import UploadStoryScreen from '../screens/UserScreen/UploadStory';
import UploadReelScreen from '../screens/UserScreen/UploadReelScreen';
import MemoryDetailsScreen from '../screens/MemoriesScreen/MemoryDetailsScreen';
import ReelViewerScreen from '../screens/ReelsScreen/ReelViewerScreen';
import EditMemoryScreen from '../screens/MemoriesScreen/EditMemoryScreen';
import EditReelScreen from '../screens/ReelsScreen/EditReelScreen';
import CommentsScreen from '../screens/CommentsScreen';
import OtherUserProfileScreen from '../screens/UserScreen/OtherUserProfileScreen';
import FollowListScreen from '../screens/FollowListScreen';
import FindPeopleScreen from '../screens/UserScreen/FindPeopleScreen';
import HelpSupportScreen from '../screens/UserScreen/HelpSupportScreen';


const Stack = createStackNavigator();

/* ---------------- LOADING ---------------- */


const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* MAIN APP */}
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

            {/* GLOBAL MODALS & SCREENS */}
            <Stack.Screen name="BlogDetails" component={BlogDetailsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="MemoryDetails" component={MemoryDetailsScreen} />
            <Stack.Screen name="ReelViewer" component={ReelViewerScreen} />
            <Stack.Screen name="Comments" component={CommentsScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="UserProfile" component={OtherUserProfileScreen} />

            {/* UPLOADS */}
            <Stack.Screen
                name="UploadMemory"
                component={UploadMemoryScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="UploadStory"
                component={UploadStoryScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="UploadReel"
                component={UploadReelScreen}
                options={{ presentation: 'modal' }}
            />

            <Stack.Screen
                name="EditMemory"
                component={EditMemoryScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="EditReel"
                component={EditReelScreen}
                options={{ presentation: 'modal' }}
            />

            {/* TRANSPARENT MODALS */}
            <Stack.Screen
                name="StoryView"
                component={StoryViewScreen}
                options={{ presentation: 'transparentModalModal' }}
            />

            <Stack.Screen name="FollowList" component={FollowListScreen} />
            <Stack.Screen name="FindPeople" component={FindPeopleScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator; // Global Stack including FollowList
