import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MotiView, MotiText } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SPACING, RADIUS } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#4CAF50', '#2E7D32', '#1B5E20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            {/* Decorative Circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <SafeAreaView style={styles.contentContainer}>
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.5, translateY: -20 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        transition={{ type: 'spring', damping: 15, duration: 1000 }}
                    >
                        <Image
                            source={require('../../../assets/logo1.png')}
                            style={styles.logo}
                        />
                    </MotiView>

                    <MotiText
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 500, type: 'timing', duration: 800 }}
                        style={styles.appName}
                    >
                        PicnicHub
                    </MotiText>
                </View>

                {/* Bottom Content Definition */}
                <MotiView
                    from={{ opacity: 0, translateY: 100 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 800, type: 'spring', damping: 20 }}
                    style={styles.bottomSheet}
                >
                    <Text style={styles.title}>Connect & Share</Text>
                    <Text style={styles.subtitle}>
                        Discover the best picnic spots, share your memories, and connect with nature lovers.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.primaryButtonText}>Log In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => navigation.navigate('Signup')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.outlineButtonText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </MotiView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    circle1: {
        position: 'absolute',
        top: -width * 0.2,
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle2: {
        position: 'absolute',
        top: height * 0.1,
        right: -width * 0.2,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        tintColor: '#FFFFFF', // Assuming the logo works well as white, or remove if it has colors
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: SPACING.md,
        letterSpacing: 1,
    },
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SPACING.lg,
        paddingBottom: SPACING.xl * 1.5,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.muted,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
        paddingHorizontal: SPACING.sm,
    },
    buttonContainer: {
        width: '100%',
        gap: SPACING.md,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    outlineButtonText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '700',
    },
});

export default WelcomeScreen;
