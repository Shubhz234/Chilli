import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const users = await User.find({}, 'name email _id isAdmin followers following');
        console.log(users);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testDb();
