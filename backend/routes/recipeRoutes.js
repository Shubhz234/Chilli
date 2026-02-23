import express from 'express';
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, createRecipeReview, resetRecipeRatings } from '../controllers/recipeController.js';

const router = express.Router();

router.route('/')
    .get(getRecipes)
    .post(createRecipe);

router.route('/:id')
    .get(getRecipeById)
    .put(updateRecipe)
    .delete(deleteRecipe);

router.route('/:id/reviews')
    .post(createRecipeReview)
    .delete(resetRecipeRatings);

export default router;
