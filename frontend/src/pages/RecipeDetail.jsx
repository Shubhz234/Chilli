import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Clock, Flame, User, ArrowLeft, Heart, Share2, PlayCircle, Plus, Check, ChefHat, Star, MessageSquare } from 'lucide-react';
import { recipes as initialRecipes } from '../data/mockRecipes';

// Helper to convert standard YouTube links into embeddable iframe links
const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [recipe, setRecipe] = useState(() => {
        // Fallback to local storage if API is slow or fails
        const saved = localStorage.getItem('chilli_recipes');
        const parsedSaved = saved ? JSON.parse(saved) : initialRecipes;
        return parsedSaved.find(r => r.id === id) || null;
    });

    const [isFavourite, setIsFavourite] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('chilli_user'));
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const submitReview = async () => {
        if (!user) {
            alert("Please log in to leave a review.");
            navigate('/login');
            return;
        }
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/recipes/${recipe.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    userName: user.name,
                    rating,
                    comment: reviewComment
                })
            });

            if (res.ok) {
                const data = await res.json();
                setRecipe({ ...data.recipe, id: data.recipe._id.toString() });
                setRating(0);
                setReviewComment('');
            } else {
                const err = await res.json();
                alert(err.message || 'Error submitting review');
            }
        } catch (err) {
            console.error("Failed to submit review", err);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchRecipe = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/recipes/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecipe({ ...data, id: data._id.toString() });
                }
            } catch (err) {
                console.error("Failed to fetch recipe from API", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();

        if (recipe) {
            const savedFavourites = JSON.parse(localStorage.getItem('chilli_favourites') || '[]');
            setIsFavourite(savedFavourites.some(r => r.id === recipe.id));
        }
    }, [id, recipe?.id]);

    if (loading && !recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center relative z-0 flex-col">
                <ChefHat className="w-16 h-16 text-primary-500 animate-bounce mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Cooking up your recipe...</h2>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center relative z-0 flex-col">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
                <Link to="/recipes" className="text-primary-600 hover:underline">Return to Recipes</Link>
            </div>
        );
    }

    const handleBack = () => {
        if (location.state?.fromSearch) {
            navigate(-1);
        } else {
            navigate('/recipes');
        }
    };

    const toggleFavourite = () => {
        const savedFavourites = JSON.parse(localStorage.getItem('chilli_favourites') || '[]');
        if (isFavourite) {
            const newFavourites = savedFavourites.filter(r => r.id !== recipe.id);
            localStorage.setItem('chilli_favourites', JSON.stringify(newFavourites));
            setIsFavourite(false);
        } else {
            savedFavourites.push(recipe);
            localStorage.setItem('chilli_favourites', JSON.stringify(savedFavourites));
            setIsFavourite(true);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Chilli Recipe: ${recipe.title}`,
            text: `Check out this amazing ${recipe.title} recipe on Chilli!`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShowShareTooltip(true);
                setTimeout(() => setShowShareTooltip(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="min-h-screen pb-20 relative z-0">
            {/* Hero Header */}
            <div className="relative h-96 w-full lg:h-[500px]">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                <div className="absolute top-24 left-4 sm:top-28 sm:left-8 z-10">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors text-sm font-medium border-none cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 md:pb-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-3xl animate-slide-up">
                                <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                                    {recipe.category}
                                </span>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 line-clamp-2">
                                    {recipe.title}
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center text-orange-400">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span className="ml-1 font-bold text-white">{recipe.rating ? recipe.rating.toFixed(1) : 'New'}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">({recipe.numReviews || 0} reviews)</span>
                                </div>
                                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-4">
                                    {recipe.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                <div className="relative">
                                    <button onClick={handleShare} className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all hover:scale-110">
                                        <Share2 className="w-6 h-6" />
                                    </button>
                                    {showShareTooltip && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap animate-fade-in shadow-lg before:content-[''] before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900">
                                            Link copied!
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={toggleFavourite}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-xl transition-all hover:-translate-y-1 ${isFavourite
                                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                        : 'bg-white text-gray-900 hover:bg-primary-50 hover:text-primary-600'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 transition-colors ${isFavourite ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                                    {isFavourite ? 'Saved to Favourites' : 'Save Recipe'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Key Stats Bar */}
                <div className="glass-panel-dark text-white rounded-3xl p-6 sm:px-12 mb-12 flex flex-wrap gap-8 sm:justify-between items-center animate-slide-up shadow-2xl relative -mt-20 z-20">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary-400" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Prep time</p>
                            <p className="font-bold text-lg">{recipe.time}</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-700"></div>
                    <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 text-orange-400" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Difficulty</p>
                            <p className="font-bold text-lg">{recipe.difficulty}</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-gray-700"></div>
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-purple-400" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Servings</p>
                            <p className="font-bold text-lg">{recipe.servings || 4} People</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content: Steps and Video */}
                    <div className="lg:col-span-2 space-y-8 lg:space-y-12 order-2 lg:order-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>

                        {/* Video Section */}
                        {recipe.videoUrl && (
                            <section className="liquid-card p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <PlayCircle className="w-6 h-6 text-primary-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Watch & Learn</h2>
                                </div>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-gray-900">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={getEmbedUrl(recipe.videoUrl)}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            </section>
                        )}

                        {/* Instructions Section */}
                        <section className="liquid-card p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <ChefHat className="w-6 h-6 text-primary-500" />
                                Instructions
                            </h2>
                            <div className="space-y-8">
                                {recipe.steps.map((step, index) => (
                                    <div key={index} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-lg mb-2 group-hover:bg-primary-500 group-hover:text-white transition-colors border-2 border-primary-100 shadow-sm">
                                                {index + 1}
                                            </div>
                                            {index !== recipe.steps.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-100 group-hover:bg-primary-100 transition-colors"></div>
                                            )}
                                        </div>
                                        <div className="py-2 flex-1 pb-8">
                                            <p className="text-gray-700 leading-relaxed text-lg">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews & Ratings Section */}
                        <section className="liquid-card p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-primary-500" />
                                Reviews ({recipe.numReviews || 0})
                            </h2>

                            {/* Add Review Form */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Leave a Review</h3>
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                                                        ? 'text-orange-400 fill-orange-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your thoughts about this recipe... (optional)"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 transition-all resize-none mb-4"
                                    rows="3"
                                ></textarea>
                                <button
                                    onClick={submitReview}
                                    className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl shadow-md hover:bg-primary-500 transition-colors"
                                >
                                    Submit Review
                                </button>
                            </div>

                            {/* Reviews List */}
                            {recipe.reviews && recipe.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {recipe.reviews.map((review, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-bold text-gray-900">{review.name}</div>
                                                <div className="flex items-center text-orange-400 gap-1">
                                                    <span className="font-bold text-sm">{review.rating}</span>
                                                    <Star className="w-4 h-4 fill-current" />
                                                </div>
                                            </div>
                                            {review.comment && <p className="text-gray-700">{review.comment}</p>}
                                            <div className="text-xs text-gray-400 mt-2">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 italic py-4">No reviews yet. Be the first to rate!</div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar: Ingredients */}
                    <div className="lg:col-span-1 order-1 lg:order-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="sticky top-24 liquid-card p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                                Ingredients
                                <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                    {recipe.ingredients.length} items
                                </span>
                            </h3>

                            <ul className="space-y-4 mb-8">
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="mt-0.5 w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-primary-500 group-hover:bg-primary-50 transition-colors hidden sm:flex">
                                            <Check className="w-3 h-3 text-transparent group-hover:text-primary-600 transition-colors" />
                                        </div>
                                        <span className="text-gray-700 font-medium group-hover:text-gray-900">{ingredient}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex items-start gap-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                                    <ChefHat className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-orange-900 text-sm mb-1">Chilli's Tip</h4>
                                    <p className="text-xs text-orange-800 leading-relaxed">
                                        Missing an ingredient? Use the AI Assistant to find a perfect substitution without ruining the dish!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
