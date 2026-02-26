import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';

dotenv.config();

const checkR = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const recipes = await Recipe.find({});
        const counts = {};
        for (const r of recipes) {
            const authId = r.author ? r.author.toString() : 'None';
            counts[authId] = (counts[authId] || 0) + 1;
        }
        console.log(counts);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkR();
