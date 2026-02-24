import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/Recipe.js';

dotenv.config();

const newRecipes = [
    {
        title: "Authentic Italian Margherita Pizza",
        category: "Italian",
        time: "90", // prep and rest time
        difficulty: "Medium",
        servings: 2,
        rating: 4.8,
        description: "A classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil. The dough is fermented for optimal flavor.",
        ingredients: [
            "300g Tipo '00' flour",
            "200ml warm water",
            "1 tsp active dry yeast",
            "1 tsp salt",
            "400g canned San Marzano tomatoes (crushed)",
            "150g fresh mozzarella, torn",
            "Fresh basil leaves",
            "Extra virgin olive oil"
        ],
        steps: [
            "Mix warm water, yeast, and flour to form a dough. Add salt and knead for 10 minutes until smooth.",
            "Cover the dough and let it rest for at least 1 hour until doubled in size.",
            "Preheat your oven with a pizza stone inside to its maximum temperature (usually 500°F or higher).",
            "Stretch the dough into a 12-inch circle. Spread the crushed tomatoes over the base.",
            "Tear the mozzarella and distribute it evenly. Add a drizzle of olive oil.",
            "Bake directly on the pizza stone for 5-8 minutes until the crust is blistered and cheese is bubbling.",
            "Garnish with fresh basil immediately after taking it out of the oven."
        ],
        region: "Global",
        dietType: "Vegetarian",
        calories: 850,
        protein: 35,
        carbs: 110,
        fat: 25,
        image: ""
    },
    {
        title: "Traditional Beef Tacos",
        category: "Mexican",
        time: "30",
        difficulty: "Easy",
        servings: 4,
        rating: 4.7,
        description: "Simple, flavorful street-style Mexican tacos made with seasoned ground beef, fresh onions, and cilantro on warm corn tortillas.",
        ingredients: [
            "500g ground beef (80/20)",
            "1 onion, finely diced",
            "2 cloves garlic, minced",
            "1 tbsp chili powder",
            "1 tsp ground cumin",
            "1/2 tsp dried oregano",
            "1/2 cup beef broth",
            "8 small corn tortillas",
            "Fresh cilantro, chopped",
            "1 lime, cut into wedges"
        ],
        steps: [
            "Heat a large skillet over medium-high heat. Add ground beef and cook until browned. Drain excess fat.",
            "Add half of the diced onion and garlic to the beef. Sauté for 2 minutes.",
            "Stir in chili powder, cumin, oregano, and salt to taste.",
            "Pour in the beef broth and let simmer for 5-7 minutes until the liquid reduces and the meat is saucy.",
            "Warm the corn tortillas in a dry skillet for 30 seconds per side.",
            "Assemble the tacos: spoon beef onto the tortillas, top with the remaining fresh diced onion and cilantro.",
            "Serve immediately with a squeeze of fresh lime juice."
        ],
        region: "Global",
        dietType: "High Protein",
        calories: 420,
        protein: 28,
        carbs: 22,
        fat: 24,
        image: ""
    },
    {
        title: "Healthy Mediterranean Quinoa Salad",
        category: "Mediterranean",
        time: "20",
        difficulty: "Easy",
        servings: 3,
        rating: 4.9,
        description: "A bright, refreshing salad combining protein-packed quinoa with cucumber, tomatoes, olives, and feta cheese. Perfect for a quick, healthy lunch.",
        ingredients: [
            "1 cup dry quinoa",
            "2 cups water",
            "1 large cucumber, diced",
            "1 cup cherry tomatoes, halved",
            "1/2 cup Kalamata olives, pitted and sliced",
            "1/2 cup feta cheese, crumbled",
            "1/4 cup red onion, finely chopped",
            "3 tbsp extra virgin olive oil",
            "2 tbsp lemon juice",
            "1 tsp dried oregano"
        ],
        steps: [
            "Rinse quinoa under cold water. Combine quinoa and water in a saucepan, bring to a boil, then cover and simmer for 15 minutes.",
            "Remove quinoa from heat, let it sit covered for 5 minutes, then fluff with a fork. Let it cool completely.",
            "In a small bowl, whisk together the olive oil, lemon juice, dried oregano, salt, and pepper to create the dressing.",
            "In a large serving bowl, combine the cooled quinoa, cucumber, cherry tomatoes, olives, feta, and red onion.",
            "Pour the dressing over the salad and toss gently to combine everything.",
            "Refrigerate for at least 30 minutes before serving to let flavors meld."
        ],
        region: "Global",
        dietType: "Weight Loss",
        calories: 320,
        protein: 10,
        carbs: 35,
        fat: 16,
        image: ""
    },
    {
        title: "Japanese Teriyaki Salmon Bowls",
        category: "Japanese",
        time: "25",
        difficulty: "Medium",
        servings: 2,
        rating: 4.8,
        description: "A nutritious, high-protein Japanese dish featuring pan-seared salmon glazed with homemade sweet and savory teriyaki sauce, served over steamed rice.",
        ingredients: [
            "2 salmon fillets (about 6oz each)",
            "1/4 cup soy sauce",
            "2 tbsp mirin (sweet rice wine)",
            "1 tbsp sake or water",
            "1 tbsp brown sugar",
            "1 tsp fresh ginger, grated",
            "1 tsp sesame oil",
            "1 cup cooked jasmine rice",
            "1 cup steamed broccoli florets",
            "Sesame seeds and sliced green onions for garnish"
        ],
        steps: [
            "In a small bowl, mix soy sauce, mirin, sake (or water), brown sugar, and grated ginger to make the teriyaki sauce.",
            "Heat sesame oil in a non-stick skillet over medium-high heat. Season salmon fillets lightly with salt.",
            "Place salmon skin-side up in the pan and sear for 3-4 minutes until golden brown.",
            "Flip the salmon and pour the teriyaki sauce mixture into the pan.",
            "Spoon the sauce continuously over the salmon as it bubbles and thickens (about 3-4 minutes) until the salmon is cooked through and glazed.",
            "Divide the cooked rice and steamed broccoli into two bowls.",
            "Top each bowl with a glazed salmon fillet, drizzle with remaining pan sauce, and garnish with sesame seeds and green onions."
        ],
        region: "Global",
        dietType: "Healthy",
        calories: 550,
        protein: 42,
        carbs: 45,
        fat: 20,
        image: ""
    },
    {
        title: "Ultimate American Smashburger",
        category: "American",
        time: "15",
        difficulty: "Easy",
        servings: 2,
        rating: 4.9,
        description: "The classic diner-style American burger. Thin, crispy-edged beef patties, melty American cheese, and a buttery toasted bun.",
        ingredients: [
            "300g ground beef (80/20 fat ratio), cold",
            "2 brioche buns, sliced",
            "2 slices American cheese",
            "1/4 cup mayonnaise",
            "1 tbsp ketchup",
            "1 tsp pickle relish",
            "Salt and freshly cracked black pepper",
            "1 tbsp butter",
            "Shredded iceberg lettuce",
            "Dill pickle slices"
        ],
        steps: [
            "Divide the cold ground beef into two equal portions and gently form them into loose balls. Do not over-pack them.",
            "Mix mayonnaise, ketchup, and pickle relish in a small bowl to make the burger sauce.",
            "Heat a cast-iron skillet over high heat until it's smoking hot. Butter the cut sides of the buns and toast them in the pan until golden. Remove buns.",
            "Place the meat balls into the dry, hot skillet. Immediately smash them completely flat using a heavy spatula.",
            "Season the flattened patties generously with salt and pepper. Let them cook undisturbed for 2 minutes until the edges are crispy and brown.",
            "Scrape the pan under the patties to keep the crust intact, and flip them.",
            "Immediately place a slice of cheese on each patty. Cook for 1 more minute until cheese is melted.",
            "Assemble the burger: bun bottom, sauce, lettuce, pickles, cheesy smash patty, and the top bun."
        ],
        region: "Global",
        dietType: "Weight Gain",
        calories: 780,
        protein: 38,
        carbs: 35,
        fat: 55,
        image: ""
    },
    {
        title: "Vegan Buddha Bowl",
        category: "Healthy",
        time: "25",
        difficulty: "Easy",
        servings: 2,
        rating: 4.6,
        description: "A massive, nutrient-dense bowl filled with roasted sweet potatoes, crispy chickpeas, avocado, and a creamy tahini dressing.",
        ingredients: [
            "1 large sweet potato, cubed",
            "1 can (15oz) chickpeas, rinsed and dried",
            "2 cups kale or spinach, chopped",
            "1 avocado, sliced",
            "1/2 cup cooked brown rice or quinoa",
            "1 tbsp olive oil",
            "1 tsp smoked paprika",
            "1/4 cup tahini",
            "1 tbsp maple syrup",
            "1 tbsp lemon juice"
        ],
        steps: [
            "Preheat oven to 400°F (200°C). Toss sweet potatoes and chickpeas with olive oil, paprika, salt, and pepper.",
            "Spread on a baking sheet and roast for 20-25 minutes until chickpeas are crispy and sweet potatoes are tender.",
            "While roasting, whisk together tahini, maple syrup, lemon juice, and a splash of warm water until smooth to make the dressing.",
            "Massage the kale/spinach with a tiny drop of olive oil for 1 minute until it softens and turns bright green.",
            "Assemble the bowls: lay down a base of brown rice and massaged greens.",
            "Top with roasted sweet potatoes, crispy chickpeas, and fresh avocado slices.",
            "Drizzle heavily with the creamy tahini dressing before serving."
        ],
        region: "Global",
        dietType: "Vegan",
        calories: 520,
        protein: 18,
        carbs: 65,
        fat: 24,
        image: ""
    },
    {
        title: "Spicy Kung Pao Chicken",
        category: "Chinese",
        time: "20",
        difficulty: "Medium",
        servings: 3,
        rating: 4.7,
        description: "A highly addictive stir-fry featuring tender chicken, crunchy peanuts, and a sweet, spicy, and savory sauce.",
        ingredients: [
            "400g chicken breast, cut into bite-sized cubes",
            "1/2 cup roasted unsalted peanuts",
            "4-5 dried red chilies, lightly crushed",
            "1/2 red bell pepper, diced",
            "2 green onions, chopped",
            "2 cloves garlic, minced",
            "2 tbsp soy sauce",
            "1 tbsp hoisin sauce",
            "1 tsp cornstarch mixed with 1 tbsp water",
            "2 tbsp vegetable oil"
        ],
        steps: [
            "In a small bowl, mix soy sauce, hoisin sauce, and a pinch of sugar. Set aside.",
            "Toss the chicken cubes lightly with salt, pepper, and a tiny bit of cornstarch.",
            "Heat oil in a wok or large skillet over high heat. Add the chicken and cook for 4-5 minutes until browned and mostly cooked through. Remove and set aside.",
            "In the same wok, add the dried chilies, garlic, and bell pepper. Stir-fry rapidly for 1 minute until fragrant.",
            "Return the chicken to the wok. Pour in the soy/hoisin sauce mixture.",
            "Add the cornstarch slurry and stir constantly for 1 minute until the sauce thickens and coats the chicken.",
            "Turn off the heat. Stir in the peanuts and chopped green onions.",
            "Serve steaming hot with jasmine rice."
        ],
        region: "Global",
        dietType: "High Protein",
        calories: 410,
        protein: 36,
        carbs: 12,
        fat: 22,
        image: ""
    }
];

const seedMoreRecipes = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is missing in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB via seed script...');

        await Recipe.insertMany(newRecipes);

        console.log('✅ Successfully added Global & Health recipes to Database without images!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to inject recipes', err);
        process.exit(1);
    }
};

seedMoreRecipes();
