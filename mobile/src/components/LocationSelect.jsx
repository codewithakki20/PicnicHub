import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLocations, getLocation, searchLocations } from "../services/api";

const LocationSelect = ({ label, value, onChange, placeholder = "Search for a location...", required = false }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Load selected location if value is provided
    useEffect(() => {
        if (value && !selectedLocation) {
            // Check if valid Mongo ID. If not, maybe it's a legacy string location name?
            // If it is NOT a mongo ID, we treat it as a string value (not supported by this picker fully, but we can set search query)
            if (!/^[0-9a-fA-F]{24}$/.test(value)) {
                // It's likely a raw string from legacy data
                // We'll just set it as the query, but we can't fetch the object
                // onChange(""); // Optional: Clear it if you want to force re-selection
                return;
            }

            const loadSelected = async () => {
                try {
                    const loc = await getLocation(value);
                    if (loc) {
                        setSelectedLocation(loc);
                        setSearchQuery(loc.name);
                    }
                } catch (err) {
                    if (err.response?.status === 404) onChange("");
                }
            };
            loadSelected();
        } else if (!value && selectedLocation) {
            // Value cleared externally
            setSelectedLocation(null);
            setSearchQuery("");
        }
    }, [value, selectedLocation, onChange]);

    // Search locations when query changes (Debounced manually via timeout in original, effectively)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                // If we already selected one and the query matches, no need to search again immediately unless user types
                if (selectedLocation && searchQuery === selectedLocation.name) {
                    return;
                }

                setLoading(true);
                try {
                    // Try search endpoint first if available, else getLocations with filter
                    let locs = [];
                    try {
                        const searchRes = await searchLocations(searchQuery);
                        locs = Array.isArray(searchRes) ? searchRes : [];
                    } catch {
                        // Fallback
                        const res = await getLocations({ search: searchQuery, limit: 10 });
                        locs = res?.locations || (Array.isArray(res) ? res : []);
                    }
                    setLocations(locs);
                    setShowDropdown(locs.length > 0);
                } catch (err) {
                    setLocations([]);
                    setShowDropdown(false);
                } finally {
                    setLoading(false);
                }
            } else {
                setLocations([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedLocation]);

    const handleSelect = (loc) => {
        setSelectedLocation(loc);
        setSearchQuery(loc.name);
        setShowDropdown(false);
        onChange(loc._id);
    };

    const handleClear = () => {
        setSelectedLocation(null);
        setSearchQuery("");
        onChange("");
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label} {required && <Text style={{ color: "#ef4444" }}>*</Text>}
                </Text>
            )}

            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        // If user types, we likely clear the specific ID selection until they pick again
                        if (selectedLocation && text !== selectedLocation.name) {
                            setSelectedLocation(null);
                            // Optional: clear the value in parent or keep it until new selection?
                            // Typically we keep passing ID until changed. But if they type, ID is invalid.
                            onChange("");
                        }
                    }}
                    onFocus={() => {
                        if (locations.length > 0) setShowDropdown(true);
                    }}
                />

                <View style={styles.iconContainer}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#10b981" />
                    ) : selectedLocation || searchQuery.length > 0 ? (
                        <TouchableOpacity onPress={handleClear}>
                            <Ionicons name="close-circle" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    ) : (
                        <Ionicons name="location-outline" size={20} color="#9ca3af" />
                    )}
                </View>
            </View>

            {/* DROPDOWN */}
            {showDropdown && locations.length > 0 && (
                <View style={styles.dropdown}>
                    <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                        {locations.map((loc) => (
                            <TouchableOpacity
                                key={loc._id}
                                style={styles.item}
                                onPress={() => handleSelect(loc)}
                            >
                                <Text style={styles.itemName}>{loc.name}</Text>
                                {loc.description && (
                                    <Text style={styles.itemDesc} numberOfLines={1}>
                                        {loc.description}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        zIndex: 100, // Important for overlapping logic if supported by parent
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    input: {
        flex: 1,
        height: "100%",
        fontSize: 15,
        color: "#0f172a",
    },
    iconContainer: {
        marginLeft: 8,
    },
    dropdown: {
        position: "absolute",
        top: 80, // Offset from top of container
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 9999,
        overflow: "hidden", // Clip content to border radius
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    itemName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0f172a",
    },
    itemDesc: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 2,
    },
});

export default LocationSelect;
