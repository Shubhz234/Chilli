import express from 'express';
import { generateRecipeChat, getChatHistory } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', generateRecipeChat);
router.get('/history/:userId', getChatHistory);

export default router;
