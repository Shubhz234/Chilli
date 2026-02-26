import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Recipe from './models/Recipe.js';

dotenv.config();

const fixFakeAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB. Starting migration...');

        // 1. Identify the duplicate account
        const duplicateId = '699c8ded0c90812c9cacc157'; // shubhammore2244@gmail.com (lowercase, 1 follower)
        const originalId = '699bfae201e9521f4084bab1';  // Shubhammore2244@gmail.com (uppercase, 5 followers)

        const duplicateAcc = await User.findById(duplicateId);
        const originalAcc = await User.findById(originalId);

        if (duplicateAcc && originalAcc) {
            console.log('Found both accounts! Merging & Deleting duplicate...');

            // Merge following arrays
            const newFollowing = new Set([...originalAcc.following.map(id => id.toString()), ...duplicateAcc.following.map(id => id.toString())]);
            const newFollowers = new Set([...originalAcc.followers.map(id => id.toString()), ...duplicateAcc.followers.map(id => id.toString())]);

            // Remove self-references and duplicate references
            newFollowing.delete(originalId);
            newFollowing.delete(duplicateId);
            newFollowers.delete(originalId);
            newFollowers.delete(duplicateId);

            originalAcc.following = Array.from(newFollowing);
            originalAcc.followers = Array.from(newFollowers);

            // Fix case-sensitive email issue permanently
            originalAcc.email = originalAcc.email.toLowerCase();

            // Delete the duplicate
            await User.findByIdAndDelete(duplicateId);
            console.log('Duplicate account deleted.');

            // Save the upgraded main account
            await originalAcc.save();
            console.log('Original account migrated successfully!');
        }

        // 2. Remove any lingering references of the duplicate from EVERY user's lists
        const allUsers = await User.find({});
        for (let user of allUsers) {
            const hasZombieFollower = user.followers.some(id => id.toString() === duplicateId);
            const hasZombieFollowing = user.following.some(id => id.toString() === duplicateId);

            let changed = false;
            if (hasZombieFollower) {
                user.followers = user.followers.filter(id => id.toString() !== duplicateId);
                // Redirect their follow to the main account? The user is already in originalAcc.followers.
                changed = true;
            }
            if (hasZombieFollowing) {
                user.following = user.following.filter(id => id.toString() !== duplicateId);
                changed = true;
            }
            if (changed) {
                await user.save();
                console.log(`Cleaned up references for ${user.email}`);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration Error:', err);
        process.exit(1);
    }
};

fixFakeAccounts();
