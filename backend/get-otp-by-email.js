// Helper script to get OTP from backend logs
// Run this AFTER attempting signup in the mobile app

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.js';

const getOtp = async () => {
    try {
        const email = process.argv[2];

        if (!email) {
            console.log('Usage: node get-otp-by-email.js <email>');
            console.log('Example: node get-otp-by-email.js ankit@test.com');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected\n');

        const user = await User.findOne({ email: email.trim().toLowerCase() })
            .select('+otp +otpExpires');

        if (!user) {
            console.log('❌ No user found with email:', email);
            process.exit(1);
        }

        if (!user.otp) {
            console.log('⚠️ No OTP found for this user');
            console.log('User might already be verified or OTP expired');
            process.exit(1);
        }

        console.log('📧 Email:', user.email);
        console.log('🔢 OTP:', user.otp);
        console.log('⏰ Expires:', new Date(user.otpExpires).toLocaleString());
        console.log('✅ Valid:', user.otpExpires > Date.now() ? 'Yes' : 'No (Expired)');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

getOtp();
