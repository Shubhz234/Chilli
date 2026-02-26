import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Info, LogOut, Utensils, Heart, Edit2, Save } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('chilli_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(() => {
        const stored = localStorage.getItem('chilli_user');
        return stored ? JSON.parse(stored) : {};
    });
    const [uploadedRecipes, setUploadedRecipes] = useState([]);
    const [savedRecipesData] = useState(() => {
        const savedFavorites = localStorage.getItem('chilli_favourites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Full Screen Modal States
    const [viewMode, setViewMode] = useState(null); // 'uploaded' | 'saved' | null
    const [followModal, setFollowModal] = useState(null); // 'followers' | 'following' | null
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            const fetchUserData = async () => {
                try {
                    // Fetch user's uploaded recipes
                    const res = await fetch('/api/recipes');
                    if (res.ok) {
                        const allRecipes = await res.json();
                        setUploadedRecipes(allRecipes.filter(r =>
                            (r.author && (r.author._id === user.id || r.author === user.id)) ||
                            (user.isAdmin && !r.author)
                        ));
                    }
                } catch (err) { console.error(err); }
            };
            fetchUserData();
        } else {
            // Re-route to login if no user is found
            navigate('/login');
        }
    }, [navigate, user]);

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

    const handleOpenFollowModal = async (type) => {
        setFollowModal(type);
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                setAllUsers(await res.json());
            }
        } catch (err) {
            console.error('Failed to load users for modal', err);
        }
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
                                    className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight bg-gray-50 border border-gray-200 rounded-lg px-2 w-full max-w-sm mb-2"
                                />
                            ) : (
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{user.name}</h1>
                            )}

                            {isEditing ? (
                                <input
                                    type="text"
                                    name="bio"
                                    value={editData.bio || ''}
                                    onChange={handleChange}
                                    placeholder="Add a bio..."
                                    className="text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 w-full max-w-md mb-2"
                                />
                            ) : (
                                <p className="text-gray-600 italic mb-2">"{user.bio || 'Home cook'}"</p>
                            )}

                            <div className="flex items-center justify-center sm:justify-start gap-5 mt-3 mb-2">
                                <div onClick={() => handleOpenFollowModal('followers')} className="cursor-pointer hover:opacity-70 transition-opacity text-center sm:text-left group">
                                    <span className="text-gray-900 font-extrabold text-lg mr-1 group-hover:text-primary-600 transition-colors">{user.followers?.length || 0}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Followers</span>
                                </div>
                                <div onClick={() => handleOpenFollowModal('following')} className="cursor-pointer hover:opacity-70 transition-opacity text-center sm:text-left group">
                                    <span className="text-gray-900 font-extrabold text-lg mr-1 group-hover:text-primary-600 transition-colors">{user.following?.length || 0}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Following</span>
                                </div>
                            </div>

                            <p className="text-primary-600 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>

                        <div className="shrink-0 mt-6 sm:mt-0 flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
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
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl font-bold transition-colors shadow-sm flex-1 sm:flex-none"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-bold transition-colors shadow-sm flex-1 sm:flex-none"
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t border-primary-200/50 pt-4">
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

                {/* Recipes Section */}
                <div className="mt-8 grid md:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <Utensils className="w-6 h-6 text-primary-500" />
                                My Uploaded Recipes
                            </h2>
                            <span className="bg-primary-50 text-primary-600 text-xs font-bold px-2.5 py-1 rounded-full">{uploadedRecipes.length}</span>
                        </div>
                        {uploadedRecipes.length > 0 ? (
                            <div className="space-y-4">
                                {uploadedRecipes.slice(0, 3).map(recipe => (
                                    <Link to={`/recipe/${recipe._id || recipe.id}`} key={recipe._id || recipe.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 group">
                                        <img src={recipe.image} alt={recipe.title} className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{recipe.title}</h4>
                                            <p className="text-sm text-gray-500">{recipe.difficulty} • {recipe.time}</p>
                                        </div>
                                    </Link>
                                ))}
                                {uploadedRecipes.length > 3 && (
                                    <button onClick={() => setViewMode('uploaded')} className="w-full py-3 mt-2 text-sm font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
                                        View All ({uploadedRecipes.length})
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                You haven't uploaded any recipes yet.
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <Heart className="w-6 h-6 text-rose-500" />
                                Saved Recipes
                            </h2>
                            <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-full">{savedRecipesData.length}</span>
                        </div>
                        {savedRecipesData.length > 0 ? (
                            <div className="space-y-4">
                                {savedRecipesData.slice(0, 3).map(recipe => (
                                    <Link to={`/recipe/${recipe._id || recipe.id}`} key={recipe._id || recipe.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 group">
                                        <img
                                            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
                                            alt={recipe.title}
                                            className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{recipe.title}</h4>
                                            <p className="text-sm text-gray-500">{recipe.difficulty} • {recipe.time}</p>
                                        </div>
                                    </Link>
                                ))}
                                {savedRecipesData.length > 3 && (
                                    <button onClick={() => setViewMode('saved')} className="w-full py-3 mt-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
                                        View All ({savedRecipesData.length})
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                You haven't saved any recipes yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Full Screen Grid Modal */}
            {viewMode && (
                <div className="fixed inset-0 z-[101] bg-white flex flex-col overflow-hidden animate-slide-up">
                    <div className={`p-4 sm:p-6 flex items-center justify-between shadow-sm z-10 ${viewMode === 'uploaded' ? 'bg-primary-500 text-white' : 'bg-rose-500 text-white'}`}>
                        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                            {viewMode === 'uploaded' ? <Utensils className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
                            {viewMode === 'uploaded' ? 'My Uploaded Recipes' : 'Saved Recipes'}
                            <span className="text-sm opacity-80 ml-2 bg-white/20 px-2 py-0.5 rounded-full">
                                {viewMode === 'uploaded' ? uploadedRecipes.length : savedRecipesData.length}
                            </span>
                        </h2>
                        <button
                            onClick={() => setViewMode(null)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors font-bold text-sm bg-white/10"
                        >
                            Close
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-gray-50">
                        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {(viewMode === 'uploaded' ? uploadedRecipes : savedRecipesData).map(recipe => (
                                <Link to={`/recipe/${recipe._id || recipe.id}`} key={recipe._id || recipe.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col items-center p-3 sm:p-4 text-center">
                                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative">
                                        <img
                                            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <span className="text-white text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">View Recipe</span>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 line-clamp-2 w-full leading-tight text-sm sm:text-base">{recipe.title}</h4>
                                    <p className="text-xs text-gray-500 mt-2 font-medium bg-gray-50 px-3 py-1 rounded-lg w-full truncate">{recipe.difficulty} • {recipe.time}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Followers / Following Modal */}
            {followModal && (
                <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setFollowModal(null)}>
                    <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl transform scale-100 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white relative">
                            <h3 className="font-extrabold text-lg text-gray-900 capitalize mx-auto">{followModal}</h3>
                            <button onClick={() => setFollowModal(null)} className="absolute right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors font-bold text-[10px] uppercase tracking-wider">Close</button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar bg-gray-50/30">
                            {(() => {
                                const listIds = followModal === 'followers' ? user.followers : user.following;
                                if (!listIds || listIds.length === 0) return <div className="p-10 text-center text-gray-500 text-sm font-medium">No {followModal} found.</div>;

                                const listUsers = allUsers.filter(u => listIds.some(id => (id._id || id) === u._id));

                                if (listUsers.length === 0) return <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

                                return listUsers.map(u => (
                                    <Link key={u._id} to={`/user/${u._id}`} onClick={() => setFollowModal(null)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
                                        <img src={u.profilePhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"} className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform" alt={u.name} />
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{u.name}</h4>
                                            <p className="text-xs text-gray-500 truncate font-medium">{u.followers?.length || 0} followers</p>
                                        </div>
                                    </Link>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
