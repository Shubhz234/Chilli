import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Flame, Trash2, ArrowRight } from 'lucide-react';

const Favourites = () => {
    const [favouriteRecipes, setFavouriteRecipes] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const stored = localStorage.getItem('chilli_favourites');
        if (stored) {
            setFavouriteRecipes(JSON.parse(stored));
        }
    }, []);

    const removeFavourite = (id) => {
        const newFavs = favouriteRecipes.filter(r => r.id !== id);
        setFavouriteRecipes(newFavs);
        localStorage.setItem('chilli_favourites', JSON.stringify(newFavs));
    };

    return (
        <div className="min-h-screen pt-24 pb-12 relative z-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                        My <span className="text-gradient">Favourites</span>
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Your personal collection of saved recipes, ready to cook anytime.
                    </p>
                </div>

                {favouriteRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {favouriteRecipes.map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="group liquid-card pb-2 relative animate-slide-up"
                                style={{ animationDelay: `${0.1 * index}s` }}
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFavourite(recipe.id);
                                    }}
                                    className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-rose-500 hover:text-white hover:bg-rose-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 duration-300"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <Link to={`/recipe/${recipe.id}`} className="block overflow-hidden rounded-t-3xl">
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-lg uppercase tracking-wide">
                                                {recipe.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                            {recipe.title}
                                        </h3>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <Clock className="w-4 h-4 text-primary-500" />
                                                <span className="font-medium">{recipe.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                <Flame className="w-4 h-4 text-orange-500" />
                                                <span className="font-medium">{recipe.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="px-5 pb-4 pt-2 border-t border-gray-50">
                                    <Link to={`/recipe/${recipe.id}`} className="w-full flex justify-center items-center gap-2 py-2.5 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors">
                                        View Recipe <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 liquid-card animate-fade-in border-white/40">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/20 mb-6">
                            <Heart className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No favourites yet</h3>
                        <p className="text-gray-700 max-w-md mx-auto mb-8 font-medium">
                            Start exploring recipes and click the heart icon to save them here for quick access later.
                        </p>
                        <Link
                            to="/recipes"
                            className="liquid-button inline-flex items-center gap-2 px-8 py-4 w-auto mx-auto"
                        >
                            Explore Recipes <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Favourites;
