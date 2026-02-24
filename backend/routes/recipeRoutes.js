import express from 'express';
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, createRecipeReview, resetRecipeRatings, getPendingRecipes, likeRecipe } from '../controllers/recipeController.js';

const router = express.Router();

router.route('/')
    .get(getRecipes)
    .post(createRecipe);

router.get('/pending', getPendingRecipes);

router.route('/:id')
    .get(getRecipeById)
    .put(updateRecipe)
    .delete(deleteRecipe);

router.post('/:id/like', likeRecipe);

router.route('/:id/reviews')
    .post(createRecipeReview)
    .delete(resetRecipeRatings);

export default router;
