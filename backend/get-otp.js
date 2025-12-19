import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

async function getOtp() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find the most recent user
        const user = await User.findOne().sort({ createdAt: -1 }).select('+otp');

        if (user && user.otp) {
            console.log('OTP_FOUND:', user.otp);
        } else {
            console.log('OTP_NOT_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

getOtp();
