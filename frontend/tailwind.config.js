/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary brand color - Deep Forest Green from logo
                primary: {
                    50: '#e8f5e9',
                    100: '#c8e6c9',
                    200: '#a5d6a7',
                    300: '#81c784',
                    400: '#66bb6a',
                    500: '#4caf50',
                    600: '#43a047',
                    700: '#388e3c',
                    800: '#2e7d32',
                    900: '#1b5e20', // Main logo green
                    950: '#0d3f10',
                },
                // Secondary accent - Warm Orange/Coral from logo basket
                secondary: {
                    50: '#fff3e0',
                    100: '#ffe0b2',
                    200: '#ffcc80',
                    300: '#ffb74d',
                    400: '#ffa726',
                    500: '#ff9800',
                    600: '#fb8c00',
                    700: '#f57c00',
                    800: '#ef6c00',
                    900: '#e65100',
                },
                // Accent - Sunny Yellow from logo
                accent: {
                    50: '#fffde7',
                    100: '#fff9c4',
                    200: '#fff59d',
                    300: '#fff176',
                    400: '#ffee58',
                    500: '#ffeb3b',
                    600: '#fdd835',
                    700: '#fbc02d',
                    800: '#f9a825',
                    900: '#f57f17',
                },
                // Nature/Lime green from the grass/nature elements
                nature: {
                    50: '#f1f8e9',
                    100: '#dcedc8',
                    200: '#c5e1a5',
                    300: '#aed581',
                    400: '#9ccc65',
                    500: '#8bc34a',
                    600: '#7cb342',
                    700: '#689f38',
                    800: '#558b2f',
                    900: '#33691e',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                display: ['Outfit', 'ui-sans-serif', 'system-ui'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
