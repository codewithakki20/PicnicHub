import React, { useRef } from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const OUTER_SIZE = 78;
const IMAGE_SIZE = 66;

const StoryCircle = ({ user, isMyStory, isSeen, onPress }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const avatar =
        user?.avatar || "https://via.placeholder.com/150";

    const hasStory = user?.hasStory;
    const showAddStory = isMyStory && !hasStory;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View style={{ transform: [{ scale }] }}>
                    {/* MY STORY (NO STORY YET) */}
                    {showAddStory ? (
                        <View style={styles.myStoryOuter}>
                            <Image source={{ uri: avatar }} style={styles.image} />

                            <View style={styles.addBadge}>
                                <Ionicons name="add" size={16} color="#fff" />
                            </View>
                        </View>
                    ) : (
                        /* OTHER STORIES */
                        <LinearGradient
                            colors={
                                isSeen
                                    ? ["#d3d3d3", "#d3d3d3"]
                                    : ["#f09433", "#e6683c", "#dc2743", "#cc2366", "#bc1888"]
                            }
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.gradient,
                                { padding: isSeen ? 1.5 : 3 },
                            ]}
                        >
                            <View style={styles.inner}>
                                <Image source={{ uri: avatar }} style={styles.image} />
                            </View>
                        </LinearGradient>
                    )}
                </Animated.View>
            </Pressable>

            <Text style={styles.name} numberOfLines={1}>
                {isMyStory ? "Your story" : user?.name || "User"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        marginRight: 16,
    },

    gradient: {
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderRadius: OUTER_SIZE / 2,
        justifyContent: "center",
        alignItems: "center",
    },

    inner: {
        width: "100%",
        height: "100%",
        borderRadius: OUTER_SIZE / 2,
        backgroundColor: "#fff",
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
    },

    myStoryOuter: {
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderRadius: OUTER_SIZE / 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#dbdbdb",
    },

    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: IMAGE_SIZE / 2,
        backgroundColor: "#eee",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },

    addBadge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        backgroundColor: "#0095f6",
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },

    name: {
        marginTop: 6,
        fontSize: 12,
        color: "#262626",
        width: 74,
        textAlign: "center",
    },
});

export default StoryCircle;
