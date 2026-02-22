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

    const handleSave = () => {
        localStorage.setItem('chilli_user', JSON.stringify(editData));
        setUser(editData);
        setIsEditing(false);
        window.dispatchEvent(new Event('authStatusChanged'));
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
                                    value={editData.favoriteDish}
                                    onChange={handleChange}
                                    className="text-xl font-extrabold text-gray-900 w-full bg-white border border-primary-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            ) : (
                                <p className="text-xl font-extrabold text-gray-900">{user.favoriteDish}</p>
                            )}
                        </div>
                    </div>

                    {/* Extras Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 flex flex-col gap-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-4">
                            <Heart className="w-6 h-6 text-rose-500" />
                            Preferences & Extras
                        </h2>

                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border-l-4 border-primary-300">
                            {isEditing ? (
                                <textarea
                                    name="extras"
                                    value={editData.extras}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-white border border-gray-200 rounded p-2 text-gray-700 leading-relaxed italic focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed italic">"{user.extras}"</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
