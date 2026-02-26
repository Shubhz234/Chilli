import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Recipe from './models/Recipe.js';

dotenv.config();

const testDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const users = await User.find({});
        users.forEach(u => {
            console.log(`User ${u.name}: ${u.followers.length} followers, ${u.following.length} following`);
        });

        const recipes = await Recipe.find({});
        recipes.forEach(r => {
            console.log(`Recipe ${r.title}: ${r.likes.length} likes`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testDb();
