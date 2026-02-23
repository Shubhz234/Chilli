import { GoogleGenerativeAI } from '@google/generative-ai';
import AIChat from '../models/AIChat.js';

// @desc    Generate recipe from ingredients and save to chat
// @route   POST /api/ai/chat
// @access  Public
export const generateRecipeChat = async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return res.status(500).json({ message: 'Gemini API Key missing in backend .env file.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are Chilli, a professional and highly conversant AI Sous-Chef. You are currently talking with a user. The user says: "${message}"

Your Instructions:
1. If the user is just saying hello, greeting you, or making general small talk: Respond warmly and professionally like a real chef. Introduce yourself as Chilli, and ask them what ingredients they have in their kitchen or what dish they are craving today. Do NOT provide any recipe in this case.
2. If the user provides specific ingredients or asks for a particular recipe type: Give them a practical, delicious recipe based exactly on what they asked for. Format the recipe neatly with a brief engaging intro, a clear ingredients list, and step-by-step instructions.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Save to DB if user is logged in
        let chatRecord;
        if (userId) {
            chatRecord = new AIChat({
                user: userId,
                userInput: message,
                aiResponse: responseText
            });
            await chatRecord.save();
        }

        res.json({ text: responseText, chatId: chatRecord ? chatRecord._id : null });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: 'AI generation failed', error: error.message });
    }
};

// @desc    Get user chat history
// @route   GET /api/ai/history/:userId
// @access  Public
export const getChatHistory = async (req, res) => {
    try {
        const history = await AIChat.find({ user: req.params.userId }).sort({ createdAt: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};
