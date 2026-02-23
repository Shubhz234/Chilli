import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    messages: [{
        type: { type: String, enum: ['user', 'ai'], required: true },
        text: { type: String, required: true },
        timestamp: { type: String }
    }]
}, {
    timestamps: true
});

const AIChat = mongoose.model('AIChat', aiChatSchema);
export default AIChat;
