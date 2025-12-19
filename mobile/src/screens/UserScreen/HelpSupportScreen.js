import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const HelpSupportScreen = ({ navigation }) => {
    const { colors, isDark } = useTheme();

    const handleEmail = () => {
        Linking.openURL('mailto:support@picnichub.com?subject=Support Request');
    };

    const handleWebsite = () => {
        Linking.openURL('https://picnichub.com/help');
    };

    const bgColor = colors.background;
    const textColor = colors.text;
    const cardColor = colors.card;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Header */}
            <View style={[styles.header, { borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Hero */}
                <View style={[styles.hero, { backgroundColor: cardColor }]}>
                    <Ionicons name="help-buoy-outline" size={48} color="#2E7D32" />
                    <Text style={[styles.heroTitle, { color: textColor }]}>How can we help you?</Text>
                    <Text style={[styles.heroSub, { color: colors.subText }]}>
                        Find answers to your questions or get in touch with our team.
                    </Text>
                </View>

                {/* FAQ Options */}
                <Text style={[styles.sectionTitle, { color: colors.subText }]}>Common Topics</Text>

                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <Option
                        icon="person-outline"
                        title="Account & Profile"
                        colors={colors}
                        onPress={() => { }}
                    />
                    <Option
                        icon="lock-closed-outline"
                        title="Privacy & Security"
                        colors={colors}
                        onPress={() => { }}
                    />
                    <Option
                        icon="videocam-outline"
                        title="Reels & Stories"
                        colors={colors}
                        noBorder
                        onPress={() => { }}
                    />
                </View>

                {/* Contact */}
                <Text style={[styles.sectionTitle, { color: colors.subText }]}>Contact Us</Text>

                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <Option
                        icon="mail-outline"
                        title="Email Support"
                        colors={colors}
                        onPress={handleEmail}
                    />
                    <Option
                        icon="globe-outline"
                        title="Visit Help Center"
                        colors={colors}
                        noBorder
                        onPress={handleWebsite}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const Option = ({ icon, title, onPress, colors, noBorder }) => (
    <TouchableOpacity
        style={[
            styles.option,
            { borderColor: colors.border },
            noBorder && { borderBottomWidth: 0 }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.optionLeft}>
            <Ionicons name={icon} size={22} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subText} />
    </TouchableOpacity>
);

export default HelpSupportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    hero: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        elevation: 1,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 6,
    },
    heroSub: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 8,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        marginLeft: 14,
        fontWeight: '500',
    },
});
