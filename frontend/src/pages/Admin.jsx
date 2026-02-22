import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ChefHat, ExternalLink } from 'lucide-react';
import { recipes as initialRecipes } from '../data/mockRecipes';

const Admin = () => {
    const [recipes, setRecipes] = useState(initialRecipes);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Filter recipes based on search
    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage your recipes and platform content.</p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-colors"
                    >
                        {showAddForm ? 'Cancel' : (
                            <>
                                <Plus className="w-5 h-5" />
                                Add New Recipe
                            </>
                        )}
                    </button>
                </div>

                {/* Add Recipe Form */}
                {showAddForm && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 mb-10 animate-slide-up border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                            <ChefHat className="w-6 h-6 text-primary-500" />
                            Create New Recipe
                        </h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
                                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all" placeholder="e.g. Spicy Chicken Curry" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all">
                                            <option>Main Course</option>
                                            <option>Asian</option>
                                            <option>Italian</option>
                                            <option>Healthy</option>
                                            <option>Dessert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Time (mins)</label>
                                        <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all" placeholder="e.g. 45" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                    <input type="url" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all" placeholder="https://images.unsplash.com/..." />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Video Embed URL</label>
                                    <input type="url" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all" placeholder="https://www.youtube.com/embed/..." />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all resize-none" placeholder="A brief description of the recipe..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients (One per line)</label>
                                    <textarea rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all whitespace-pre" placeholder="2 cups flour&#10;1 cup sugar&#10;..."></textarea>
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4 border-t border-gray-100 pt-8 flex justify-end gap-4">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="button" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-colors flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Save Recipe
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search & List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-gray-900">Manage Recipes</h2>
                        <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Recipe</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Difficulty</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRecipes.map((recipe) => (
                                    <tr key={recipe.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                                <div>
                                                    <p className="font-bold text-gray-900">{recipe.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{recipe.time}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                                                {recipe.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-gray-700">
                                                {recipe.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredRecipes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">
                                            No recipes found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;
