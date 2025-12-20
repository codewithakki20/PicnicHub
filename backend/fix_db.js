
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const fixDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const indexes = await User.collection.indexes();
        console.log('Current Indexes:', indexes);

        const indexName = 'username_1';
        const indexExists = indexes.some(idx => idx.name === indexName);

        if (indexExists) {
            console.log(`Dropping index: ${indexName}`);
            await User.collection.dropIndex(indexName);
            console.log('Index dropped successfully');
        } else {
            console.log(`Index ${indexName} not found`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixDb();
