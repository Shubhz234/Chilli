import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Clock, Flame, Star, Filter } from 'lucide-react';
import { recipes } from '../data/mockRecipes';

const Recipes = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
    const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');

    useEffect(() => {
        if (location.state?.category) {
            setActiveCategory(location.state.category);
        }
        if (location.state?.searchTerm) {
            setSearchTerm(location.state.searchTerm);
        }
    }, [location.state]);

    const categories = ['All', 'Healthy', 'Junk', 'Fat Lose', 'Weight Gain', 'Main Course', 'Starter', 'Desserts', 'Breakfast', 'Snacks', 'Quick & Easy', 'Vegan', 'Seafood'];

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Search */}
                <div className="mb-12 animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                        Explore <span className="text-gradient">Recipes</span>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by recipe name or ingredient (e.g. paneer, tomato...)"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-700 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white rounded-2xl shadow-sm text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors font-medium">
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredRecipes.map((recipe, index) => (
                        <Link
                            to={`/recipe/${recipe.id}`}
                            state={{ fromSearch: true }}
                            key={recipe.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block animate-slide-up"
                            style={{ animationDelay: `${0.1 * (index + 2)}s` }}
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                                    <span className="text-xs font-bold text-gray-800">{recipe.rating}</span>
                                </div>
                                {/* Save Button overlay */}
                                <div className="absolute top-4 left-4 p-2 bg-white/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-gray-800 hover:text-primary-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded-lg uppercase tracking-wide">
                                        {recipe.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                    {recipe.title}
                                </h3>

                                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{recipe.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Flame className="w-4 h-4 text-orange-400" />
                                        <span className="font-medium">{recipe.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredRecipes.length === 0 && (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any recipes matching your search. Try different ingredients or search terms.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Recipes;
