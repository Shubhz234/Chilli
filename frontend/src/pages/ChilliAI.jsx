import React, { useState, useRef, useEffect } from 'react';
import { ChefHat, Send, Sparkles, User, Image as ImageIcon, Camera, Menu, Plus, MessageSquare, Trash2 } from 'lucide-react';

const ChilliAI = () => {
    const initialMessage = {
        id: 1,
        type: 'ai',
        text: "Hi there! I'm Chilli, your personal AI Chef. Tell me what ingredients you have, or ask me for recipe recommendations!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
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
                    const res = await fetch(`http://localhost:5000/api/ai/history/${userId}`);
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
            // Graceful fallback for older single-prompt chat records
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
            const res = await fetch(`http://localhost:5000/api/ai/history/${chatId}`, {
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

        // Grab logged-in user if available to link the chat history on backend
        const storedUser = localStorage.getItem('chilli_user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;

        try {
            const res = await fetch('http://localhost:5000/api/ai/chat', {
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
                    // Update history locally instead of full refetch to remain fast
                    setHistory(prev => {
                        const existingChat = prev.find(c => c._id === data.chatId);
                        if (existingChat) {
                            // Update existing Array
                            return prev.map(c => c._id === data.chatId ? {
                                ...c,
                                messages: [...(c.messages || []), { type: 'user', text: userMsg.text }, { type: 'ai', text: data.text }]
                            } : c);
                        } else {
                            // New Chat
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
                    text: `Oops! There was an issue: ${errData.message || 'Could not connect to AI.'}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'ai',
                text: "I'm having trouble connecting to my kitchen server right now. Please try again later.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex pt-20 overflow-hidden">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'} overflow-hidden transition-all duration-300 ease-in-out bg-[#f0f4f9] flex flex-col h-[calc(100vh-80px)] flex-shrink-0 z-40 md:relative absolute shadow-2xl md:shadow-none`}>
                <div className="p-4 w-64 flex flex-col h-full opacity-100">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-3 px-4 py-3 bg-[#e9eef6] text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors mb-6 shadow-sm mx-1 cursor-pointer"
                    >
                        <Plus className="w-5 h-5 text-gray-500" />
                        New Chat
                    </button>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <h3 className="text-[11px] font-bold text-gray-500 mb-3 px-3 uppercase tracking-wider">Recent</h3>
                        {history.length === 0 ? (
                            <p className="text-sm text-gray-400 px-3 font-medium">No previous chats.</p>
                        ) : (
                            <div className="space-y-1">
                                {history.map((item) => (
                                    <div
                                        key={item._id}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left group cursor-pointer ${activeChatId === item._id ? 'bg-[#d3e3fd]' : 'hover:bg-[#e4e9f1]'}`}
                                        onClick={() => loadChat(item)}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                            <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeChatId === item._id ? 'text-primary-600' : 'text-gray-500'}`} />
                                            <p className={`text-[13.5px] truncate font-medium ${activeChatId === item._id ? 'text-primary-800' : 'text-gray-700'}`}>
                                                {item.title || item.userInput}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => deleteChat(e, item._id)}
                                            className="ml-2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-rose-100 text-rose-500 rounded-lg transition-all flex-shrink-0"
                                            title="Delete Chat"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Chat Column */}
            <div className="flex-1 flex flex-col h-[calc(100vh-80px)] relative min-w-0 bg-white shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] md:shadow-none rounded-tl-2xl md:rounded-none z-10 w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 z-10 sticky top-0 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-100 md:border-none">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 hover:bg-[#f0f4f9] rounded-full transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e9eef6]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="text-xl font-medium text-gray-700 flex items-center gap-2 px-2">
                            Chilli AI <Sparkles className="w-5 h-5 text-[#3b82f6]" />
                        </span>
                    </div>

                    <button
                        onClick={handleNewChat}
                        className="p-2.5 hover:bg-[#f0f4f9] rounded-full transition-colors text-gray-600 md:hidden flex items-center justify-center"
                        title="New Chat"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col h-full relative">
                    {/* Chat Area */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto scroll-smooth custom-scrollbar mb-24">
                        <div className="space-y-8 pb-10">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    {msg.type === 'ai' && (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent mt-1">
                                            <Sparkles className="w-5 h-5 text-[#3b82f6]" />
                                        </div>
                                    )}

                                    <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                        {msg.type === 'user' ? (
                                            <div className="px-5 py-3 rounded-[24px] bg-[#f0f4f9] text-gray-800">
                                                <p className="leading-relaxed text-[15px]">{msg.text}</p>
                                            </div>
                                        ) : (
                                            <div className="py-1 text-gray-800">
                                                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} className="leading-relaxed text-[16px]" style={{ whiteSpace: 'pre-wrap' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 animate-fade-in">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-transparent mt-1">
                                        <Sparkles className="w-5 h-5 text-[#3b82f6] animate-pulse" />
                                    </div>
                                    <div className="py-2 flex gap-1.5 items-center">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-4 sm:pb-8 z-20 px-4 sm:px-8">
                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSend} className="relative flex items-end bg-[#f0f4f9] rounded-[24px] px-2 py-2 shadow-sm focus-within:bg-[#e9eef6] transition-colors">
                                <button type="button" className="p-3 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-200/50 mb-0.5">
                                    <ImageIcon className="w-5 h-5" />
                                </button>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask Chilli about recipes or ingredients"
                                    rows={1}
                                    className="flex-1 bg-transparent border-none py-3 px-2 focus:outline-none focus:ring-0 text-gray-800 text-[16px] placeholder-gray-500 resize-none min-h-[44px] max-h-[150px] overflow-y-auto"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                />

                                {input.trim() ? (
                                    <button
                                        type="submit"
                                        className="p-2 bg-gray-900 text-white hover:bg-black transition-colors rounded-full mx-2 mb-1 shadow-md"
                                    >
                                        <Send className="w-5 h-5 ml-0.5" />
                                    </button>
                                ) : (
                                    <button type="button" className="p-3 text-gray-500 hover:text-gray-800 transition-colors rounded-full mx-1 mb-0.5">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                )}
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-[12px] text-gray-500 tracking-wide font-medium">Chilli can make mistakes, so double-check it.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChilliAI;
