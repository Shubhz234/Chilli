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
        <div className="min-h-screen flex flex-col relative z-0">
            {/* Darker floating liquid blobs perfectly constrained to avoid overflow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-rose-400/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-40 left-10 w-64 h-64 sm:w-80 sm:h-80 bg-orange-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>
            {/* Hero Section */}
            <section className="relative pt-24 sm:pt-32 pb-16 lg:pt-40 lg:pb-28 overflow-hidden">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-8 animate-fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                            <span className="text-sm font-medium text-gray-600">Powered by advanced AI matching</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Your Intelligent <br className="hidden md:block" />
                            <span className="text-gradient">Culinary Companion</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
                            Discover, learn, and cook with Chilli. From smart ingredient-based searches to AI-guided step-by-step videos, master your kitchen today.
                        </p>

                        {/* Global Search Bar */}
                        <div className="max-w-2xl mx-auto glass-panel p-3 rounded-3xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2" onSubmit={handleSearch}>
                                <div className="flex-1 flex items-center px-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 focus-within:border-primary-300 focus-within:bg-white/80 transition-all shadow-input">
                                    <Search className="w-5 h-5 text-gray-500 shrink-0" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder='Try "Paneer Tikka"...'
                                        className="w-full bg-transparent border-none py-4 px-3 focus:outline-none text-gray-900 placeholder-gray-500 font-medium truncate"
                                    />
                                </div>
                                <button type="submit" className="liquid-button px-8 py-4 sm:w-auto shrink-0 w-full">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured AI Section */}
            <section className="py-20 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative mt-8 md:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-orange-200 rounded-3xl transform -rotate-3 scale-105 blur-lg -z-10 opacity-60"></div>
                            <div className="liquid-card p-4 sm:p-6 lg:p-8 relative">
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
                            <Link to="/chilli-ai" className="liquid-button inline-flex items-center justify-center gap-2 px-8 py-4 w-auto">
                                Chat with Chilli <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
