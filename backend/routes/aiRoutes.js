import express from 'express';
import { generateRecipeChat, getChatHistory, deleteChatHistory } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', generateRecipeChat);
router.get('/history/:userId', getChatHistory);
router.delete('/history/:chatId', deleteChatHistory);

export default router;
