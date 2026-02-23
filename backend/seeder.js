import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';

dotenv.config();

const initialRecipes = [
    {
        title: 'Spicy Chicken Curry',
        category: 'Main Course',
        time: '45 mins',
        difficulty: 'Medium',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/S2X5z0p5K5s',
        description: 'A rich, flavorful, and incredibly aromatic Indian chicken curry. Perfect for a cozy family dinner.',
        ingredients: [
            '500g Chicken, cut into pieces',
            '2 large Onions, finely chopped',
            '3 Tomatoes, pureed',
            '2 tbsp Ginger Garlic Paste',
            '1 tbsp Garam Masala',
            '1 tsp Turmeric Powder',
            '1 tsp Red Chilli Powder',
            'Salt to taste',
            'Fresh coriander for garnish'
        ],
        steps: [
            'Marinate the chicken with ginger garlic paste, turmeric, and salt for 30 minutes.',
            'Heat oil in a pan, add chopped onions and sauté until golden brown.',
            'Add the tomato puree and cook until oil separates from the masala.',
            'Stir in the red chilli powder and garam masala. Cook for 2 minutes.',
            'Add the marinated chicken and cook on high heat for 5 minutes to sear.',
            'Add 1 cup of boiling water, cover, and simmer for 20 minutes until chicken is tender.',
            'Garnish with fresh coriander and serve hot with naan or rice.'
        ]
    },
    {
        title: 'Healthy Quinoa Salad',
        category: 'Healthy',
        time: '15 mins',
        difficulty: 'Easy',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        videoUrl: '',
        description: 'A refreshing, protein-packed salad that takes almost no time to prepare. Great for a quick lunch.',
        ingredients: [
            '1 cup Quinoa, rinsed',
            '1 Cucumber, diced',
            '1 cup Cherry Tomatoes, halved',
            '1/4 Red Onion, finely chopped',
            '1/4 cup Feta Cheese, crumbled',
            '2 tbsp Olive Oil',
            '1 tbsp Lemon Juice',
            'Salt and Pepper'
        ],
        steps: [
            'Cook the quinoa according to package instructions. Let it cool completely.',
            'In a large bowl, combine the cooled quinoa, cucumber, tomatoes, and red onion.',
            'In a small bowl, whisk together the olive oil, lemon juice, salt, and pepper.',
            'Pour the dressing over the salad and toss gently to combine.',
            'Top with crumbled feta cheese before serving.'
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Recipe.deleteMany();
        console.log('Cleared existing recipes');

        // Insert seed data
        await Recipe.insertMany(initialRecipes);
        console.log('Database Seeded Successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
