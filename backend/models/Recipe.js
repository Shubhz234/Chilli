import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    time: { type: String, required: true },
    difficulty: { type: String, default: 'Medium' },
    servings: { type: Number, default: 4 },
    rating: { type: Number, default: 0 },
    image: { type: String, default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80' },
    videoUrl: { type: String },
    description: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }]
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
