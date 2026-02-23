import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Pizza, TrendingDown, Dumbbell, Utensils, Soup, Cake, Coffee, Cookie, Timer, Carrot, Fish, Globe, Flame } from 'lucide-react';

const categoriesData = [
    { name: 'Indian', icon: Utensils, color: 'from-orange-500 to-red-600', delay: '0.05s' },
    { name: 'Italian', icon: Pizza, color: 'from-emerald-400 to-red-500', delay: '0.1s' },
    { name: 'Chinese', icon: Soup, color: 'from-red-500 to-yellow-500', delay: '0.15s' },
    { name: 'Mexican', icon: Flame, color: 'from-green-500 to-orange-500', delay: '0.2s' },
    { name: 'Thai', icon: Leaf, color: 'from-green-400 to-emerald-600', delay: '0.25s' },
    { name: 'Japanese', icon: Fish, color: 'from-rose-400 to-red-500', delay: '0.3s' },
    { name: 'American', icon: Cookie, color: 'from-blue-400 to-red-500', delay: '0.35s' },
    { name: 'Mediterranean', icon: Globe, color: 'from-cyan-400 to-blue-600', delay: '0.4s' },
    { name: 'Healthy', icon: Carrot, color: 'from-green-400 to-emerald-500', delay: '0.45s' },
    { name: 'Junk', icon: Pizza, color: 'from-amber-400 to-orange-500', delay: '0.5s' },
    { name: 'Fat Lose', icon: TrendingDown, color: 'from-blue-400 to-cyan-500', delay: '0.55s' },
    { name: 'Weight Gain', icon: Dumbbell, color: 'from-purple-400 to-indigo-500', delay: '0.6s' },
    { name: 'Main Course', icon: Utensils, color: 'from-rose-400 to-red-500', delay: '0.65s' },
    { name: 'Starter', icon: Soup, color: 'from-yellow-400 to-amber-600', delay: '0.7s' },
    { name: 'Desserts', icon: Cake, color: 'from-pink-400 to-rose-400', delay: '0.75s' },
    { name: 'Breakfast', icon: Coffee, color: 'from-yellow-400 to-orange-500', delay: '0.8s' },
    { name: 'Snacks', icon: Cookie, color: 'from-amber-500 to-yellow-700', delay: '0.85s' },
    { name: 'Vegan', icon: Leaf, color: 'from-emerald-400 to-teal-500', delay: '0.9s' },
    { name: 'Seafood', icon: Fish, color: 'from-sky-400 to-indigo-500', delay: '0.95s' },
];

const Categories = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 relative z-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-500">Category</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find exactly what you're craving. From healthy bowls to indulgent treats, we have it all.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {categoriesData.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                to="/recipes"
                                state={{ category: category.name }}
                                key={category.name}
                                className="group relative overflow-hidden rounded-3xl aspect-[4/3] flex flex-col justify-center items-center p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/20 animate-fade-in"
                                style={{ animationDelay: category.delay }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>

                                <div className="relative z-10 flex flex-col items-center gap-4 text-white transform group-hover:scale-110 transition-transform duration-300">
                                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                                        <Icon className="w-10 h-10 lg:w-12 lg:h-12" />
                                    </div>
                                    <h3 className="text-xl lg:text-2xl font-bold tracking-wide drop-shadow-sm">{category.name}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Categories;
