import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({
            $or: [{ status: 'approved' }, { status: { $exists: false } }]
        }).sort({ createdAt: -1 }).populate('author', 'name profilePhoto');
        const mappedRecipes = recipes.map(r => ({ ...r._doc, id: r._id.toString() }));
        res.json(mappedRecipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching recipes' });
    }
};

// @desc    Get pending recipes (Admin only)
// @route   GET /api/recipes/pending
// @access  Private/Admin
export const getPendingRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('author', 'name profilePhoto');
        const mappedRecipes = recipes.map(r => ({ ...r._doc, id: r._id.toString() }));
        res.json(mappedRecipes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching pending recipes' });
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
        const recipe = await Recipe.findById(req.params.id).populate('author', 'name profilePhoto followers');
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
        const { title, category, time, difficulty, servings, image, videoUrl, description, ingredients, steps, region, dietType, calories, protein, carbs, fat, author, status } = req.body;

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
            steps,
            region: region || 'Global',
            dietType: dietType || 'Any',
            calories: calories || 0,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            author,
            status: status || 'pending',
            likes: []
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

        const { title, category, time, difficulty, servings, image, videoUrl, description, ingredients, steps, region, dietType, calories, protein, carbs, fat, status } = req.body;

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
            recipe.region = region || recipe.region;
            recipe.dietType = dietType || recipe.dietType;
            if (status && status === 'approved' && recipe.status !== 'approved' && recipe.author) {
                const authorUser = await User.findById(recipe.author);
                if (authorUser) {
                    authorUser.notifications.push({
                        type: 'recipe_approved',
                        message: `Your recipe "${recipe.title}" has been approved!`,
                        link: `/recipe/${recipe._id}`
                    });
                    await authorUser.save();
                }
            }

            if (status) recipe.status = status;
            if (calories !== undefined) recipe.calories = calories;
            if (protein !== undefined) recipe.protein = protein;
            if (carbs !== undefined) recipe.carbs = carbs;
            if (fat !== undefined) recipe.fat = fat;
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
            const { reason } = req.body;

            if (recipe.author && recipe.status === 'pending') {
                const authorUser = await User.findById(recipe.author);
                if (authorUser) {
                    authorUser.notifications.push({
                        type: 'recipe_rejected',
                        message: `Your recipe "${recipe.title}" was not approved.`,
                        reason: reason || 'Does not meet community guidelines.',
                        link: '/upload'
                    });
                    await authorUser.save();
                }
            }

            await recipe.deleteOne();
            res.json({ message: 'Recipe removed successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting recipe' });
    }
};

// @desc    Create new recipe review
// @route   POST /api/recipes/:id/reviews
// @access  Public (Expects user info in body)
export const createRecipeReview = async (req, res) => {
    try {
        const { rating, comment, userId, userName } = req.body;
        if (!userId) return res.status(400).json({ message: 'User ID is required' });

        const recipe = await Recipe.findById(req.params.id);

        if (recipe) {
            const alreadyReviewed = recipe.reviews.find((r) => r.userId === userId);

            if (alreadyReviewed) {
                alreadyReviewed.rating = Number(rating);
                alreadyReviewed.comment = comment;
            } else {
                const review = {
                    name: userName || 'Anonymous',
                    rating: Number(rating),
                    comment,
                    userId
                };
                recipe.reviews.push(review);
            }

            recipe.numReviews = recipe.reviews.length;
            recipe.rating = recipe.reviews.reduce((acc, item) => item.rating + acc, 0) / recipe.reviews.length;

            await recipe.save();
            res.status(201).json({ message: 'Review added', recipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error processing review', error: error.message });
    }
};

// @desc    Admin reset ratings
// @route   DELETE /api/recipes/:id/reviews
// @access  Private/Admin
export const resetRecipeRatings = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            recipe.reviews = [];
            recipe.numReviews = 0;
            recipe.rating = 0;
            await recipe.save();
            res.json({ message: 'Ratings reset successfully', recipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error resetting ratings', error: error.message });
    }
};

// @desc    Toggle like on recipe
// @route   POST /api/recipes/:id/like
// @access  Public (needs userId in body)
export const likeRecipe = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: 'User ID is required' });

        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            const index = recipe.likes.findIndex(id => id.toString() === userId.toString());

            if (index === -1) {
                // Like
                recipe.likes.push(userId);
            } else {
                // Unlike
                recipe.likes.splice(index, 1);
            }

            await recipe.save();
            res.json({ message: 'Like status toggled', likes: recipe.likes });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error liking recipe', error: error.message });
    }
};
