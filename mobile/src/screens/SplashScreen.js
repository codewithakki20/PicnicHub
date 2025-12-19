import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { MotiView, MotiImage, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

const CustomSplashScreen = ({ onFinish }) => {
    const [animationFinished, setAnimationFinished] = useState(false);

    useEffect(() => {
        const sequence = async () => {

            // Wait for animation
            setTimeout(() => {
                setAnimationFinished(true);
                if (onFinish) onFinish();
            }, 3000);
        };

        sequence();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1B5E20', '#2E7D32', '#4CAF50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />

            {/* Ripple Effect Circles */}
            {[...Array(3).keys()].map((index) => (
                <MotiView
                    key={index}
                    from={{ opacity: 0.5, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2.5 }}
                    transition={{
                        type: 'timing',
                        duration: 2500,
                        loop: true,
                        delay: index * 600,
                        repeatReverse: false
                    }}
                    style={[styles.ripple, { borderColor: 'rgba(255,255,255,0.2)' }]}
                />
            ))}

            <View style={styles.content}>
                <MotiImage
                    source={require('../../assets/logo1.png')}
                    from={{ opacity: 0, scale: 0.8, rotate: '0deg' }}
                    animate={{ opacity: 1, scale: 1, rotate: '360deg' }}
                    transition={{
                        type: 'spring',
                        damping: 10,
                        duration: 1500,
                    }}
                    style={styles.logo}
                />

                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 800, delay: 500 }}
                    style={styles.title}
                >
                    PicnicHub
                </MotiText>

                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ type: 'timing', duration: 800, delay: 1200 }}
                    style={styles.subtitle}
                >
                    Share your moments
                </MotiText>
            </View>

            <View style={styles.footer}>
                <MotiView
                    from={{ width: 0 }}
                    animate={{ width: width * 0.4 }}
                    transition={{ type: 'timing', duration: 2000, delay: 500 }}
                    style={styles.progressBar}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E7D32',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    ripple: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 16,
        color: '#E0E0E0',
        marginTop: 10,
        letterSpacing: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 80,
        height: 4,
        width: width * 0.4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    }
});

export default CustomSplashScreen;
