// File: src/pages/AddRecipePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeAPI, ingredientNutritionAPI, IngredientNutritionPayload } from '../api/client';
import {
    ChefHat, Plus, X, ArrowLeft, Upload, Clock, Calculator,
    Utensils, Activity, Flame, Scale, Droplet, Wheat, Save, Trash2
} from 'lucide-react';

interface IngredientInput {
    name: string;
    quantity: string;
    unit: string;
}

export const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [calcStatus, setCalcStatus] = useState('');

    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [cuisine, setCuisine] = useState('Vietnamese');
    const [mealType, setMealType] = useState('Dinner');
    const [difficulty, setDifficulty] = useState('Medium');
    const [time, setTime] = useState('');

    const [ingredients, setIngredients] = useState<IngredientInput[]>([
        { name: '', quantity: '', unit: 'g' }
    ]);
    const [steps, setSteps] = useState<string[]>(['']);

    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');

    // --- LOGIC (Giữ nguyên) ---
    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const calculateAndSetNutrition = async () => {
        setCalcStatus('Calculating...');
        const parsedIngredients: IngredientNutritionPayload[] = ingredients
            .map(ing => ({
                name: ing.name.trim(),
                quantity: parseFloat(ing.quantity) || 0,
                unit: ing.unit.trim(),
            }))
            .filter(item => item.name && item.quantity > 0 && item.unit);

        if (parsedIngredients.length === 0) {
            setCalcStatus('');
            setCalories(''); setProtein(''); setFat(''); setCarbs('');
            return;
        }

        try {
            const result: any = await ingredientNutritionAPI.calculateRecipeNutrition(parsedIngredients);
            if (result && result.totalNutrition) {
                setCalories(Math.round(result.totalNutrition.calories).toString());
                setProtein(result.totalNutrition.protein.toFixed(1));
                setFat(result.totalNutrition.fat.toFixed(1));
                setCarbs(result.totalNutrition.carbs.toFixed(1));
                setCalcStatus('Updated');
            } else {
                setCalcStatus('No Data');
            }
        } catch (err) {
            console.error(err);
            setCalcStatus('Error');
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => { calculateAndSetNutrition(); }, 1000);
        return () => clearTimeout(handler);
    }, [ingredients]);

    const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
    const removeIngredient = (index: number) => { if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index)); };
    const updateIngredient = (index: number, field: keyof IngredientInput, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const addStep = () => setSteps([...steps, '']);
    const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const validIngredients = ingredients
            .filter(ing => ing.name.trim() && ing.quantity.trim())
            .map(ing => `${ing.quantity.trim()}${ing.unit.trim()} ${ing.name.trim()}`);

        if (!title.trim()) { setError('Please enter a recipe title'); return; }
        if (validIngredients.length === 0) { setError('Please add at least one ingredient'); return; }
        if (!time || parseInt(time) <= 0) { setError('Please enter a valid cooking time'); return; }

        setIsSubmitting(true);
        try {
            await recipeAPI.create({
                title: title.trim(),
                image: image.trim() || 'https://placehold.co/600x400?text=Tasty+Food',
                cuisine, mealType, difficulty,
                time: parseInt(time),
                ingredients: validIngredients,
                steps: steps.filter(s => s.trim()),
                nutrition: {
                    calories: parseInt(calories) || 0,
                    protein: parseFloat(protein) || 0,
                    fat: parseFloat(fat) || 0,
                    carbs: parseFloat(carbs) || 0,
                },
            });
            alert("Recipe submitted successfully!");
            navigate('/profile');
        } catch (err: any) {
            setError(err.message || 'Failed to create recipe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- CLASS CHUẨN HÓA (Để tái sử dụng) ---
    // h-12 (48px) để đảm bảo mọi ô input cao bằng nhau
    const inputClass = "w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-400 text-gray-700";
    const selectClass = "w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none text-gray-700";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide text-[11px]";

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
                        <ChefHat className="w-6 h-6" /> Mystère Meal
                    </Link>
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black font-medium flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Cancel
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <form onSubmit={handleSubmit}>
                    {/* Header Title Form */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Recipe</h1>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-orange-600 text-white px-6 h-12 rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50 shadow-md shadow-orange-200"
                        >
                            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4" /> Add Recipe</>}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <X className="w-5 h-5" /> {error}
                        </div>
                    )}

                    {/* MAIN GRID LAYOUT */}
                    <div className="grid grid-cols-12 gap-6">

                        {/* LEFT COLUMN: Basic Info (8 cols) */}
                        <div className="col-span-12 lg:col-span-8 space-y-6">

                            {/* Card: Basic Details */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Hàng 1: Title */}
                                    <div className="col-span-12">
                                        <label className={labelClass}>Recipe Title</label>
                                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Grandma's Pho" required />
                                    </div>

                                    {/* Hàng 2: Time & Difficulty & Meal Type */}
                                    <div className="col-span-12 md:col-span-4">
                                        <label className={labelClass}>Time (mins)</label>
                                        <div className="relative">
                                            <input type="number" value={time} onChange={e => setTime(e.target.value)} className={`${inputClass} pl-10`} placeholder="30" required />
                                            <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <label className={labelClass}>Difficulty</label>
                                        <div className="relative">
                                            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={`${selectClass} pl-10`}>
                                                <option>Easy</option><option>Medium</option><option>Hard</option>
                                            </select>
                                            <Activity className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <label className={labelClass}>Meal Type</label>
                                        <div className="relative">
                                            <select value={mealType} onChange={e => setMealType(e.target.value)} className={`${selectClass} pl-10`}>
                                                <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Dessert</option>
                                            </select>
                                            <Utensils className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Hàng 3: Cuisine & Image */}
                                    <div className="col-span-12 md:col-span-6">
                                        <label className={labelClass}>Cuisine</label>
                                        <select value={cuisine} onChange={e => setCuisine(e.target.value)} className={selectClass}>
                                            <option>Vietnamese</option><option>Italian</option><option>American</option><option>Japanese</option><option>Thai</option><option>Indian</option><option>Mexican</option><option>Chinese</option><option>French</option>
                                        </select>
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label className={labelClass}>Image URL</label>
                                        <div className="relative">
                                            <input type="url" value={image} onChange={e => setImage(e.target.value)} className={`${inputClass} pl-10`} placeholder="https://image.com/..." />
                                            <Upload className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card: Ingredients */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Scale className="w-5 h-5 text-orange-600" /> Ingredients
                                    </h3>
                                    <button type="button" onClick={addIngredient} className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition">+ Add Item</button>
                                </div>

                                {/* Ingredients Header Grid */}
                                <div className="grid grid-cols-12 gap-3 mb-2 px-1">
                                    <div className="col-span-6 text-xs font-bold text-gray-400 uppercase">Item Name</div>
                                    <div className="col-span-3 text-xs font-bold text-gray-400 uppercase">Qty</div>
                                    <div className="col-span-2 text-xs font-bold text-gray-400 uppercase">Unit</div>
                                    <div className="col-span-1"></div>
                                </div>

                                <div className="space-y-3">
                                    {ingredients.map((ing, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                                            {/* Name Input */}
                                            <div className="col-span-6">
                                                <input
                                                    type="text"
                                                    value={ing.name}
                                                    onChange={e => updateIngredient(idx, 'name', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="Name"
                                                />
                                            </div>
                                            {/* Qty Input */}
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    value={ing.quantity}
                                                    onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="0"
                                                />
                                            </div>
                                            {/* Unit Input */}
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    value={ing.unit}
                                                    onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="Unit"
                                                />
                                            </div>
                                            {/* Delete Button */}
                                            <div className="col-span-1 flex justify-center">
                                                {ingredients.length > 1 && (
                                                    <button type="button" onClick={() => removeIngredient(idx)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card: Instructions */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <ChefHat className="w-5 h-5 text-orange-600" /> Instructions
                                    </h3>
                                    <button type="button" onClick={addStep} className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition">+ Add Step</button>
                                </div>

                                <div className="space-y-4">
                                    {steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center mt-1">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 relative">
                                                <textarea
                                                    value={step}
                                                    onChange={e => updateStep(idx, e.target.value)}
                                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none resize-none"
                                                    rows={3}
                                                    placeholder="Describe this step..."
                                                />
                                                {steps.length > 1 && (
                                                    <button type="button" onClick={() => removeStep(idx)} className="absolute right-2 top-2 text-gray-400 hover:text-red-500 p-1">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Image Preview & Nutrition (4 cols) */}
                        <div className="col-span-12 lg:col-span-4 space-y-6">

                            {/* Image Preview Box */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                                    {image ? (
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <Upload className="w-12 h-12 mb-2 opacity-50" />
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nutrition Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                                <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-orange-600" /> Nutrition
                                    </h3>
                                    <span className="text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded shadow-sm border border-orange-100">
                                        {calcStatus || 'Auto'}
                                    </span>
                                </div>

                                <div className="p-5 space-y-4">
                                    {/* Big Calories */}
                                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-xs text-gray-500 font-bold uppercase mb-1">Calories</div>
                                        <div className="text-3xl font-black text-gray-800 flex items-center justify-center gap-1">
                                            {calories || '0'} <span className="text-sm font-normal text-gray-400">kcal</span>
                                        </div>
                                    </div>

                                    {/* Macros Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="p-2 text-center bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex justify-center mb-1 text-blue-500"><Activity className="w-4 h-4" /></div>
                                            <div className="font-bold text-gray-800">{protein || '0'}g</div>
                                            <div className="text-[10px] uppercase font-bold text-gray-500">Pro</div>
                                        </div>
                                        <div className="p-2 text-center bg-yellow-50 rounded-lg border border-yellow-100">
                                            <div className="flex justify-center mb-1 text-yellow-500"><Droplet className="w-4 h-4" /></div>
                                            <div className="font-bold text-gray-800">{fat || '0'}g</div>
                                            <div className="text-[10px] uppercase font-bold text-gray-500">Fat</div>
                                        </div>
                                        <div className="p-2 text-center bg-green-50 rounded-lg border border-green-100">
                                            <div className="flex justify-center mb-1 text-green-500"><Wheat className="w-4 h-4" /></div>
                                            <div className="font-bold text-gray-800">{carbs || '0'}g</div>
                                            <div className="text-[10px] uppercase font-bold text-gray-500">Carb</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </main>
        </div>
    );
};