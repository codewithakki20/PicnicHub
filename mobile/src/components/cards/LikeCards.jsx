import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LikeCards = ({ user, onFollow }) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Image
                    source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
                    style={styles.avatar}
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.username}>@{user.username || user.name.toLowerCase().replace(/\s/g, '')}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.followBtn, user.isFollowing && styles.followingBtn]}
                onPress={() => onFollow(user._id)}
            >
                <Text style={[styles.followText, user.isFollowing && styles.followingText]}>
                    {user.isFollowing ? 'Following' : 'Follow'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#eee',
    },
    info: {
        marginLeft: 12,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    username: {
        fontSize: 13,
        color: '#888',
    },
    followBtn: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    followingBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    followText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    followingText: {
        color: '#666',
    },
});

export default LikeCards;
