import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    // Initial Load
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem('darkMode');
            if (stored === 'true') {
                setIsDark(true);
            }
        })();
    }, []);

    // Toggle & Save
    const toggleTheme = async (value) => {
        setIsDark(value);
        await AsyncStorage.setItem('darkMode', String(value));
    };

    // Define Themes
    const theme = {
        isDark,
        colors: isDark
            ? {
                // DARK
                background: '#0d0d0d',
                card: '#1a1a1a',
                text: '#ffffff',
                subText: '#a0a0a0',
                border: '#333333',
                primary: '#4CAF50', // Keep primary green
                inputBg: '#262626',
                icon: '#ffffff',
            }
            : {
                // LIGHT
                background: '#f6f7f9',
                card: '#ffffff',
                text: '#111111',
                subText: '#666666',
                border: '#eeeeee',
                primary: '#2E7D32',
                inputBg: '#f9f9f9',
                icon: '#111111',
            },
    };

    return (
        <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
