import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Info, LogOut, Utensils, Heart, Edit2, Save } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedUser = localStorage.getItem('chilli_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEditData(parsedUser);
        } else {
            // Re-route to login if no user is found
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('chilli_user');
        window.dispatchEvent(new Event('authStatusChanged'));
        navigate('/');
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/users/profile/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editData, token: user.token })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('chilli_user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                window.dispatchEvent(new Event('authStatusChanged'));
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while saving.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-primary-500/5 mb-8 relative overflow-hidden animate-slide-up">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-400 to-orange-400"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-16">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-primary-50 to-orange-50 rounded-full flex items-center justify-center border-2 border-primary-100">
                                <User className="w-16 h-16 text-primary-400" />
                            </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleChange}
                                    className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight bg-gray-50 border border-gray-200 rounded-lg px-2 w-full max-w-sm"
                                />
                            ) : (
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
                            )}
                            <p className="text-primary-600 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>

                        <div className="shrink-0 mt-6 sm:mt-0 flex gap-2">
                            {isEditing ? (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 rounded-xl font-bold transition-colors shadow-sm"
                                >
                                    <Save className="w-5 h-5" />
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl font-bold transition-colors shadow-sm"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-bold transition-colors shadow-sm"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    {/* Personal Info Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 flex flex-col gap-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4">
                            <Info className="w-6 h-6 text-primary-500" />
                            Personal Details
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Age</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="age"
                                        value={editData.age}
                                        onChange={handleChange}
                                        className="text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded px-2 w-20"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-gray-900">{user.age} <span className="text-sm text-gray-400 font-normal">years old</span></p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date of Birth</p>
                                <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dob"
                                            value={editData.dob}
                                            onChange={handleChange}
                                            className="bg-white border border-gray-200 rounded px-2 focus:outline-none focus:border-primary-500 text-sm"
                                        />
                                    ) : (
                                        <span>{user.dob}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-50 rounded-xl p-5 border border-primary-100 mt-2">
                            <p className="text-xs text-primary-600 uppercase font-bold mb-2 flex items-center gap-2">
                                <Utensils className="w-4 h-4" /> Favourite Dish
                            </p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="favoriteDish"
                                    value={editData.favoriteDish || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Butter Chicken"
                                    className="text-xl font-extrabold text-gray-900 w-full bg-white border border-primary-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            ) : (
                                <p className="text-xl font-extrabold text-gray-900">{user.favoriteDish || 'Not set'}</p>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-primary-200/50 pt-4">
                                <div>
                                    <p className="text-xs text-primary-600/80 uppercase font-bold mb-1 border-b border-primary-200 pb-1">Spice Level</p>
                                    {isEditing ? (
                                        <select
                                            name="spiceLevel"
                                            value={editData.spiceLevel || 'Medium'}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-primary-200 rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="Mild">Mild</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Spicy">Spicy</option>
                                            <option value="Extra Spicy">Extra Spicy</option>
                                        </select>
                                    ) : (
                                        <p className="font-semibold text-gray-800">{user.spiceLevel || 'Medium'}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-primary-600/80 uppercase font-bold mb-1 border-b border-primary-200 pb-1">Fav Cuisine</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="favoriteCuisine"
                                            value={editData.favoriteCuisine || ''}
                                            onChange={handleChange}
                                            placeholder="e.g. Italian"
                                            className="w-full bg-white border border-primary-200 rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-800">{user.favoriteCuisine || 'Not set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extras Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 flex flex-col gap-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4">
                            <Heart className="w-6 h-6 text-rose-500" />
                            Preferences & Health
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                                <p className="text-xs text-rose-500 uppercase font-bold mb-2">Dietary Preference</p>
                                {isEditing ? (
                                    <select
                                        name="dietaryPreference"
                                        value={editData.dietaryPreference || 'None'}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-rose-200 rounded p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    >
                                        <option value="None">None</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Pescatarian">Pescatarian</option>
                                        <option value="Keto">Keto</option>
                                        <option value="Paleo">Paleo</option>
                                        <option value="Gluten-Free">Gluten-Free</option>
                                    </select>
                                ) : (
                                    <p className="font-semibold text-gray-900">{user.dietaryPreference || 'None'}</p>
                                )}
                            </div>
                            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                                <p className="text-xs text-rose-500 uppercase font-bold mb-2">Allergies</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="allergies"
                                        value={editData.allergies || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. Peanuts, Dairy"
                                        className="w-full bg-white border border-rose-200 rounded p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    />
                                ) : (
                                    <p className="font-semibold text-gray-900">{user.allergies || 'None'}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border-l-4 border-rose-300">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Additional Notes / Extras</p>
                            {isEditing ? (
                                <textarea
                                    name="extras"
                                    value={editData.extras || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any other preferences or notes..."
                                    className="w-full bg-white border border-gray-200 rounded p-2 text-gray-700 leading-relaxed italic focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed italic">{user.extras ? `"${user.extras}"` : 'No additional notes provided.'}</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
