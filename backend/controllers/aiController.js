import { GoogleGenerativeAI } from '@google/generative-ai';
import AIChat from '../models/AIChat.js';

// @desc    Generate recipe from ingredients and save to chat
// @route   POST /api/ai/chat
// @access  Public
export const generateRecipeChat = async (req, res) => {
    try {
        const { message, userId, chatId } = req.body;

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return res.status(500).json({ message: 'Gemini API Key missing in backend .env file.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are "Chilli", an energetic, fun, and highly emotional AI cooking companion. You have a fiery, spicy personality!
You are currently talking with a user. The user says: "${message}"

Your Instructions:
1. Personality: Instead of a boring chatbot, be full of personality, fun, and emotional about food! Use an exciting tone and emojis (like 🔥, 🌶️, ❤️).
   Example: If the user says "Hey Chef! What should I cook today?", you could reply: "Feeling spicy today? Let’s try masala pasta 🔥"
2. Formatting Rule: NEVER use the '#' character (no markdown headers, no hashtags). Keep the formatting clean and readable without headers.
3. Greetings/Small Talk: If the user just says hello or makes general small talk, respond warmly with your spicy personality to introduce yourself, and eagerly ask what ingredients they have or what they are craving. Do NOT provide a recipe yet.
4. Recipes/Cooking: If the user asks for a recipe or provides ingredients, give them a delicious recipe. Start with an engaging, overly enthusiastic, and emotional intro about the dish! Follow with a clear (but fun) ingredients list and relatively straightforward step-by-step instructions. Make them excited to cook it!`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Save to DB if user is logged in
        let chatRecord = null;
        if (userId) {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (chatId) {
                // Find existing chat session and append
                chatRecord = await AIChat.findById(chatId);
                if (chatRecord) {
                    chatRecord.messages.push({ type: 'user', text: message, timestamp });
                    chatRecord.messages.push({ type: 'ai', text: responseText, timestamp });
                    await chatRecord.save();
                }
            }

            // If no existing chat found or no chatId provided, create a new one
            if (!chatRecord) {
                chatRecord = new AIChat({
                    user: userId,
                    title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
                    messages: [
                        { type: 'user', text: message, timestamp },
                        { type: 'ai', text: responseText, timestamp }
                    ]
                });
                await chatRecord.save();
            }
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
        const history = await AIChat.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};

// @desc    Delete a specific chat history
// @route   DELETE /api/ai/history/:chatId
// @access  Public
export const deleteChatHistory = async (req, res) => {
    try {
        const chat = await AIChat.findById(req.params.chatId);
        if (chat) {
            await chat.deleteOne();
            res.json({ message: 'Chat deleted' });
        } else {
            res.status(404).json({ message: 'Chat not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat' });
    }
};
