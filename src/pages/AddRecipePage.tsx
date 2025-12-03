// File: src/pages/AddRecipePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Đảm bảo import cả hai API cần thiết
import { recipeAPI, ingredientNutritionAPI, IngredientNutritionPayload } from '../api/client'; 
import { ChefHat, Plus, X, ArrowLeft, Upload, Clock } from 'lucide-react';

// --- INTERFACE CHO INPUT CÓ CẤU TRÚC ---
interface IngredientInput {
    name: string;
    quantity: string; // Vẫn dùng string để gắn vào input
    unit: string;
}

export const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // --- Loading & Error States ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // --- Form Data States ---
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [cuisine, setCuisine] = useState('Vietnamese');
    const [mealType, setMealType] = useState('Dinner');
    const [difficulty, setDifficulty] = useState('Medium');
    const [time, setTime] = useState('');

    // Dynamic lists for ingredients (Dùng structured object)
    const [ingredients, setIngredients] = useState<IngredientInput[]>([
        { name: '', quantity: '', unit: 'g' }
    ]);
    const [steps, setSteps] = useState<string[]>(['']);

    // Nutrition info (sẽ được tự động cập nhật)
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');

    // Dietary checkboxes (giữ nguyên)
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isGlutenFree, setIsGlutenFree] = useState(false);

    // --- Authentication Check ---
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);


    // --- HÀM TÍNH TOÁN VÀ CẬP NHẬT TỰ ĐỘNG ---
    const calculateAndSetNutrition = async () => {
        // 1. Lọc và chuyển đổi ingredients sang format số học
        const parsedIngredients: IngredientNutritionPayload[] = ingredients
            .map(ing => ({
                name: ing.name.trim(),
                quantity: parseFloat(ing.quantity) || 0,
                unit: ing.unit.trim(),
            }))
            .filter(item => item.name && item.quantity > 0 && item.unit);
        
        if (parsedIngredients.length === 0) {
            // Reset nếu không có nguyên liệu hợp lệ
            setCalories(''); setProtein(''); setFat(''); setCarbs('');
            return;
        }

        try {
            // 2. Gọi API tính toán tổng dinh dưỡng
            const result: any = await ingredientNutritionAPI.calculateRecipeNutrition(parsedIngredients); 
            
            // 3. Cập nhật các trường Nutrition trong form
            setCalories(Math.round(result.totalNutrition.calories).toString());
            setProtein(result.totalNutrition.protein.toFixed(1));
            setFat(result.totalNutrition.fat.toFixed(1));
            setCarbs(result.totalNutrition.carbs.toFixed(1));

        } catch (err) {
            console.warn('Could not auto-calculate nutrition data. Proceeding without it.', err);
            setCalories(''); setProtein(''); setFat(''); setCarbs('');
        }
    };
    
    // EFFECT: Chạy tính toán mỗi khi danh sách ingredients thay đổi (Debounce 800ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            calculateAndSetNutrition();
        }, 800); 
        
        return () => clearTimeout(handler);
    }, [ingredients]);
    // ------------------------------------------

    // --- Handlers for Ingredients (Dùng object) ---
    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
    };

    const removeIngredient = (index: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const updateIngredient = (index: number, field: keyof IngredientInput, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    // --- Handlers for Steps (giữ nguyên) ---
    const addStep = () => { setSteps([...steps, '']); };
    const removeStep = (index: number) => { setSteps(steps.filter((_, i) => i !== index)); };
    const updateStep = (index: number, value: string) => { 
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    // --- Form Submission Handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Chuyển đổi structured input thành string array cho Backend
        const validIngredients = ingredients
            .filter(ing => ing.name.trim() && ing.quantity.trim())
            .map(ing => `${ing.quantity.trim()}${ing.unit.trim() ? ing.unit.trim() + ' ' : ''}${ing.name.trim()}`);
            
        // 2. Validation 
        if (!title.trim()) {
            setError('Please enter a recipe title');
            return;
        }

        if (validIngredients.length === 0) {
            setError('Please add at least one ingredient');
            return;
        }

        const validSteps = steps.filter(step => step.trim());
        if (validSteps.length === 0) {
            setError('Please add at least one cooking step');
            return;
        }

        if (!time || parseInt(time) <= 0) {
            setError('Please enter a valid cooking time');
            return;
        }

        setIsSubmitting(true);

        try {
            // 3. Prepare Data Payload
            const recipeData = {
                title: title.trim(),
                image: image.trim() || 'https://placehold.co/600x400?text=Tasty+Food',
                cuisine,
                mealType,
                difficulty,
                time: parseInt(time),
                ingredients: validIngredients, // Submitted as structured string array
                steps: validSteps,
                nutrition: {
                    // Dùng giá trị đã được tính toán tự động
                    calories: parseInt(calories) || 0,
                    protein: parseFloat(protein) || 0,
                    fat: parseFloat(fat) || 0,
                    carbs: parseFloat(carbs) || 0,
                },
                isVegetarian,
                isVegan,
                isGlutenFree,
            };

            await recipeAPI.create(recipeData);

            // 4. Success & Redirect
            alert("Recipe submitted successfully! Your recipe is pending approval from the Admin.");
            navigate('/profile');
            
        } catch (err: any) {
            console.error('Failed to create recipe:', err);
            setError(err.message || 'Failed to create recipe. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ChefHat className="w-6 h-6 text-orange-500" />
                            <h1 className="text-xl font-bold text-gray-800">Mystère Meal</h1>
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Share Your Recipe</h2>
                        <p className="text-gray-600">Fill in the details below to share your delicious creation with the community!</p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 1. Basic Info */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Grandma's Chocolate Chip Cookies"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                        <div className="flex items-center justify-center w-12 bg-gray-100 rounded-lg border border-gray-300">
                                            <Upload className="w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                                        <select
                                            value={cuisine}
                                            onChange={(e) => setCuisine(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            <option value="Vietnamese">Vietnamese</option>
                                            <option value="Italian">Italian</option>
                                            <option value="American">American</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Mexican">Mexican</option>
                                            <option value="Japanese">Japanese</option>
                                            <option value="Indian">Indian</option>
                                            <option value="French">French</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                                        <select
                                            value={mealType}
                                            onChange={(e) => setMealType(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Snack">Snack</option>
                                            <option value="Dessert">Dessert</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Time (minutes) *</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                placeholder="30"
                                                min="1"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                required
                                            />
                                            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Ingredients Section (STRUCTURED INPUTS) */}
                        <div>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-800">Ingredients *</h3>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="flex items-center gap-2 px-3 py-1.5 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm font-bold"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* HÀNG HEADER */}
                                <div className="flex items-center gap-2 font-bold text-sm text-gray-600 border-b pb-1 ml-6">
                                    <span className="flex-1">Ingredient Name</span>
                                    <span className="w-24 text-center">Quantity</span>
                                    <span className="w-32 text-center">Unit</span>
                                    <span className="w-8"></span>
                                </div>
                                
                                {/* INPUTS */}
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-gray-400 w-6 text-center">{index + 1}.</span>
                                        
                                        {/* Tên Nguyên liệu */}
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                            placeholder="e.g., Chicken Breast"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                        
                                        {/* Số lượng */}
                                        <input
                                            type="number"
                                            value={ingredient.quantity}
                                            onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                            placeholder="SL"
                                            min="0"
                                            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                        
                                        {/* Đơn vị */}
                                        <input
                                            type="text"
                                            value={ingredient.unit}
                                            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                            placeholder="g, ml, cup..."
                                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />

                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Instructions Section (giữ nguyên) */}
                        <div>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h3 className="text-xl font-bold text-gray-800">Instructions *</h3>
                                <button
                                    type="button"
                                    onClick={addStep}
                                    className="flex items-center gap-2 px-3 py-1.5 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm font-bold"
                                >
                                    <Plus className="w-4 h-4" /> Add Step
                                </button>
                            </div>

                            <div className="space-y-3">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm mt-1">
                                            {index + 1}
                                        </div>
                                        <textarea
                                            value={step}
                                            onChange={(e) => updateStep(index, e.target.value)}
                                            placeholder="Describe the cooking step..."
                                            rows={2}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                        />
                                        {steps.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeStep(index)}
                                                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Nutrition Section (AUTO-FILLED) */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Nutrition (Auto-Calculated)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Calories</label>
                                    <input
                                        type="number"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Protein (g)</label>
                                    <input
                                        type="number"
                                        value={protein}
                                        onChange={(e) => setProtein(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fat (g)</label>
                                    <input
                                        type="number"
                                        value={fat}
                                        onChange={(e) => setFat(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Carbs (g)</label>
                                    <input
                                        type="number"
                                        value={carbs}
                                        onChange={(e) => setCarbs(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-orange-600">
                                Note: Nutrition data is automatically calculated from the structured ingredients above.
                            </p>
                        </div>


                        {/* 5. Dietary Options (giữ nguyên) */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Dietary Tags</h3>
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isVegetarian}
                                        onChange={(e) => setIsVegetarian(e.target.checked)}
                                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isVegan}
                                        onChange={(e) => setIsVegan(e.target.checked)}
                                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700">Vegan</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isGlutenFree}
                                        onChange={(e) => setIsGlutenFree(e.target.checked)}
                                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700">Gluten-Free</span>
                                </label>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};