import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';

dotenv.config();

const indianRecipes = [
    {
        title: "Authentic Misal Pav",
        category: "Street Food",
        time: "45",
        difficulty: "Hard",
        servings: 4,
        rating: 4.9,
        numReviews: 12,
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800",
        videoUrl: "https://www.youtube.com/watch?v=kY3PzH-O0pI",
        description: "A spicy, flavourful Maharashtrian street food dish made with sprouted moth beans (matki) topped with crunchy farsan and served with soft pav.",
        ingredients: [
            "2 cups sprouted matki (moth beans)",
            "3 onions, finely chopped",
            "2 tomatoes, chopped",
            "3 tbsp oil",
            "2 tbsp Misal / Goda Masala",
            "1 tsp red chilli powder",
            "1/2 cup grated fresh coconut",
            "Farsan for topping",
            "8 Ladi Pav (bread rolls)",
            "Lemon wedges and chopped coriander"
        ],
        steps: [
            "Pressure cook sprouted matki with salt and turmeric for 2 whistles.",
            "Make a paste of roasted onions, dry coconut, ginger, and garlic.",
            "Heat oil in a large pot. Add mustard seeds, curry leaves, and the ground paste. Sauté well.",
            "Add chopped tomatoes, misal masala, red chilli powder, and cook until oil separates.",
            "Add the boiled matki along with its water. Adjust consistency and boil for 10-15 minutes (this is the 'Rassa').",
            "To serve: Add matki in a bowl, pour the spicy liquid (tarri) over it, top with farsan, chopped onions, and coriander. Serve hot with pav and lemon."
        ],
        region: "Maharashtrian",
        dietType: "Vegetarian",
        calories: 450,
        protein: 15,
        carbs: 60,
        fat: 18
    },
    {
        title: "Mumbai Style Vada Pav",
        category: "Snacks",
        time: "30",
        difficulty: "Medium",
        servings: 6,
        rating: 4.8,
        numReviews: 25,
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800",
        videoUrl: "https://www.youtube.com/watch?v=FjI5jY1W2tE",
        description: "The classic Mumbai street food! A spicy potato filling dipped in gram flour batter, deep-fried, and sandwiched in a soft pav with dry garlic chutney.",
        ingredients: [
            "4 large potatoes, boiled and mashed",
            "1 cup besan (gram flour)",
            "2 tbsp green chilli-garlic paste",
            "1 tsp mustard seeds",
            "1/2 tsp turmeric powder",
            "Handful of curry leaves and coriander",
            "Dry garlic chutney (Lahsuni chutney)",
            "6 Pavs",
            "Oil for deep frying"
        ],
        steps: [
            "Heat 1 tbsp oil in a pan, add mustard seeds, curry leaves, and chilli-garlic paste. Sauté briefly.",
            "Add turmeric and mashed potatoes. Mix well, add coriander, let it cool, and shape into lemon-sized balls.",
            "Prepare a thick batter by mixing besan, a pinch of baking soda, salt, and water.",
            "Heat oil for deep frying.",
            "Dip potato balls into the besan batter to coat evenly, and drop gently into hot oil.",
            "Fry until golden brown. Drain on paper towels.",
            "Slice pav in half, smear generous garlic chutney inside, place the hot vada, and press gently.",
            "Serve hot with fried salted green chillies."
        ],
        region: "Street Food",
        dietType: "Vegetarian",
        calories: 300,
        protein: 8,
        carbs: 45,
        fat: 10
    },
    {
        title: "High Protein Soya Chunks Sabzi",
        category: "Main Course",
        time: "20",
        difficulty: "Easy",
        servings: 2,
        rating: 4.5,
        numReviews: 0,
        image: "https://images.unsplash.com/photo-1627308595186-e1af26f8c7b8?q=80&w=800",
        description: "A super quick, healthy, and high-protein meal perfect for gym-goers and weight loss enthusiasts.",
        ingredients: [
            "1 cup Soya Chunks (Nutrela)",
            "1 onion, chopped",
            "1 tomato, pureed",
            "1 tsp ginger-garlic paste",
            "1/2 cup curd (yogurt)",
            "1 tsp coriander powder",
            "1/2 tsp turmeric & chilli powder",
            "1 tbsp oil"
        ],
        steps: [
            "Boil soya chunks in salted water for 5 mins. Squeeze out all water and set aside.",
            "Heat oil in a pan. Add chopped onions and sauté until translucent.",
            "Add ginger-garlic paste and tomato puree. Cook for 3 minutes.",
            "Lower the heat, add whisked curd, and continuously stir to prevent splitting.",
            "Add all dry spices and the squeezed soya chunks.",
            "Simmer for 5-7 minutes until the gravy thickens and coats the chunks.",
            "Garnish with fresh coriander. Serve with roti or rice."
        ],
        region: "Global",
        dietType: "High Protein",
        calories: 210,
        protein: 26,
        carbs: 18,
        fat: 4
    },
    {
        title: "Khaman Dhokla",
        category: "Breakfast",
        time: "25",
        difficulty: "Medium",
        servings: 4,
        rating: 4.7,
        numReviews: 8,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=800",
        description: "A light, spongy, and healthy Gujarati breakfast made from a fermented gram flour batter, steamed and tempered with mustard seeds.",
        ingredients: [
            "1.5 cups besan (gram flour)",
            "1 tbsp semolina (rava)",
            "1.5 tsp Eno fruit salt",
            "1 tbsp lemon juice",
            "1 tbsp sugar",
            "1 tsp ginger-green chilli paste",
            "For tempering: 1 tbsp oil, mustard seeds, green chillies, curry leaves, 2 tbsp sugar dissolved in water"
        ],
        steps: [
            "Mix besan, semolina, ginger-chilli paste, lemon juice, sugar, salt, and water to make a smooth, lump-free batter.",
            "Prepare a steamer and grease a round thali (plate).",
            "Quickly whisk the Eno fruit salt into the batter; it will immediately become frothy.",
            "Pour the batter into the greased plate and steam on high flame for 15-18 minutes.",
            "Let it cool slightly, then cut into square pieces.",
            "In a small pan, heat oil, add mustard seeds, slit green chillies, and curry leaves. Add the sugar water and let it boil.",
            "Pour this sweet and tangy hot tempering evenly over the dhokla squares so they soak up the liquid.",
            "Garnish with fresh grated coconut and coriander."
        ],
        region: "Gujarati",
        dietType: "Healthy",
        calories: 160,
        protein: 7,
        carbs: 24,
        fat: 5
    },
    {
        title: "Street Style Anda Bhurji (Spicy Scrambled Eggs)",
        category: "Quick & Easy",
        time: "10",
        difficulty: "Easy",
        servings: 2,
        rating: 4.9,
        numReviews: 10,
        image: "https://images.unsplash.com/photo-1525916053308-3aa839497e7b?q=80&w=800",
        description: "Quick, spicy Indian scrambled eggs packed with onions, tomatoes, and robust spices. A perfect protein-rich meal you can whip up in 10 minutes.",
        ingredients: [
            "4 large eggs",
            "2 onions, finely chopped",
            "1 large tomato, chopped",
            "2 green chillies, finely chopped",
            "1 tsp pav bhaji masala or garam masala",
            "1/2 tsp turmeric",
            "2 tbsp butter or oil",
            "Fresh coriander for garnish"
        ],
        steps: [
            "Whisk the eggs lightly in a bowl with a pinch of salt.",
            "Heat butter in a pan. Add chopped onions and green chillies. Sauté until lightly browned.",
            "Add tomatoes and cook until soft and mushy.",
            "Stir in turmeric and pav bhaji/garam masala. Sauté for 1 minute.",
            "Pour in the whisked eggs. Keep stirring constantly on medium-low heat.",
            "Scramble until the eggs are cooked but still slightly soft and moist.",
            "Turn off the heat, mix in fresh coriander, and serve immediately with toasted butter pav or paratha."
        ],
        region: "Street Food",
        dietType: "High Protein",
        calories: 275,
        protein: 14,
        carbs: 8,
        fat: 20
    },
    {
        title: "Fat-Loss Masala Oats",
        category: "Healthy",
        time: "15",
        difficulty: "Easy",
        servings: 1,
        rating: 4.6,
        numReviews: 5,
        image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800",
        description: "A tangy, savory twist on regular oats loaded with vegetables. Perfect for a quick, filling, and low-calorie fat-loss meal.",
        ingredients: [
            "1/2 cup rolled oats",
            "1/4 cup mixed chopped vegetables (peas, carrots, beans)",
            "1 small onion, chopped",
            "1/2 small tomato, chopped",
            "1/2 tsp turmeric",
            "1/4 tsp garam masala",
            "1 tsp olive oil or ghee"
        ],
        steps: [
            "Heat oil in a small pan. Add onions and sauté until soft.",
            "Add mixed vegetables and tomatoes. Cook for a few minutes until slightly tender.",
            "Add turmeric, garam masala, and salt. Stir well.",
            "Add the rolled oats and mix so they get coated entirely in the spices.",
            "Pour in 1.5 cups of water. Bring to a boil, then reduce heat.",
            "Simmer for 5-7 minutes until the oats become thick and creamy.",
            "Serve hot. Can top with a spoonful of yogurt if desired."
        ],
        region: "Global",
        dietType: "Weight Loss",
        calories: 180,
        protein: 6,
        carbs: 28,
        fat: 4
    }
];

const seedRecipes = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is missing in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB via seed script...');

        await Recipe.insertMany(indianRecipes);

        console.log('✅ Successfully added Premium Regional and Health recipes to Database!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to inject recipes', err);
        process.exit(1);
    }
};

seedRecipes();
