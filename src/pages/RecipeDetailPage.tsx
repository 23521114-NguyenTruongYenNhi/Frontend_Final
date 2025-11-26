// File: src/pages/RecipeDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { mockRecipes } from '../data/mockRecipes'; // Removed to avoid confusion
import { Recipe } from '../types/recipe';
import { useAuth } from '../context/AuthContext';
import { recipeAPI } from '../api/client';
import {
    ChefHat,
    Clock,
    Star,
    ArrowLeft,
    MessageSquare,
    Send,
    Check,
    Flame,
    Activity,
    Beef,
    Cookie,
    AlertCircle
} from 'lucide-react';

export const RecipeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // States
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState<any[]>([]);

    // Load Recipe Data
    useEffect(() => {
        const loadRecipe = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);

            try {
                // 1. Fetch from Backend
                console.log("Fetching recipe ID:", id);
                const data: any = await recipeAPI.getById(id);
                console.log("Received data:", data);

                if (data) {
                    setRecipe(data);

                    // 2. Set comments from API response
                    if (data.comments && Array.isArray(data.comments)) {
                        setComments(data.comments.map((c: any) => ({
                            id: c._id || Math.random().toString(),
                            username: c.user?.name || 'Anonymous',
                            text: c.text,
                            rating: c.rating,
                            createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : 'Recently',
                        })));
                    }
                } else {
                    setError("Recipe data is empty");
                }

            } catch (err) {
                console.error('Failed to fetch recipe:', err);
                setError("Could not load recipe. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        loadRecipe();
    }, [id]);

    const handleIngredientCheck = (index: number) => {
        const newChecked = new Set(checkedIngredients);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedIngredients(newChecked);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!comment.trim() || !id) return;

        try {
            // Submit to backend
            await recipeAPI.addComment(id, { text: comment, rating: rating });

            // Optimistically update UI
            const newComment = {
                id: Math.random().toString(),
                username: user.name,
                text: comment,
                rating: rating,
                createdAt: new Date().toISOString().split('T')[0],
            };

            setComments([newComment, ...comments]);
            setComment('');
            setRating(5);
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert('Failed to submit comment. Please try again.');
        }
    };

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading delicious details...</p>
            </div>
        );
    }

    // --- Error State ---
    if (error || !recipe) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Recipe Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "We couldn't find the recipe you're looking for."}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Calculate progress
    const completionPercent = recipe.ingredients && recipe.ingredients.length > 0
        ? Math.round((checkedIngredients.size / recipe.ingredients.length) * 100)
        : 0;

    // --- Main UI (Your original design) ---
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ChefHat className="w-6 h-6 text-orange-500" />
                            <h1 className="text-xl font-bold text-gray-800">Mystère Meal</h1>
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 hidden md:inline">Hello, {user.name}</span>
                                <Link to="/add-recipe" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                                    + Add Recipe
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Menu</span>
                </button>

                {/* Recipe Hero Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-64 md:h-96 bg-gray-200">
                        <img
                            src={recipe.image && recipe.image.startsWith('http') ? recipe.image : 'https://placehold.co/1200x600?text=Delicious+Food'}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/1200x600?text=No+Image';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 shadow-sm">{recipe.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">{recipe.rating || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                                    <Clock className="w-5 h-5" />
                                    <span>{recipe.time} min</span>
                                </div>
                                <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                                    <ChefHat className="w-5 h-5" />
                                    <span>{recipe.difficulty}</span>
                                </div>
                                <span className="px-3 py-1 bg-orange-500 rounded-full font-medium">
                                    {recipe.cuisine}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Ingredients & Nutrition */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Ingredients Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                Ingredients <span className="text-sm font-normal text-gray-500">({recipe.ingredients.length})</span>
                            </h2>

                            {/* Progress bar */}
                            <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Preparation</span>
                                    <span className="text-xs font-bold text-orange-600">{completionPercent}% Done</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${completionPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                {recipe.ingredients.map((ingredient: any, index: number) => {
                                    const ingText = typeof ingredient === 'string' ? ingredient : `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name}`;
                                    return (
                                        <label
                                            key={index}
                                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${checkedIngredients.has(index) ? 'bg-orange-50' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="relative mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={checkedIngredients.has(index)}
                                                    onChange={() => handleIngredientCheck(index)}
                                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-orange-500 checked:border-orange-500 transition-colors"
                                                />
                                                <Check className="w-3.5 h-3.5 text-white absolute top-[3px] left-[3px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                            </div>
                                            <span className={`text-sm md:text-base transition-colors ${checkedIngredients.has(index) ? 'line-through text-gray-400' : 'text-gray-700'
                                                }`}>
                                                {ingText}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Nutrition Card */}
                        {recipe.nutrition && (
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Nutrition Facts</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-orange-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs text-gray-500 font-bold uppercase">Calories</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800">{recipe.nutrition.calories || 0}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Beef className="w-4 h-4 text-blue-500" />
                                            <span className="text-xs text-gray-500 font-bold uppercase">Protein</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800">{recipe.nutrition.protein || 0}g</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Activity className="w-4 h-4 text-green-500" />
                                            <span className="text-xs text-gray-500 font-bold uppercase">Fat</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800">{recipe.nutrition.fat || 0}g</p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Cookie className="w-4 h-4 text-yellow-500" />
                                            <span className="text-xs text-gray-500 font-bold uppercase">Carbs</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800">{recipe.nutrition.carbs || 0}g</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column - Steps & Comments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Steps */}
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
                            <div className="space-y-6">
                                {recipe.steps.map((step, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-gray-700 leading-relaxed text-lg">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comments section */}
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-gray-400" />
                                Community Reviews <span className="text-gray-400 text-lg font-normal">({comments.length})</span>
                            </h2>

                            {/* Comment form */}
                            {user ? (
                                <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 p-4 rounded-xl">
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                            Your Rating
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform hover:scale-110 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${star <= rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="What did you think about this recipe?"
                                            className="w-full px-4 py-3 pb-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none resize-none min-h-[100px]"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute bottom-3 right-3 px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-bold shadow-md"
                                        >
                                            <Send className="w-3 h-3" />
                                            Post Review
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mb-8 p-6 bg-orange-50 rounded-xl text-center border border-orange-100">
                                    <p className="text-gray-700 font-medium mb-3">Join the discussion to share your thoughts!</p>
                                    <Link
                                        to="/login"
                                        className="inline-block px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-bold shadow-sm"
                                    >
                                        Login to Comment
                                    </Link>
                                </div>
                            )}

                            {/* Comments list */}
                            <div className="space-y-6">
                                {comments.length > 0 ? (
                                    comments.map((c) => (
                                        <div key={c.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                                                        {c.username.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{c.username}</p>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-3 h-3 ${star <= c.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{c.createdAt}</span>
                                            </div>
                                            <p className="text-gray-600 pl-[52px]">{c.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 italic py-4">No reviews yet. Be the first to share your experience!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};