import React, { useState } from 'react';
import { ChefHat, Search, ArrowRight, Play, Star, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate('/recipes', { state: { searchTerm: searchTerm.trim() } });
        } else {
            navigate('/recipes');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-20 -left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-8 animate-fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                            <span className="text-sm font-medium text-gray-600">Powered by advanced AI matching</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Your Intelligent <br className="hidden md:block" />
                            <span className="text-gradient">Culinary Companion</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Discover, learn, and cook with Chilli. From smart ingredient-based searches to AI-guided step-by-step videos, master your kitchen today.
                        </p>

                        {/* Global Search Bar */}
                        <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-primary-500/5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <form className="flex items-center gap-2" onSubmit={handleSearch}>
                                <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border border-transparent focus-within:border-primary-100 focus-within:bg-white transition-all">
                                    <Search className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder='Try "Paneer Tikka" or "I have eggs and tomatoes..."'
                                        className="w-full bg-transparent border-none py-4 px-3 focus:outline-none text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 flex items-center gap-2">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured AI Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-orange-50 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
                            <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-orange-400"></div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 w-full">
                                        <p className="text-gray-700 text-sm">I have some leftover rice, two eggs, and a tomato. What can I make?</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <ChefHat className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-primary-50 rounded-2xl rounded-tl-none p-4 w-full border border-primary-100">
                                        <p className="text-gray-800 text-sm font-medium mb-2">I can help with that! Let's make a quick Tomato Egg Fried Rice.</p>
                                        <p className="text-gray-600 text-sm mb-3">It's a classic comfort food that takes only 15 minutes.</p>
                                        <button className="text-primary-600 font-semibold text-sm flex items-center gap-1 hover:text-primary-700">
                                            View Recipe <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Meet Chilli, your <span className="text-gradient">AI Sous-Chef</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Stuck with random ingredients? Not sure how to substitute a missing item? Chilli uses advanced AI to understand what you have, suggest perfect recipes, and guide you through the process like a professional chef.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Smart ingredient matching', 'Step-by-step guidance', 'Dietary substitutions', 'Chef-level cooking tips'].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                            <Star className="w-3 h-3 text-primary-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/chilli-ai" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                                Chat with Chilli <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
