import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import userRoutes from './routes/userRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        return;
    }
    try {
        if (!process.env.MONGO_URI || process.env.MONGO_URI === 'your_mongodb_atlas_connection_string_here') {
            console.warn('MongoDB URI is not configured yet. Server is running without database connection.');
            return;
        }
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB Atlas Connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // DO NOT exit process in serverless!
    }
};

// Ensure database connects before serving API requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('Chilli API is running on Vercel...');
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Configuration loaded.`);
    });
}

export default app;
