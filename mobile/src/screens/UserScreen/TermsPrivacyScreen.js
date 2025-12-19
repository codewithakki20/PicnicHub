import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TermsPrivacyScreen = ({ navigation }) => {
    const [tab, setTab] = useState('terms'); // 'terms' or 'privacy'

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Legal</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'terms' && styles.activeTab]}
                    onPress={() => setTab('terms')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tab === 'terms' && styles.activeTabText,
                        ]}
                    >
                        Terms of Service
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'privacy' && styles.activeTab]}
                    onPress={() => setTab('privacy')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            tab === 'privacy' && styles.activeTabText,
                        ]}
                    >
                        Privacy Policy
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.content}>
                {tab === 'terms' ? (
                    <View>
                        <Text style={styles.sectionTitle}>1. Introduction</Text>
                        <Text style={styles.text}>
                            Welcome to PicnicHub. By using our app, you agree to
                            these terms. Please read them carefully.
                        </Text>

                        <Text style={styles.sectionTitle}>2. Use of App</Text>
                        <Text style={styles.text}>
                            You agree to use PicnicHub only for lawful purposes
                            and in a way that does not infringe the rights of,
                            restrict or inhibit anyone else's use and enjoyment
                            of the app.
                        </Text>

                        <Text style={styles.sectionTitle}>3. User Content</Text>
                        <Text style={styles.text}>
                            You retain ownership of any content you post.
                            However, by posting, you grant us a license to use,
                            store, and display your content in connection with
                            the app.
                        </Text>

                        <Text style={styles.sectionTitle}>4. Termination</Text>
                        <Text style={styles.text}>
                            We reserve the right to suspend or terminate your
                            access to the app at any time, without notice, for
                            any reason.
                        </Text>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.sectionTitle}>
                            1. Data Collection
                        </Text>
                        <Text style={styles.text}>
                            We collect information you provide directly to us,
                            such as when you create an account, update your
                            profile, or post content.
                        </Text>

                        <Text style={styles.sectionTitle}>2. Use of Data</Text>
                        <Text style={styles.text}>
                            We use your data to provide, maintain, and improve
                            our services, and to communicate with you.
                        </Text>

                        <Text style={styles.sectionTitle}>
                            3. Data Sharing
                        </Text>
                        <Text style={styles.text}>
                            We do not share your personal information with third
                            parties except as described in this policy or with
                            your consent.
                        </Text>

                        <Text style={styles.sectionTitle}>4. Security</Text>
                        <Text style={styles.text}>
                            We take reasonable measures to help protect
                            information about you from loss, theft, misuse and
                            unauthorized access.
                        </Text>
                    </View>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsPrivacyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
    },
    tabs: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        marginRight: 24,
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2E7D32',
    },
    tabText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#2E7D32',
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginTop: 16,
        marginBottom: 8,
    },
    text: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginBottom: 12,
    },
});
