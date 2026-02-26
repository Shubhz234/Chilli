import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ImageIcon, Plus, Trash2, Clock, Flame, Image as LuImage, Save } from 'lucide-react';

const UploadRecipe = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('chilli_user'));

    const [formData, setFormData] = useState({
        title: '',
        category: 'Main Course',
        time: '',
        difficulty: 'Medium',
        description: '',
        ingredients: [''],
        steps: [''],
        image: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    if (!storedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please login to upload a recipe</h2>
                    <button onClick={() => navigate('/login')} className="liquid-button px-6 py-2">Login</button>
                </div>
            </div>
        );
    }

    const categories = ['Indian', 'Italian', 'Chinese', 'Main Course', 'Starter', 'Desserts', 'Breakfast', 'Snacks', 'Healthy', 'Vegan'];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index, type, value) => {
        const newArray = [...formData[type]];
        newArray[index] = value;
        setFormData({ ...formData, [type]: newArray });
    };

    const addArrayItem = (type) => {
        setFormData({ ...formData, [type]: [...formData[type], ''] });
    };

    const removeArrayItem = (index, type) => {
        const newArray = formData[type].filter((_, i) => i !== index);
        setFormData({ ...formData, [type]: newArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Basic validation
        if (!formData.title || !formData.time || formData.ingredients[0] === '' || formData.steps[0] === '') {
            setMessage('Please fill all required fields');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                author: storedUser.id,
                status: 'pending'
            };

            const res = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage('Recipe submitted successfully! It is pending approval from an admin.');
                setTimeout(() => navigate('/profile'), 3000);
            } else {
                setMessage('Failed to submit recipe. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Server error submitting recipe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 relative z-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 animate-slide-up">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Upload <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-500">Your Recipe</span>
                    </h1>
                    <p className="text-gray-600">Share your culinary creations with the Chilli community.</p>
                </div>

                <div className="liquid-card p-6 md:p-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {message && (
                        <div className={`p-4 rounded-xl mb-6 font-medium text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                                    placeholder="e.g. Spicy Paneer Tikka"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LuImage className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        {/* Time & Difficulty */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Cooking Time *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                                        placeholder="e.g. 30 mins"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Flame className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors resize-none"
                                placeholder="Tell us about this dish..."
                            ></textarea>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Ingredients *</label>
                                <button type="button" onClick={() => addArrayItem('ingredients')} className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => handleArrayChange(index, 'ingredients', e.target.value)}
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                                            placeholder={`Ingredient ${index + 1}`}
                                            required
                                        />
                                        {formData.ingredients.length > 1 && (
                                            <button type="button" onClick={() => removeArrayItem(index, 'ingredients')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Steps */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Cooking Steps *</label>
                                <button type="button" onClick={() => addArrayItem('steps')} className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add Step
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.steps.map((step, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 font-bold rounded-lg mt-0.5">{index + 1}</span>
                                        <textarea
                                            value={step}
                                            onChange={(e) => handleArrayChange(index, 'steps', e.target.value)}
                                            rows="2"
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors resize-none"
                                            placeholder={`Describe step ${index + 1}`}
                                            required
                                        ></textarea>
                                        {formData.steps.length > 1 && (
                                            <button type="button" onClick={() => removeArrayItem(index, 'steps')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mt-0.5">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="liquid-button px-8 py-3 w-full md:w-auto flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadRecipe;
