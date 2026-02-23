import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'Shubhammore2244@gmail.com';
        const adminPassword = '121233434';

        // Check if admin already exists
        let adminUser = await User.findOne({ email: adminEmail });

        if (adminUser) {
            console.log('Admin user already exists. Updating password and admin status...');
            const salt = await bcrypt.genSalt(10);
            adminUser.password = await bcrypt.hash(adminPassword, salt);
            adminUser.isAdmin = true;
            await adminUser.save();
        } else {
            console.log('Creating new admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            adminUser = new User({
                name: 'Shubham',
                email: adminEmail,
                password: hashedPassword,
                age: 26,
                dob: '1998-01-01',
                favoriteDish: 'Paneer Butter Masala',
                extras: 'Platform Administrator',
                isAdmin: true
            });
            await adminUser.save();
        }

        console.log('Admin user successfully seeded/updated!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
