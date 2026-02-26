import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, UserPlus, UserCheck, Utensils, BadgeCheck } from 'lucide-react';

const CookProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followModal, setFollowModal] = useState(null); // 'followers' | 'following' | null
    const [allUsers, setAllUsers] = useState([]);

    const loggedInUserStr = localStorage.getItem('chilli_user');
    const loggedInUser = React.useMemo(() => loggedInUserStr ? JSON.parse(loggedInUserStr) : null, [loggedInUserStr]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            let isAdmin = false;
            try {
                const res = await fetch(`/api/users/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfileUser(data);
                    isAdmin = data.isAdmin;

                    if (loggedInUser && data.followers.some(f => (f._id || f) === loggedInUser.id)) {
                        setIsFollowing(true);
                    }
                } else {
                    navigate('/'); // Go back if user not found
                    return;
                }
            } catch (err) {
                console.error(err);
                return;
            }

            try {
                const res = await fetch('/api/recipes');
                if (res.ok) {
                    const allRecipes = await res.json();
                    setRecipes(allRecipes.filter(r =>
                        (r.author && (r.author._id === id || r.author === id)) ||
                        (isAdmin && !r.author)
                    ));
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id, navigate, loggedInUser]);

    const handleFollowToggle = async () => {
        if (!loggedInUser) {
            navigate('/login');
            return;
        }

        const endpoint = isFollowing ? 'unfollow' : 'follow';
        try {
            const res = await fetch(`/api/users/${id}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId: loggedInUser.id })
            });

            if (res.ok) {
                setIsFollowing(!isFollowing);
                // Optionally update the count locally instead of full refetch
                setProfileUser(prev => ({
                    ...prev,
                    followers: isFollowing
                        ? prev.followers.filter(f => (f._id || f) !== loggedInUser.id)
                        : [...prev.followers, { _id: loggedInUser.id }]
                }));
            }
        } catch (err) {
            console.error(err);
        }
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

    if (!profileUser) return <div className="min-h-screen pt-32 pb-20 text-center flex items-center justify-center font-bold text-gray-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-primary-500/5 mb-8 relative overflow-hidden animate-slide-up">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-400 to-rose-400"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-16">
                        <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-xl shrink-0">
                            <img
                                src={profileUser.profilePhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"}
                                alt={profileUser.name}
                                className="w-full h-full object-cover rounded-full border-2 border-orange-100"
                                onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"; }}
                            />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                                {profileUser.name}
                                {(profileUser.isVerified || profileUser.isAdmin) && <BadgeCheck className="w-8 h-8 text-primary-500 shrink-0" />}
                            </h1>
                            <p className="text-gray-600 mt-2 italic">"{profileUser.bio || 'Home cook'}"</p>

                            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                                <div onClick={() => handleOpenFollowModal('followers')} className="text-center cursor-pointer hover:opacity-70 transition-opacity group">
                                    <span className="block font-bold text-gray-900 text-xl group-hover:text-primary-600 transition-colors">{profileUser.followers?.length || 0}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Followers</span>
                                </div>
                                <div onClick={() => handleOpenFollowModal('following')} className="text-center cursor-pointer hover:opacity-70 transition-opacity group">
                                    <span className="block font-bold text-gray-900 text-xl group-hover:text-primary-600 transition-colors">{profileUser.following?.length || 0}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Following</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-gray-900 text-xl">{recipes.length}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Recipes</span>
                                </div>
                            </div>
                        </div>

                        {loggedInUser?.id !== profileUser._id && (
                            <div className="shrink-0 mt-6 sm:mt-0">
                                <button
                                    onClick={handleFollowToggle}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg ${isFollowing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-gray-200/50'
                                        : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/30'
                                        }`}
                                >
                                    {isFollowing ? (
                                        <><UserCheck className="w-5 h-5" /> Following</>
                                    ) : (
                                        <><UserPlus className="w-5 h-5" /> Follow</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recipes Grid */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Utensils className="w-6 h-6 text-primary-500" />
                        Recipes by {profileUser.name.split(' ')[0]}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map(recipe => (
                            <div key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-gray-900 line-clamp-1">{recipe.title}</h4>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                        <span className="px-2 py-1 bg-gray-100 rounded-lg">{recipe.difficulty}</span>
                                        <span className="px-2 py-1 bg-gray-100 rounded-lg">{recipe.time}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {recipes.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <p className="text-gray-500 mb-2">This cook hasn't uploaded any public recipes yet.</p>
                        </div>
                    )}
                </div>
            </div>

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
                                const listIds = followModal === 'followers' ? profileUser.followers : profileUser.following;
                                if (!listIds || listIds.length === 0) return <div className="p-10 text-center text-gray-500 text-sm font-medium">No {followModal} found.</div>;

                                const listUsers = allUsers.filter(u => listIds.some(id => (id._id || id) === u._id));

                                if (listUsers.length === 0) return <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

                                return listUsers.map(u => (
                                    <div key={u._id} onClick={() => { setFollowModal(null); navigate(`/user/${u._id}`); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors group cursor-pointer">
                                        <img src={u.profilePhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"} className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform" alt={u.name} />
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-gray-900 text-sm truncate flex items-center gap-1">{u.name}{(u.isVerified || u.isAdmin) && <BadgeCheck className="w-3.5 h-3.5 text-primary-500 shrink-0" />}</h4>
                                            <p className="text-xs text-gray-500 truncate font-medium">{u.followers?.length || 0} followers</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CookProfile;
