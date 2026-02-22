import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, ChefHat, ExternalLink } from 'lucide-react';
import { recipes as initialRecipes } from '../data/mockRecipes';

const Admin = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(() => {
        const saved = localStorage.getItem('chilli_recipes');
        return saved ? JSON.parse(saved) : initialRecipes;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, payload: null });

    const [formData, setFormData] = useState({
        id: null, title: '', category: 'Main Course', time: '', image: '', videoUrl: '',
        description: '', ingredients: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedUser = localStorage.getItem('chilli_user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(storedUser);
        if (!user.isAdmin) {
            navigate('/');
        }
    }, [navigate]);

    const saveAndSync = (newRecipes) => {
        setRecipes(newRecipes);
        localStorage.setItem('chilli_recipes', JSON.stringify(newRecipes));
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const ingredientsArray = formData.ingredients.split('\n').filter(i => i.trim() !== '');

        if (formData.id) {
            // Edit
            const updated = recipes.map(r => {
                if (r.id === formData.id) {
                    return {
                        ...r,
                        title: formData.title,
                        category: formData.category,
                        time: formData.time.includes('mins') ? formData.time : formData.time + ' mins',
                        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
                        videoUrl: formData.videoUrl,
                        description: formData.description,
                        ingredients: ingredientsArray
                    };
                }
                return r;
            });
            saveAndSync(updated);
        } else {
            // Add
            const recipeToAdd = {
                id: Date.now().toString(),
                title: formData.title,
                category: formData.category,
                time: formData.time + ' mins',
                difficulty: 'Medium',
                rating: 0,
                image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
                videoUrl: formData.videoUrl,
                description: formData.description,
                ingredients: ingredientsArray,
                steps: ['Mock step 1', 'Mock step 2']
            };
            saveAndSync([recipeToAdd, ...recipes]);
        }

        setShowForm(false);
        setFormData({ id: null, title: '', category: 'Main Course', time: '', image: '', videoUrl: '', description: '', ingredients: '' });
    };

    const handleEdit = (recipe) => {
        setConfirmModal({ isOpen: true, type: 'edit', payload: recipe });
    };

    const handleDelete = (id) => {
        setConfirmModal({ isOpen: true, type: 'delete', payload: id });
    };

    const executeConfirmAction = () => {
        if (confirmModal.type === 'delete') {
            saveAndSync(recipes.filter(r => r.id !== confirmModal.payload));
        } else if (confirmModal.type === 'edit') {
            const recipe = confirmModal.payload;
            setFormData({
                id: recipe.id,
                title: recipe.title,
                category: recipe.category,
                time: recipe.time.replace(' mins', ''),
                image: recipe.image,
                videoUrl: recipe.videoUrl || '',
                description: recipe.description,
                ingredients: recipe.ingredients.join('\n')
            });
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setConfirmModal({ isOpen: false, type: null, payload: null });
    };

    // Filter recipes based on search
    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 relative z-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage your recipes and platform content.</p>
                    </div>

                    <button
                        onClick={() => {
                            if (showForm) {
                                setShowForm(false);
                                setFormData({ id: null, title: '', category: 'Main Course', time: '', image: '', videoUrl: '', description: '', ingredients: '' });
                            } else {
                                setShowForm(true);
                            }
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-colors"
                    >
                        {showForm ? 'Cancel' : (
                            <>
                                <Plus className="w-5 h-5" />
                                Add New Recipe
                            </>
                        )}
                    </button>
                </div>

                {/* Add/Edit Recipe Form */}
                {showForm && (
                    <div className="liquid-card p-8 mb-10 animate-slide-up">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                            {formData.id ? <Edit2 className="w-6 h-6 text-primary-500" /> : <ChefHat className="w-6 h-6 text-primary-500" />}
                            {formData.id ? 'Edit Recipe' : 'Create New Recipe'}
                        </h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleAddSubmit}>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        placeholder="e.g. Spicy Chicken Curry"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        >
                                            <option>Main Course</option>
                                            <option>Asian</option>
                                            <option>Italian</option>
                                            <option>Healthy</option>
                                            <option>Dessert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Time (mins)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                            placeholder="e.g. 45"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Video Embed URL</label>
                                    <input
                                        type="url"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        placeholder="https://www.youtube.com/embed/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all resize-none"
                                        placeholder="A brief description of the recipe..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients (One per line)</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.ingredients}
                                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all whitespace-pre"
                                        placeholder="2 cups flour&#10;1 cup sugar&#10;..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4 border-t border-gray-100 pt-8 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({ id: null, title: '', category: 'Main Course', time: '', image: '', videoUrl: '', description: '', ingredients: '' });
                                    }}
                                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-colors flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Save Recipe
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search & List */}
                <div className="liquid-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    <div className="p-6 border-b border-gray-100 bg-white/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                                                <button
                                                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(recipe)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(recipe.id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"
                                                >
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

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in px-4">
                    <div className="liquid-card p-8 max-w-sm w-full scale-100 transform transition-transform border border-white/40">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h3>
                            <p className="text-gray-600">
                                {confirmModal.type === 'delete'
                                    ? "This action cannot be undone. Are you sure you want to permanently delete this recipe?"
                                    : "You are about to edit this recipe's details. Proceed?"}
                            </p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmModal({ isOpen: false, type: null, payload: null })}
                                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeConfirmAction}
                                className={`px-5 py-2.5 text-white rounded-xl font-semibold transition-colors shadow-lg ${confirmModal.type === 'delete'
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                                    }`}
                            >
                                Yes, {confirmModal.type === 'delete' ? 'Delete' : 'Edit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
