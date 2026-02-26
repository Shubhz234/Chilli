import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, ChefHat, ExternalLink, Star, RotateCcw, BadgeCheck } from 'lucide-react';
import { recipes as initialRecipes } from '../data/mockRecipes';

const Admin = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(() => {
        const saved = localStorage.getItem('chilli_recipes');
        return saved ? JSON.parse(saved) : initialRecipes;
    });
    const [pendingRecipes, setPendingRecipes] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('approved'); // 'approved', 'pending', 'users'
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, payload: null });
    const [rejectReason, setRejectReason] = useState('');

    const [formData, setFormData] = useState({
        id: null, title: '', category: 'Main Course', time: '', difficulty: 'Medium', servings: 4, image: '', videoUrl: '',
        description: '', ingredients: '', steps: '', region: 'Global', dietType: 'Any', calories: 0, protein: 0, carbs: 0, fat: 0
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        // Fetch fresh recipes from the database
        const fetchRecipes = async () => {
            try {
                const res = await fetch('/api/recipes');
                const data = await res.json();
                setRecipes(data);
                localStorage.setItem('chilli_recipes', JSON.stringify(data));

                const pendingRes = await fetch('/api/recipes/pending');
                const pendingData = await pendingRes.json();
                setPendingRecipes(pendingData);

                const usersRes = await fetch('/api/users');
                if (usersRes.ok) {
                    const usersData = await usersRes.json();
                    setUsersList(usersData);
                }
            } catch (err) {
                console.error('API Error:', err);
            }
        };
        fetchRecipes();

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

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const ingredientsArray = formData.ingredients.split('\n').filter(i => i.trim() !== '');
        const stepsArray = formData.steps.split('\n').filter(s => s.trim() !== '');

        const recipePayload = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            servings: Number(formData.servings) || 4,
            time: formData.time.includes('mins') ? formData.time : formData.time + ' mins',
            image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            videoUrl: formData.videoUrl,
            description: formData.description,
            ingredients: ingredientsArray,
            steps: stepsArray.length > 0 ? stepsArray : ['Mock step 1', 'Mock step 2'],
            region: formData.region,
            dietType: formData.dietType,
            calories: Number(formData.calories) || 0,
            protein: Number(formData.protein) || 0,
            carbs: Number(formData.carbs) || 0,
            fat: Number(formData.fat) || 0
        };

        if (formData.id) {
            // Edit
            try {
                const res = await fetch(`/api/recipes/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipePayload)
                });
                if (res.ok) {
                    const updatedRecipe = await res.json();
                    const formattedRecipe = { ...updatedRecipe, id: updatedRecipe._id.toString() };

                    if (updatedRecipe.status === 'pending') {
                        setPendingRecipes(pendingRecipes.map(r => r.id === formData.id ? formattedRecipe : r));
                    } else {
                        const updatedList = recipes.map(r => r.id === formData.id ? formattedRecipe : r);
                        saveAndSync(updatedList);
                    }
                }
            } catch (err) {
                console.error("Update error", err);
            }
        } else {
            // Add
            try {
                const res = await fetch('/api/recipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipePayload)
                });
                if (res.ok) {
                    const addedRecipe = await res.json();
                    const formattedRecipe = { ...addedRecipe, id: addedRecipe._id.toString() };
                    saveAndSync([formattedRecipe, ...recipes]);
                }
            } catch (err) {
                console.error("Create error", err);
            }
        }

        setShowForm(false);
        setFormData({ id: null, title: '', category: 'Main Course', time: '', difficulty: 'Medium', servings: 4, image: '', videoUrl: '', description: '', ingredients: '', steps: '', region: 'Global', dietType: 'Any', calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    const handleEdit = (recipe) => {
        setConfirmModal({ isOpen: true, type: 'edit', payload: recipe });
    };

    const handleDelete = (id) => {
        setConfirmModal({ isOpen: true, type: 'delete', payload: id });
    };

    const handleReject = (id) => {
        setRejectReason('');
        setConfirmModal({ isOpen: true, type: 'reject', payload: id });
    };

    const handleResetRatings = (id) => {
        setConfirmModal({ isOpen: true, type: 'reset_ratings', payload: id });
    };

    const executeConfirmAction = async () => {
        if (confirmModal.type === 'delete') {
            try {
                await fetch(`/api/recipes/${confirmModal.payload}`, {
                    method: 'DELETE'
                });
                saveAndSync(recipes.filter(r => r.id !== confirmModal.payload));
                setPendingRecipes(pendingRecipes.filter(r => r.id !== confirmModal.payload));
            } catch (err) {
                console.error("Delete error", err);
            }
        } else if (confirmModal.type === 'edit') {
            const recipe = confirmModal.payload;
            setFormData({
                id: recipe.id,
                title: recipe.title,
                category: recipe.category,
                time: recipe.time.replace(' mins', ''),
                difficulty: recipe.difficulty || 'Medium',
                servings: recipe.servings || 4,
                image: recipe.image,
                videoUrl: recipe.videoUrl || '',
                description: recipe.description,
                ingredients: recipe.ingredients ? recipe.ingredients.join('\n') : '',
                steps: recipe.steps ? recipe.steps.join('\n') : '',
                region: recipe.region || 'Global',
                dietType: recipe.dietType || 'Any',
                calories: recipe.calories || 0,
                protein: recipe.protein || 0,
                carbs: recipe.carbs || 0,
                fat: recipe.fat || 0
            });
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (confirmModal.type === 'reset_ratings') {
            try {
                const res = await fetch(`/api/recipes/${confirmModal.payload}/reviews`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    const data = await res.json();
                    const formattedRecipe = { ...data.recipe, id: data.recipe._id.toString() };
                    saveAndSync(recipes.map(r => r.id === confirmModal.payload ? formattedRecipe : r));
                    setPendingRecipes(pendingRecipes.map(r => r.id === confirmModal.payload ? formattedRecipe : r));
                }
            } catch (err) {
                console.error("Reset ratings error", err);
            }
        } else if (confirmModal.type === 'reject') {
            try {
                await fetch(`/api/recipes/${confirmModal.payload}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason: rejectReason })
                });
                setPendingRecipes(pendingRecipes.filter(r => r.id !== confirmModal.payload));
            } catch (err) {
                console.error("Reject error", err);
            }
        }
        setConfirmModal({ isOpen: false, type: null, payload: null });
    };

    // Filter recipes or users based on search
    const searchLower = searchTerm.trim().toLowerCase();
    const filteredRecipes = (activeTab === 'approved' ? recipes : pendingRecipes).filter(r =>
        !searchLower || (r.title && r.title.toLowerCase().includes(searchLower))
    );

    const filteredUsers = usersList.filter(u =>
        !searchLower ||
        (u.name && u.name.toLowerCase().includes(searchLower)) ||
        (u.email && u.email.toLowerCase().includes(searchLower))
    );

    const handleVerifyUser = async (id) => {
        try {
            const res = await fetch(`/api/users/${id}/verify`, { method: 'PUT' });
            if (res.ok) {
                const data = await res.json();
                setUsersList(usersList.map(u => u._id === id ? { ...u, isVerified: data.isVerified } : u));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`/api/recipes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
            });
            if (res.ok) {
                const updatedRecipe = await res.json();
                const formattedRecipe = { ...updatedRecipe, id: updatedRecipe._id.toString() };
                setPendingRecipes(pendingRecipes.filter(r => r.id !== id));
                saveAndSync([formattedRecipe, ...recipes]);
            }
        } catch (err) {
            console.error("Approve error", err);
        }
    };

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
                                setFormData({ id: null, title: '', category: 'Main Course', time: '', difficulty: 'Medium', servings: 4, image: '', videoUrl: '', description: '', ingredients: '', steps: '', region: 'Global', dietType: 'Any', calories: 0, protein: 0, carbs: 0, fat: 0 });
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
                    <div className="liquid-card p-5 sm:p-8 mb-10 animate-slide-up">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        >
                                            <optgroup label="Cuisine / Region">
                                                {['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Meal Type">
                                                {['Main Course', 'Starter', 'Desserts', 'Breakfast', 'Snacks', 'Seafood'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Diet & Health">
                                                {['Healthy', 'Junk', 'Fat Lose', 'Weight Gain', 'Vegan', 'Quick & Easy'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        >
                                            {['Easy', 'Medium', 'Hard'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
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
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Servings</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.servings}
                                            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                            placeholder="e.g. 4"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                                        <select
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        >
                                            <optgroup label="Global">
                                                <option value="Global">Global / Generic</option>
                                            </optgroup>
                                            <optgroup label="Indian Regional">
                                                {['Maharashtrian', 'Punjabi', 'South Indian', 'Gujarati', 'Bengali', 'Street Food'].map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Diet Type</label>
                                        <select
                                            value={formData.dietType}
                                            onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all"
                                        >
                                            {['Any', 'Vegetarian', 'Vegan', 'High Protein', 'Keto', 'Weight Loss'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="lg:col-span-2 grid grid-cols-4 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-700 mb-2">Calories</label>
                                            <input type="number" required value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: e.target.value })} className="w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all text-sm" placeholder="kcal" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-700 mb-2">Protein (g)</label>
                                            <input type="number" required value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: e.target.value })} className="w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all text-sm" placeholder="g" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-700 mb-2">Carbs (g)</label>
                                            <input type="number" required value={formData.carbs} onChange={(e) => setFormData({ ...formData, carbs: e.target.value })} className="w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all text-sm" placeholder="g" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-gray-700 mb-2">Fat (g)</label>
                                            <input type="number" required value={formData.fat} onChange={(e) => setFormData({ ...formData, fat: e.target.value })} className="w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all text-sm" placeholder="g" />
                                        </div>
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

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions / Steps (One per line)</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.steps}
                                        onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:bg-white transition-all whitespace-pre"
                                        placeholder="Chop the vegetables&#10;Boil water&#10;..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4 border-t border-gray-100 pt-8 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({ id: null, title: '', category: 'Main Course', time: '', difficulty: 'Medium', servings: 4, image: '', videoUrl: '', description: '', ingredients: '', steps: '' });
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
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
                            <h2 className="text-xl font-bold text-gray-900 shrink-0">Manage Recipes</h2>
                            <div className="bg-gray-100 p-1 rounded-xl flex flex-wrap items-center">
                                <button
                                    onClick={() => setActiveTab('approved')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'approved' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Pending
                                    {pendingRecipes.length > 0 && (
                                        <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full">{pendingRecipes.length}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Users
                                </button>
                            </div>
                        </div>
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
                        {activeTab === 'users' ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold">User</th>
                                        <th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={u.profilePhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"} alt={u.name} className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-200" />
                                                    <div>
                                                        <p className="font-bold text-gray-900 flex items-center gap-1">
                                                            {u.name}
                                                            {(u.isVerified || u.isAdmin) && <BadgeCheck className="w-4 h-4 text-primary-500" />}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{u.followers?.length || 0} followers</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{u.email}</td>
                                            <td className="p-4">
                                                {u.isAdmin ? (
                                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Admin</span>
                                                ) : u.isVerified ? (
                                                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified Pro</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Standard</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleVerifyUser(u._id)}
                                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${u.isVerified ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                                                >
                                                    {u.isVerified ? 'Remove Verification' : 'Verify Cook'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Recipe</th>
                                        <th className="p-4 font-semibold hidden md:table-cell">Category</th>
                                        <th className="p-4 font-semibold hidden lg:table-cell">Rating</th>
                                        <th className="p-4 font-semibold hidden sm:table-cell">Difficulty</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRecipes.map((recipe) => (
                                        <tr key={recipe.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-gray-100" />
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-2">{recipe.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{recipe.time}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                                                    {recipe.category}
                                                </span>
                                            </td>
                                            <td className="p-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-1.5 text-gray-700">
                                                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                                    <span className="font-bold">{recipe.rating ? recipe.rating.toFixed(1) : 'New'}</span>
                                                    <span className="text-gray-400 text-xs">({recipe.numReviews || 0})</span>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {recipe.difficulty}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {activeTab === 'pending' ? (
                                                        <>
                                                            <button onClick={() => handleApprove(recipe.id)} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors">Approve</button>
                                                            <button onClick={() => handleReject(recipe.id)} className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hover:bg-rose-200 transition-colors">Reject</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleResetRatings(recipe.id)}
                                                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Reset Ratings"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
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
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredRecipes.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                No recipes found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
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
                                {confirmModal.type === 'delete' && "This action cannot be undone. Are you sure you want to permanently delete this recipe?"}
                                {confirmModal.type === 'edit' && "You are about to edit this recipe's details. Proceed?"}
                                {confirmModal.type === 'reset_ratings' && "Are you sure you want to reset and permanently delete ALL ratings and reviews for this recipe? This cannot be undone."}
                                {confirmModal.type === 'reject' && "Provide a reason for rejecting this recipe. The author will be notified."}
                            </p>
                            {confirmModal.type === 'reject' && (
                                <textarea
                                    className="w-full mt-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    rows="3"
                                    placeholder="e.g. Needs better instructions..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                            )}
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
                                className={`px-5 py-2.5 text-white rounded-xl font-semibold transition-colors shadow-lg ${confirmModal.type === 'delete' || confirmModal.type === 'reset_ratings' || confirmModal.type === 'reject'
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                                    }`}
                            >
                                {confirmModal.type === 'delete' && 'Yes, Delete'}
                                {confirmModal.type === 'reset_ratings' && 'Yes, Reset Ratings'}
                                {confirmModal.type === 'edit' && 'Yes, Edit'}
                                {confirmModal.type === 'reject' && 'Yes, Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
