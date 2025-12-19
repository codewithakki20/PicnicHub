import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const iconName = options.tabBarIconName || "ellipse-outline";

                const onPress = () => {
                    if (!isFocused) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabButton}
                        activeOpacity={0.8}
                    >
                        <MotiView
                            from={{ scale: 0.9, opacity: 0.6 }}
                            animate={{
                                scale: isFocused ? 1.25 : 1,
                                opacity: isFocused ? 1 : 0.6,
                            }}
                            transition={{ type: "spring", damping: 12 }}
                        >
                            <Ionicons
                                name={isFocused ? iconName : `${iconName}-outline`}
                                size={24}
                                color={isFocused ? "#2E7D32" : "#666"}
                            />
                        </MotiView>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CustomTabBar;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        height: 70,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "space-around",
        elevation: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },

    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
