import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Recipe from './models/Recipe.js';

dotenv.config();

const cleanDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for cleanup...');

        const users = await User.find({});
        for (let user of users) {
            const uniqueFollowers = [...new Set(user.followers.map(id => id.toString()))];
            const uniqueFollowing = [...new Set(user.following.map(id => id.toString()))];

            if (uniqueFollowers.length !== user.followers.length || uniqueFollowing.length !== user.following.length) {
                console.log(`Cleaning user ${user.name}`);
                user.followers = uniqueFollowers;
                user.following = uniqueFollowing;
                await user.save();
            }
        }

        const recipes = await Recipe.find({});
        for (let recipe of recipes) {
            const uniqueLikes = [...new Set((recipe.likes || []).map(id => id.toString()))];

            if (recipe.likes && uniqueLikes.length !== recipe.likes.length) {
                console.log(`Cleaning recipe ${recipe.title}`);
                recipe.likes = uniqueLikes;
                await recipe.save();
            }
        }

        console.log('Cleanup complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanDatabase();
