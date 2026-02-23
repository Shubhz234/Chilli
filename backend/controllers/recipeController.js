import Recipe from '../models/Recipe.js';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({}).sort({ createdAt: -1 });
        const mappedRecipes = recipes.map(r => ({ ...r._doc, id: r._id.toString() }));
        res.json(mappedRecipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching recipes' });
    }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching recipe' });
    }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private/Admin (Will add auth middleware later)
export const createRecipe = async (req, res) => {
    try {
        const { title, category, time, difficulty, servings, image, videoUrl, description, ingredients, steps } = req.body;

        const recipe = new Recipe({
            title,
            category,
            time,
            difficulty: difficulty || 'Medium',
            servings: servings || 4,
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            videoUrl,
            description,
            ingredients,
            steps
        });

        const createdRecipe = await recipe.save();
        res.status(201).json(createdRecipe);
    } catch (error) {
        res.status(400).json({ message: 'Invalid recipe data', error: error.message });
    }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private/Admin
export const updateRecipe = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const { title, category, time, difficulty, servings, image, videoUrl, description, ingredients, steps } = req.body;

        const recipe = await Recipe.findById(req.params.id);

        if (recipe) {
            recipe.title = title || recipe.title;
            recipe.category = category || recipe.category;
            recipe.time = time || recipe.time;
            recipe.difficulty = difficulty || recipe.difficulty;
            recipe.servings = servings || recipe.servings || 4;
            recipe.image = image || recipe.image;
            recipe.videoUrl = videoUrl || recipe.videoUrl;
            recipe.description = description || recipe.description;
            // Update arrays only if provided
            if (ingredients) recipe.ingredients = ingredients;
            if (steps) recipe.steps = steps;

            const updatedRecipe = await recipe.save();
            res.json(updatedRecipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid recipe data for update' });
    }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private/Admin
export const deleteRecipe = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const recipe = await Recipe.findById(req.params.id);

        if (recipe) {
            await recipe.deleteOne();
            res.json({ message: 'Recipe removed successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting recipe' });
    }
};
