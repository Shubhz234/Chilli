import React, { useState, useRef, useEffect } from 'react';
import { ChefHat, Send, Sparkles, User, Image as ImageIcon, Camera } from 'lucide-react';

const ChilliAI = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: "Hi there! I'm Chilli, your personal AI Chef. Tell me what ingredients you have, or ask me for recipe recommendations!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            let aiText = "That sounds delicious! I can certainly help you with that.";
            if (input.toLowerCase().includes('egg') && input.toLowerCase().includes('tomato')) {
                aiText = "With eggs and tomatoes, we can make a brilliant classic! How about a Quick Chinese Tomato Egg Stir-fry? It's comforting, takes 15 minutes, and pairs perfectly with some rice. Shall I give you the recipe?";
            }

            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: aiText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">

            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-primary-100/40 to-orange-100/40 blur-3xl"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-rose-100/40 to-primary-100/40 blur-3xl"></div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-80px)]">

                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-t-3xl border border-b-0 border-primary-100 p-6 flex items-center justify-between shadow-sm z-10 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <ChefHat className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Chilli AI <Sparkles className="w-4 h-4 text-orange-400" />
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">Always ready to cook</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold hover:bg-primary-100 transition-colors">
                        New Chat
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white/60 backdrop-blur-md border border-primary-100/50 p-6 overflow-y-auto scroll-smooth custom-scrollbar relative z-0">
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.type === 'ai'
                                        ? 'bg-gradient-to-br from-primary-500 to-orange-500'
                                        : 'bg-gray-800'
                                    }`}>
                                    {msg.type === 'ai' ? <ChefHat className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${msg.type === 'ai'
                                            ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                                            : 'bg-gray-900 text-white rounded-tr-sm'
                                        }`}>
                                        <p className="leading-relaxed text-[15px]">{msg.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-2 font-medium px-1">{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4 animate-fade-in">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <ChefHat className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white/90 backdrop-blur-xl border border-t-0 border-primary-100 rounded-b-3xl p-4 sm:p-6 shadow-lg z-10 animate-fade-in relative z-20">
                    <form onSubmit={handleSend} className="flex gap-3 items-end">
                        <div className="flex gap-2">
                            <button type="button" className="p-3 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all h-14 w-14 flex items-center justify-center border border-gray-100 bg-white">
                                <ImageIcon className="w-6 h-6" />
                            </button>
                            <button type="button" className="p-3 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all h-14 w-14 flex items-center justify-center border border-gray-100 bg-white sm:flex hidden">
                                <Camera className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Chilli about recipes, ingredients, or cooking tips..."
                                className="w-full bg-gray-50 border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 rounded-2xl py-4 pl-4 pr-12 outline-none transition-all text-gray-700 shadow-inner"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:hover:bg-primary-600 text-white rounded-2xl px-6 py-4 transition-all shadow-md flex items-center gap-2 font-semibold h-14"
                        >
                            <span className="hidden sm:inline">Send</span>
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-xs text-gray-400 font-medium tracking-wide">Chilli AI can make mistakes. Consider verifying important information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChilliAI;
