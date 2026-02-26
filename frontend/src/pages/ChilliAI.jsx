import React, { useState, useRef, useEffect } from 'react';
import { ChefHat, Send, Menu, Plus, MessageSquare, Trash2, Home, Utensils, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChilliAI = () => {
    const navigate = useNavigate();
    const initialMessage = {
        id: 1,
        type: 'ai',
        text: "Hi there! I'm Chilli, your personal AI Chef. Tell me what ingredients you have, or ask me for recipe recommendations!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const fetchHistory = async () => {
            const storedUser = localStorage.getItem('chilli_user');
            if (storedUser) {
                const userId = JSON.parse(storedUser).id;
                try {
                    const res = await fetch(`/api/ai/history/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setHistory(data.reverse());
                    }
                } catch (err) {
                    console.error("Error fetching history");
                }
            }
        };
        fetchHistory();
    }, []);

    const handleNewChat = () => {
        setMessages([initialMessage]);
        setActiveChatId(null);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const loadChat = (chatItem) => {
        setActiveChatId(chatItem._id);
        if (chatItem.messages && chatItem.messages.length > 0) {
            setMessages(chatItem.messages.map((m, i) => ({
                id: m._id || Date.now() + i,
                type: m.type,
                text: m.text,
                timestamp: m.timestamp || new Date(chatItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            })));
        } else {
            setMessages([
                {
                    id: Date.now(),
                    type: 'user',
                    text: chatItem.userInput,
                    timestamp: new Date(chatItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
                {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: chatItem.aiResponse,
                    timestamp: new Date(chatItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const deleteChat = async (e, chatId) => {
        e.stopPropagation();
        try {
            const res = await fetch(`/api/ai/history/${chatId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setHistory(prev => prev.filter(c => c._id !== chatId));
                if (activeChatId === chatId) {
                    handleNewChat();
                }
            }
        } catch (err) {
            console.error("Error deleting chat");
        }
    };

    const handleSend = async (e) => {
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

        const storedUser = localStorage.getItem('chilli_user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text, userId, chatId: activeChatId })
            });

            if (res.ok) {
                const data = await res.json();
                const aiMsg = {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: data.text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, aiMsg]);

                if (data.chatId) {
                    setActiveChatId(data.chatId);
                    setHistory(prev => {
                        const existingChat = prev.find(c => c._id === data.chatId);
                        if (existingChat) {
                            return prev.map(c => c._id === data.chatId ? {
                                ...c,
                                messages: [...(c.messages || []), { type: 'user', text: userMsg.text }, { type: 'ai', text: data.text }]
                            } : c);
                        } else {
                            return [{
                                _id: data.chatId,
                                title: userMsg.text.substring(0, 30) + (userMsg.text.length > 30 ? '...' : ''),
                                messages: [{ type: 'user', text: userMsg.text }, { type: 'ai', text: data.text }],
                                createdAt: new Date().toISOString()
                            }, ...prev];
                        }
                    });
                }
            } else {
                const errData = await res.json();
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: `Oops! My kitchen had a tiny fire: ${errData.message || 'Could not connect.'}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'ai',
                text: "I'm having trouble connecting to my kitchen server right now. Let me grab my whisk and try later.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="relative min-h-[100dvh] bg-transparent pt-20 pb-4 overflow-hidden flex flex-col font-sans">

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl -z-10 animate-blob"></div>
            <div className="absolute bottom-40 left-10 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 flex gap-4 xl:gap-6 relative h-[calc(100dvh-80px)] sm:h-[calc(100dvh-100px)] z-10">

                {/* Glass Sidebar */}
                <div
                    className={`absolute md:relative left-0 top-0 h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-40 
                        ${isSidebarOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-[110%] md:w-0 md:translate-x-0'} 
                        md:${isSidebarOpen ? 'w-[280px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="glass-panel w-full h-full rounded-[30px] flex flex-col overflow-hidden shadow-xl border border-white/60">
                        {/* Sidebar Header */}
                        <div className="p-5 border-b border-gray-100/50 bg-white/40">
                            <button
                                onClick={handleNewChat}
                                className="w-full liquid-button shadow-md flex items-center justify-center gap-2 py-3 rounded-2xl text-sm tracking-wide"
                            >
                                <Plus className="w-4 h-4" /> Start New Recipe
                            </button>
                        </div>

                        {/* Sidebar History */}
                        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-3">Kitchen History</h3>
                            {history.length === 0 ? (
                                <div className="text-center py-8">
                                    <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400 font-medium">No previous cooks.</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {history.map((item) => (
                                        <div
                                            key={item._id}
                                            className={`group w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer backdrop-blur-sm 
                                                ${activeChatId === item._id
                                                    ? 'bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200 shadow-sm'
                                                    : 'hover:bg-white/60 border border-transparent'}`}
                                            onClick={() => loadChat(item)}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                                                    ${activeChatId === item._id ? 'bg-orange-100' : 'bg-gray-100 group-hover:bg-white'}`}>
                                                    <MessageSquare className={`w-4 h-4 ${activeChatId === item._id ? 'text-orange-500' : 'text-gray-400'}`} />
                                                </div>
                                                <p className={`text-sm truncate font-medium ${activeChatId === item._id ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {item.title || item.userInput}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => deleteChat(e, item._id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-100 hover:text-rose-500 text-gray-400 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Chat Container */}
                <div className="flex-1 h-full flex flex-col glass-panel rounded-none sm:rounded-[30px] md:rounded-[40px] shadow-2xl border-x-0 border-b-0 sm:border border-white/60 overflow-hidden relative backdrop-blur-3xl bg-white/50">

                    {/* Header */}
                    <header className="flex items-center justify-between p-4 sm:px-8 sm:py-5 bg-white/40 border-b border-gray-100/50 backdrop-blur-md z-20">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 sm:p-2.5 bg-white shadow-sm hover:shadow text-gray-600 hover:text-orange-500 rounded-full transition-all"
                            >
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/30">
                                    <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">Chilli AI</h1>
                                    <p className="text-xs text-orange-500 font-medium tracking-wide uppercase">Your Kitchen Companion</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="p-2.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <span className="hidden sm:block">Back Home</span>
                            <Home className="w-5 h-5" />
                        </button>
                    </header>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
                        {messages.length === 1 && activeChatId === null && (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in opacity-80 pt-10 pb-20">
                                <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-orange-100 to-red-50 flex items-center justify-center shadow-inner transform rotate-3">
                                    <ChefHat className="w-12 h-12 text-orange-500 drop-shadow-sm" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Cook something incredible.</h2>
                                <p className="text-lg text-gray-500 max-w-md mx-auto font-medium">
                                    Tell Chilli what ingredients you have in your kitchen, and magic will happen.
                                </p>
                            </div>
                        )}

                        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
                            {messages.map((msg, idx) => {
                                // Don't show the initial hidden greeting if we're generating custom views
                                if (idx === 0 && activeChatId === null && messages.length === 1) return null;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 sm:gap-5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                                    >
                                        {msg.type === 'ai' && (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 z-10">
                                                <ChefHat className="w-6 h-6 text-white" />
                                            </div>
                                        )}

                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                            {msg.type === 'user' ? (
                                                <div className="px-4 sm:px-6 py-3 sm:py-4 rounded-[24px] rounded-tr-[8px] bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl shadow-gray-900/10">
                                                    <p className="leading-relaxed text-[15px] sm:text-[16px] font-medium break-words">{msg.text}</p>
                                                </div>
                                            ) : (
                                                <div className="px-4 sm:px-7 py-3 sm:py-6 rounded-[28px] rounded-tl-[10px] glass-panel bg-white/80 text-gray-800 shadow-xl border border-white/80 w-full">
                                                    <div className="prose prose-orange max-w-none text-[15px] sm:text-[16px] leading-relaxed font-medium">
                                                        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-bold">$1</strong>').replace(/\n/g, '<br />') }} />
                                                    </div>
                                                </div>
                                            )}
                                            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mt-2 px-2">
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {isTyping && (
                                <div className="flex gap-4 sm:gap-5 items-end animate-fade-in pl-2">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                                        <ChefHat className="w-6 h-6 text-white animate-pulse" />
                                    </div>
                                    <div className="px-6 py-5 rounded-[32px] rounded-tl-[10px] glass-panel bg-white/80 flex items-center gap-2 shadow-xl border border-white/80">
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-bounce"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="w-full shrink-0 pt-4 pb-4 sm:pb-6 z-20 px-2 sm:px-6 lg:px-10 sm:bg-gradient-to-t sm:from-white/90 sm:via-white/80 sm:to-transparent backdrop-blur-md sm:backdrop-blur-[2px] border-t border-white/40 sm:border-t-0">
                        <div className="max-w-4xl mx-auto w-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-[36px] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                            <form
                                onSubmit={handleSend}
                                className="relative flex items-end bg-white/90 backdrop-blur-xl rounded-[32px] p-2 shadow-2xl border border-white focus-within:bg-white transition-all duration-300"
                            >
                                <button type="button" className="p-3.5 sm:p-4 text-gray-400 hover:text-orange-500 transition-colors rounded-full hover:bg-orange-50 mb-0.5" title="Upload an Image">
                                    <ImageIcon className="w-6 h-6" />
                                </button>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your ingredients or ask for a recipe..."
                                    rows={1}
                                    className="flex-1 bg-transparent border-none py-3 sm:py-4 px-2 focus:outline-none focus:ring-0 text-gray-900 text-[15px] sm:text-[17px] font-medium placeholder-gray-400 resize-none min-h-[48px] sm:min-h-[56px] max-h-[120px] sm:max-h-[160px] overflow-y-auto custom-scrollbar leading-relaxed"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                />

                                <div className="mb-0.5 mr-1">
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className={`p-3.5 sm:p-4 rounded-full transition-all duration-300 transform shadow-md
                                            ${!input.trim() || isTyping
                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}`}
                                    >
                                        <Send className={`w-5 h-5 sm:w-6 sm:h-6 ${input.trim() ? 'ml-0.5' : ''}`} />
                                    </button>
                                </div>
                            </form>
                            <div className="text-center mt-3 hidden sm:block">
                                <p className="text-[12px] text-gray-500 font-semibold tracking-wide drop-shadow-sm">Chilli loves to experiment, but please verify recipes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChilliAI;

