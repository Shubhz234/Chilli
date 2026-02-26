import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, Clock, Flame, Star, ChefHat, BadgeCheck } from 'lucide-react';

const Feed = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedType, setFeedType] = useState('following'); // 'following', 'trending', 'ai_picks'

    const user = JSON.parse(localStorage.getItem('chilli_user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchFeed = async () => {
            setLoading(true);
            try {
                // Fetch all approved recipes
                const res = await fetch('/api/recipes');
                if (res.ok) {
                    const allRecipes = await res.json();

                    // Filter based on feed type
                    let filtered = [];
                    if (feedType === 'following') {
                        // Show recipes from authors the user follows
                        filtered = allRecipes.filter(r =>
                            r.author &&
                            user.following &&
                            user.following.some(fId => fId === r.author._id || fId === r.author)
                        );
                    } else if (feedType === 'trending') {
                        // Sort by likes or rating
                        filtered = [...allRecipes].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
                    } else if (feedType === 'ai_picks') {
                        // Random selections as "AI recommendations"
                        filtered = [...allRecipes].sort(() => 0.5 - Math.random()).slice(0, 10);
                    }

                    setRecipes(filtered);
                }
            } catch (err) {
                console.error('Error fetching feed:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsersList(data.filter(u => u._id !== user.id)); // exclude current user
                    const admin = data.find(u => u.isAdmin);
                    if (admin) setAdminUser(admin);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchFeed();
        fetchUsers();
    }, [feedType, navigate, user?.id]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 mt-6 sm:mt-8 animate-slide-up">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Your Feed</h1>
                        <p className="text-gray-600">Discover fresh content tailored for you.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-white flex items-center gap-1 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setFeedType('following')}
                            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${feedType === 'following'
                                ? 'bg-primary-50 text-primary-700 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <Users className="w-4 h-4" /> Following
                        </button>
                        <button
                            onClick={() => setFeedType('trending')}
                            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${feedType === 'trending'
                                ? 'bg-orange-50 text-orange-700 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" /> Trending
                        </button>
                        <button
                            onClick={() => setFeedType('ai_picks')}
                            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${feedType === 'ai_picks'
                                ? 'bg-purple-50 text-purple-700 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" /> AI Picks
                        </button>
                    </div>
                </div>

                {/* Suggested Cooks Section */}
                {usersList.length > 0 && (
                    <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-500" /> Suggested Cooks to Follow
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                            {/* Official Admin Profile */}
                            {adminUser && adminUser._id !== user.id && (
                                <Link to={`/user/${adminUser._id}`} className="snap-start shrink-0 w-32 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center hover:border-primary-200 transition-colors text-center group">
                                    <img src={adminUser.profilePhoto || "https://api.dicebear.com/7.x/bottts/svg?seed=Chilli"} alt="Chilli Team" className="w-14 h-14 rounded-full mb-3 object-cover bg-primary-50 border-2 border-primary-100 group-hover:scale-105 transition-transform" />
                                    <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight flex items-center gap-1 justify-center relative">{adminUser.name.split(' ')[0]} <BadgeCheck className="w-3 h-3 text-primary-500 absolute -right-4" /></h3>
                                    <p className="text-xs text-primary-600 font-semibold mb-2">Official</p>
                                </Link>
                            )}

                            {usersList.filter(u => !u.isAdmin).slice(0, 10).map((u, i) => (
                                <Link to={`/user/${u._id}`} key={u._id} className="snap-start shrink-0 w-32 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center hover:border-primary-200 transition-colors text-center group">
                                    <img src={u.profilePhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"} alt={u.name} className="w-14 h-14 object-cover rounded-full mb-3 border-2 border-gray-100 group-hover:scale-105 transition-transform" />
                                    <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight flex items-center gap-1 justify-center relative">
                                        <span className="line-clamp-1 truncate max-w-[80px]">{u.name.split(' ')[0]}</span>
                                        {(u.isVerified || u.isAdmin) && <BadgeCheck className="w-3 h-3 text-primary-500 absolute -right-4" />}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2 truncate max-w-full">{u.followers?.length || 0} followers</p>
                                    {user.following?.includes(u._id) ? (
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-full">Following</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full w-full">View Profile</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <ChefHat className="w-12 h-12 text-primary-500 animate-spin-slow mb-4" />
                        <p className="text-gray-500 font-medium">Preparing your feed...</p>
                    </div>
                ) : recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe, index) => (
                            <Link to={`/recipe/${recipe._id || recipe.id}`} key={recipe._id || recipe.id} className="block group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="liquid-card h-full flex flex-col border border-white/50 hover:border-primary-200 transition-colors">
                                    <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-[22px]">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                                                {recipe.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 flex-1 flex flex-col bg-white/40 backdrop-blur-sm">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {recipe.title}
                                        </h3>
                                        {recipe.author ? (
                                            <div className="flex items-center gap-2 mb-4">
                                                <img
                                                    src={recipe.author.profilePhoto || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'}
                                                    alt="author"
                                                    className="w-6 h-6 rounded-full"
                                                    onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"; }}
                                                />
                                                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                    By {recipe.author.name}
                                                    {(recipe.author.isVerified || recipe.author.isAdmin) && <BadgeCheck className="w-3 h-3 text-primary-500" />}
                                                </span>
                                            </div>
                                        ) : adminUser ? (
                                            <div className="flex items-center gap-2 mb-4">
                                                <img src={adminUser.profilePhoto || "https://api.dicebear.com/7.x/bottts/svg?seed=Chilli"} alt="Chilli Team" className="w-6 h-6 rounded-full object-cover bg-primary-50 border border-primary-100" />
                                                <span className="text-xs text-primary-600 font-bold flex items-center gap-1">
                                                    By {adminUser.name} <BadgeCheck className="w-3 h-3 text-primary-500" />
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-4">
                                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Chilli" alt="Chilli Team" className="w-6 h-6 rounded-full bg-primary-50 border border-primary-100" />
                                                <span className="text-xs text-primary-600 font-bold flex items-center gap-1">By Official <BadgeCheck className="w-3 h-3 text-primary-500" /></span>
                                            </div>
                                        )}
                                        <div className="mt-auto pt-4 border-t border-gray-50 grid grid-cols-3 gap-2">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Star className="w-4 h-4 mb-1 text-orange-400" />
                                                <span className="text-xs font-bold text-gray-700">{recipe.rating ? recipe.rating.toFixed(1) : 'New'}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center text-gray-500 border-x border-gray-100">
                                                <Clock className="w-4 h-4 mb-1 text-primary-400" />
                                                <span className="text-xs font-semibold">{recipe.time?.replace(' mins', 'm')}</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Flame className="w-4 h-4 mb-1 text-rose-400" />
                                                <span className="text-xs font-semibold">{recipe.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel bg-white/60 rounded-[32px] p-8 sm:p-12 text-center shadow-lg border border-white/80 flex flex-col items-center mx-4 sm:mx-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50/80 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            {feedType === 'following' ? "You aren't following anyone yet." : "No recipes found here."}
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            {feedType === 'following'
                                ? "Follow other cooks to see their delicious recipes appear in your personalized feed."
                                : "Check back later for fresh content."}
                        </p>
                        {feedType === 'following' && (
                            <Link to="/recipes" className="px-6 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
                                Explore Recipes
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
