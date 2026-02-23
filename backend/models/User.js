import mongoose from 'mongoose';

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
    isAdmin: { type: Boolean, default: false }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
