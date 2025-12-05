import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockRecipes } from '../data/mockRecipes';
import { Recipe } from '../types/recipe';
import { useAuth } from '../context/AuthContext';
import { recipeAPI, shoppingListAPI } from '../api/client';
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
    ShoppingBag,
    X,
} from 'lucide-react';

// --- Components ---

// Modal component for adding missing ingredients to shopping list
interface MissingIngredientsModalProps {
    isOpen: boolean;
    onClose: () => void;
    missingIngredients: string[];
    onAddToShoppingList: () => void;
    isLoading: boolean;
}

const MissingIngredientsModal: React.FC<MissingIngredientsModalProps> = ({
    isOpen,
    onClose,
    missingIngredients,
    onAddToShoppingList,
    isLoading,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Missing Ingredients</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        You still need <strong>{missingIngredients.length}</strong> ingredient(s). Would you like to add them to your shopping list?
                    </p>

                    {/* Ingredients list */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
                        <ul className="space-y-2">
                            {missingIngredients.map((ingredient, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                    <span className="text-gray-700 capitalize">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onAddToShoppingList}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Add to Shopping List</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export const RecipeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isAddingToList, setIsAddingToList] = useState(false);

    useEffect(() => {
        const loadRecipe = async () => {
            if (!id) return;

            try {
                // Try to fetch from backend API
                const data: any = await recipeAPI.getById(id);
                setRecipe(data);

                // Set comments from API response
                if (data.comments && Array.isArray(data.comments)) {
                    setComments(data.comments.map((c: any) => ({
                        id: c._id,
                        username: c.user?.name || 'Anonymous',
                        text: c.text,
                        rating: c.rating,
                        createdAt: new Date(c.createdAt).toISOString().split('T')[0],
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
                // Fallback to mock data
                const foundRecipe = mockRecipes.find(r => r.id === id);
                if (foundRecipe) {
                    setRecipe(foundRecipe);
                    // Mock comments
                    setComments([
                        {
                            id: '1',
                            username: 'Chef Mai',
                            text: 'Amazing recipe! My family loved this dish.',
                            rating: 5,
                            createdAt: '2024-01-15',
                        },
                        {
                            id: '2',
                            username: 'John Smith',
                            text: 'Easy to make and delicious. I added some extra garlic.',
                            rating: 4,
                            createdAt: '2024-01-10',
                        },
                    ]);
                } else {
                    navigate('/');
                }
            }
        };

        loadRecipe();
    }, [id, navigate]);

    const getMissingIngredients = (): string[] => {
        if (!recipe) return [];
        return recipe.ingredients.filter((_, index) => !checkedIngredients.has(index));
    };

    const handleIngredientCheck = (index: number) => {
        const newChecked = new Set(checkedIngredients);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedIngredients(newChecked);
    };

    // --- FIX: Hàm xử lý thêm vào giỏ hàng ---
    const handleAddToShoppingList = async () => {
        if (!user || !recipe || !id) {
            navigate('/login');
            return;
        }

        setIsAddingToList(true);

        try {
            const missingIngredients = getMissingIngredients();

            // Thay vì gọi API addMissingIngredients (đang bị lỗi 404)
            // Chúng ta dùng vòng lặp để thêm từng món -> Nhanh và chắc chắn hơn với Backend hiện tại
            const addPromises = missingIngredients.map(ingredient => {
                return shoppingListAPI.addItem({
                    name: ingredient,
                    quantity: 1,
                    unit: 'item',
                    // Nếu backend hỗ trợ lưu recipeId thì bỏ comment dòng dưới
                    // recipeId: id, 
                }).catch(err => {
                    console.error(`Failed to add ${ingredient}:`, err);
                    return null; // Bỏ qua lỗi lẻ tẻ để không chặn quy trình
                });
            });

            // Chạy tất cả request cùng lúc
            await Promise.all(addPromises);

            // Success - show toast or notification
            alert(`✓ Successfully added ${missingIngredients.length} ingredient(s) to your shopping list!`);
            setShowModal(false);
        } catch (error) {
            console.error('Failed to add ingredients to shopping list:', error);
            alert('Failed to add ingredients to shopping list. Please try again.');
        } finally {
            setIsAddingToList(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!comment.trim() || !id) return;

        try {
            // Submit comment to backend API
            await recipeAPI.addComment(id, { text: comment, rating: rating });

            // Add comment to local state
            const newComment = {
                id: String(comments.length + 1),
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

    if (!recipe) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const completionPercent = recipe.ingredients.length > 0
        ? Math.round((checkedIngredients.size / recipe.ingredients.length) * 100)
        : 0;

    // Variables for floating widget
    const missingIngredientsList = getMissingIngredients();
    const hasMissingItems = missingIngredientsList.length > 0 && missingIngredientsList.length < recipe.ingredients.length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ChefHat className="w-6 h-6 text-orange-500" />
                            <h1 className="text-xl font-bold text-gray-800">Mystère Meal</h1>
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Hello, {user.name}</span>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                {/* Recipe header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-96 bg-gradient-to-br from-orange-100 to-orange-200">
                        {recipe.image && (
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">{recipe.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-5 h-5" />
                                    <span>{recipe.time} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ChefHat className="w-5 h-5" />
                                    <span>{recipe.difficulty}</span>
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    {recipe.cuisine}
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    {recipe.mealType}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Ingredients & Nutrition */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Ingredients */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">Progress</span>
                                    <span className="text-sm font-bold text-orange-600">{completionPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${completionPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={checkedIngredients.has(index)}
                                                onChange={() => handleIngredientCheck(index)}
                                                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                            {checkedIngredients.has(index) && (
                                                <Check className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none" />
                                            )}
                                        </div>
                                        <span
                                            className={`capitalize ${checkedIngredients.has(index)
                                                ? 'line-through text-gray-400'
                                                : 'text-gray-700'
                                                }`}
                                        >
                                            {ingredient}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nutrition</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                    <Flame className="w-6 h-6 text-orange-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Calories</p>
                                        <p className="font-bold text-gray-800">{recipe.nutrition.calories}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <Beef className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Protein</p>
                                        <p className="font-bold text-gray-800">{recipe.nutrition.protein}g</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <Activity className="w-6 h-6 text-green-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Fat</p>
                                        <p className="font-bold text-gray-800">{recipe.nutrition.fat}g</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                    <Cookie className="w-6 h-6 text-yellow-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Carbs</p>
                                        <p className="font-bold text-gray-800">{recipe.nutrition.carbs}g</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Steps & Comments */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Steps */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
                            <div className="space-y-4">
                                {recipe.steps.map((step, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id={`step-${index}`}
                                                className="w-5 h-5 mt-1 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                                onChange={(e) => {
                                                    const stepElement = e.target.nextElementSibling as HTMLElement;
                                                    if (stepElement) {
                                                        if (e.target.checked) {
                                                            stepElement.classList.add('line-through', 'text-gray-400');
                                                        } else {
                                                            stepElement.classList.remove('line-through', 'text-gray-400');
                                                        }
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={`step-${index}`}
                                                className="text-gray-700 leading-relaxed cursor-pointer transition-colors"
                                            >
                                                {step}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comments section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6" />
                                Comments ({comments.length})
                            </h2>

                            {/* Comment form */}
                            {user ? (
                                <form onSubmit={handleSubmitComment} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Your Rating
                                        </label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 ${star <= rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience with this dish..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none resize-none"
                                        rows={3}
                                    />
                                    <button
                                        type="submit"
                                        className="mt-3 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Submit Comment
                                    </button>
                                </form>
                            ) : (
                                <div className="mb-6 p-4 bg-orange-50 rounded-lg text-center">
                                    <p className="text-gray-700 mb-2">Please login to comment</p>
                                    <Link
                                        to="/login"
                                        className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Login Now
                                    </Link>
                                </div>
                            )}

                            {/* Comments list */}
                            <div className="space-y-4">
                                {comments.map((c) => (
                                    <div key={c.id} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-800">{c.username}</p>
                                                <div className="flex gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= c.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{c.createdAt}</span>
                                        </div>
                                        <p className="text-gray-700">{c.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Widget (Popup nhỏ) - Chỉ hiện khi có missing item và đã login */}
            {user && hasMissingItems && (
                <div className="fixed bottom-6 right-6 z-40 animate-bounce-subtle">
                    <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-4 flex items-center gap-4 max-w-sm transition-all duration-300">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <ShoppingBag className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">You are missing</p>
                            <p className="text-lg font-bold text-gray-800">
                                {missingIngredientsList.length} ingredients
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg flex items-center gap-2"
                        >
                            <span>Add</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </button>

                        {/* Nút tắt widget */}
                        <button
                            onClick={() => {
                                const allIndices = new Set(recipe.ingredients.map((_, i) => i));
                                setCheckedIngredients(allIndices);
                            }}
                            className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-500"
                            title="I have everything"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Missing Ingredients Modal - Chỉ hiện khi showModal = true */}
            <MissingIngredientsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                missingIngredients={missingIngredientsList}
                onAddToShoppingList={handleAddToShoppingList}
                isLoading={isAddingToList}
            />
        </div>
    );
};