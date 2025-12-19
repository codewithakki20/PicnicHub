import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'browser_test_user_3@example.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('USER_FOUND:', user.email);
            console.log('IS_VERIFIED:', user.isVerified);
        } else {
            console.log('USER_NOT_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

checkUser();
