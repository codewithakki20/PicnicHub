import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/User.js';

const testSignup = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const testData = {
            name: 'Test User',
            email: 'test-' + Date.now() + '@example.com',
            passwordHash: 'password123',
        };

        console.log('\nAttempting to create user with data:', {
            name: testData.name,
            email: testData.email,
            password: '***'
        });

        const user = new User(testData);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        console.log('\nSaving user...');
        await user.save();

        console.log('\n✅ User created successfully!');
        console.log('User ID:', user._id);
        console.log('OTP:', otp);

        // Clean up
        await User.deleteOne({ _id: user._id });
        console.log('\n✅ Test user cleaned up');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    }
};

testSignup();
