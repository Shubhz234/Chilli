import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    reason: { type: String },
    read: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    dob: { type: String },
    favoriteDish: { type: String },
    spiceLevel: { type: String, default: 'Medium' },
    favoriteCuisine: { type: String },
    dietaryPreference: { type: String },
    allergies: { type: String },
    extras: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    bio: { type: String, default: "Home cook" },
    profilePhoto: { type: String, default: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    notifications: [notificationSchema],
    isBlocked: { type: Boolean, default: false },
    loginHistory: [{
        ip: String,
        time: { type: Date, default: Date.now },
        device: String
    }],
    otp: { type: String, select: false },
    otpExpires: { type: Date }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
