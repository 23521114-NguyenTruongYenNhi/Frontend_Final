// File: src/pages/AddRecipePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeAPI, ingredientNutritionAPI, IngredientNutritionPayload } from '../api/client';
import { ChefHat, Plus, X, ArrowLeft, Upload, Clock, Calculator } from 'lucide-react';

interface IngredientInput {
    name: string;
    quantity: string;
    unit: string;
}

export const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [calcStatus, setCalcStatus] = useState(''); // Trạng thái tính toán

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

    // Nutrition info
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');

    const [isVegetarian, setIsVegetarian] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isGlutenFree, setIsGlutenFree] = useState(false);

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    // --- HÀM TÍNH TOÁN DINH DƯỠNG (QUAN TRỌNG) ---
    const calculateAndSetNutrition = async () => {
        setCalcStatus('Calculating...');

        // 1. Chuẩn bị dữ liệu gửi đi
        const parsedIngredients: IngredientNutritionPayload[] = ingredients
            .map(ing => ({
                name: ing.name.trim(),
                quantity: parseFloat(ing.quantity) || 0,
                unit: ing.unit.trim(),
            }))
            .filter(item => item.name && item.quantity > 0 && item.unit);

        console.log("📤 Đang gửi đi tính toán:", parsedIngredients); // <--- KIỂM TRA LOG NÀY

        if (parsedIngredients.length === 0) {
            setCalcStatus('');
            setCalories(''); setProtein(''); setFat(''); setCarbs('');
            return;
        }

        try {
            // 2. Gọi API
            const result: any = await ingredientNutritionAPI.calculateRecipeNutrition(parsedIngredients);

            console.log("📥 Kết quả nhận về:", result); // <--- KIỂM TRA LOG NÀY

            // 3. Cập nhật UI
            if (result && result.totalNutrition) {
                setCalories(Math.round(result.totalNutrition.calories).toString());
                setProtein(result.totalNutrition.protein.toFixed(1));
                setFat(result.totalNutrition.fat.toFixed(1));
                setCarbs(result.totalNutrition.carbs.toFixed(1));
                setCalcStatus('✓ Updated');
            } else {
                setCalcStatus('⚠️ No Data');
            }

        } catch (err) {
            console.error('❌ Lỗi tính toán:', err);
            setCalcStatus('❌ Error');
        }
    };

    // Tự động tính sau 1 giây khi ngừng gõ
    useEffect(() => {
        const handler = setTimeout(() => {
            calculateAndSetNutrition();
        }, 1000);
        return () => clearTimeout(handler);
    }, [ingredients]);

    // --- Handlers ---
    const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
    const removeIngredient = (index: number) => {
        if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== index));
    };
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

        // Convert to string array for backend
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
                isVegetarian, isVegan, isGlutenFree,
            });

            alert("Recipe submitted successfully!");
            navigate('/profile'); // Hoặc trang chủ
        } catch (err: any) {
            setError(err.message || 'Failed to create recipe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-10">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
                        <ChefHat /> Mystère Meal
                    </Link>
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black font-medium">Back</button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-xl shadow p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Recipe</h2>
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Recipe Name" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Time (mins)</label>
                                        <input type="number" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="30" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
                                        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 border rounded-lg outline-none">
                                            <option>Easy</option><option>Medium</option><option>Hard</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                                    <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="https://..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cuisine</label>
                                        <select value={cuisine} onChange={e => setCuisine(e.target.value)} className="w-full p-3 border rounded-lg outline-none">
                                            <option>Vietnamese</option><option>Italian</option><option>American</option><option>Japanese</option><option>Thai</option><option>Indian</option><option>Mexican</option><option>Chinese</option><option>French</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Meal Type</label>
                                        <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full p-3 border rounded-lg outline-none">
                                            <option>Dinner</option><option>Lunch</option><option>Breakfast</option><option>Snack</option><option>Dessert</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold">Ingredients</h3>
                                <button type="button" onClick={addIngredient} className="text-orange-600 font-bold text-sm hover:underline">+ Add Ingredient</button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase">
                                    <div className="col-span-6">Name</div>
                                    <div className="col-span-3">Qty</div>
                                    <div className="col-span-2">Unit</div>
                                </div>
                                {ingredients.map((ing, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-6">
                                            <input type="text" value={ing.name} onChange={e => updateIngredient(idx, 'name', e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Chicken" />
                                        </div>
                                        <div className="col-span-3">
                                            <input type="number" value={ing.quantity} onChange={e => updateIngredient(idx, 'quantity', e.target.value)} className="w-full p-2 border rounded" placeholder="100" />
                                        </div>
                                        <div className="col-span-2">
                                            {/* Gợi ý: Dùng đơn vị khớp với DB (g, cup, piece) */}
                                            <input type="text" value={ing.unit} onChange={e => updateIngredient(idx, 'unit', e.target.value)} className="w-full p-2 border rounded" placeholder="g" />
                                        </div>
                                        <div className="col-span-1 text-center">
                                            {ingredients.length > 1 && <button type="button" onClick={() => removeIngredient(idx)} className="text-red-500 hover:text-red-700">✕</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition Display */}
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                                    <Calculator className="w-4 h-4" /> Estimated Nutrition
                                </h3>
                                <span className="text-xs font-mono text-gray-500">{calcStatus}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-xs text-gray-500">Calories</div>
                                    <div className="font-bold text-gray-800">{calories || '-'}</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-xs text-gray-500">Protein</div>
                                    <div className="font-bold text-gray-800">{protein || '-'}g</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-xs text-gray-500">Fat</div>
                                    <div className="font-bold text-gray-800">{fat || '-'}g</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm">
                                    <div className="text-xs text-gray-500">Carbs</div>
                                    <div className="font-bold text-gray-800">{carbs || '-'}g</div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold">Instructions</h3>
                                <button type="button" onClick={addStep} className="text-orange-600 font-bold text-sm hover:underline">+ Add Step</button>
                            </div>
                            <div className="space-y-3">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <span className="font-bold text-gray-400 mt-2">{idx + 1}.</span>
                                        <textarea value={step} onChange={e => updateStep(idx, e.target.value)} className="flex-1 p-3 border rounded-lg resize-none" rows={2} placeholder="Describe this step..." />
                                        {steps.length > 1 && <button type="button" onClick={() => removeStep(idx)} className="text-red-500 self-center">✕</button>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50">
                                {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};