import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

async function getResetOtp() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'browser_test_user_4@example.com';
        const user = await User.findOne({ email }).select('+passwordResetOtp');

        if (user && user.passwordResetOtp) {
            console.log('OTP_FOUND:', user.passwordResetOtp);
        } else {
            console.log('OTP_NOT_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

getResetOtp();
