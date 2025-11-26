// File: src/pages/AddRecipePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipeAPI } from '../api/client';
import { ChefHat, Plus, X, ArrowLeft, Upload, Clock } from 'lucide-react';

export const AddRecipePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // --- Loading & Error ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // --- Form Data ---
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [cuisine, setCuisine] = useState('Vietnamese');
    const [mealType, setMealType] = useState('Dinner');
    const [difficulty, setDifficulty] = useState('Medium');
    const [time, setTime] = useState('');

    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);

    const [nutrition, setNutrition] = useState({
        calories: '',
        protein: '',
        fat: '',
        carbs: ''
    });

    const [dietary, setDietary] = useState({
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false
    });

    // Redirect if not logged in
    useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);

    // --- Ingredient Handlers ---
    const updateIngredient = (i: number, val: string) => setIngredients(prev => prev.map((v, idx) => idx === i ? val : v));
    const addIngredient = () => setIngredients(prev => [...prev, '']);
    const removeIngredient = (i: number) => { if (ingredients.length > 1) setIngredients(prev => prev.filter((_, idx) => idx !== i)); };

    // --- Step Handlers ---
    const updateStep = (i: number, val: string) => setSteps(prev => prev.map((v, idx) => idx === i ? val : v));
    const addStep = () => setSteps(prev => [...prev, '']);
    const removeStep = (i: number) => { if (steps.length > 1) setSteps(prev => prev.filter((_, idx) => idx !== i)); };

    // --- Submit Handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const validIngredients = ingredients.filter(i => i.trim());
        const validSteps = steps.filter(s => s.trim());

        if (!title.trim()) return setError('Please enter a recipe title');
        if (!validIngredients.length) return setError('Please add at least one ingredient');
        if (!validSteps.length) return setError('Please add at least one step');
        if (!time || parseInt(time) <= 0) return setError('Please enter a valid cooking time');

        setIsSubmitting(true);

        try {
            const recipeData = {
                title: title.trim(),
                image: image.trim() || 'https://placehold.co/600x400?text=Tasty+Food',
                cuisine,
                mealType,
                difficulty,
                time: parseInt(time),
                ingredients: validIngredients,
                steps: validSteps,
                nutrition: {
                    calories: parseInt(nutrition.calories) || 0,
                    protein: parseInt(nutrition.protein) || 0,
                    fat: parseInt(nutrition.fat) || 0,
                    carbs: parseInt(nutrition.carbs) || 0
                },
                ...dietary
            };

            await recipeAPI.create(recipeData);
            alert("Recipe submitted! Pending admin approval.");
            navigate('/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create recipe.');
        } finally { setIsSubmitting(false); }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white font-sans">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80">
                        <ChefHat className="w-6 h-6 text-orange-500" />
                        <h1 className="text-xl font-bold text-gray-800">Mystère Meal</h1>
                    </Link>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Share Your Recipe</h2>
                        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info, Ingredients, Steps, Nutrition, Dietary Options */}
                        {/* All handlers and UI simplified for commit */}
                        <div className="space-y-4">
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Recipe Title" className="w-full px-4 py-2 border rounded-lg"/>
                            <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" className="w-full px-4 py-2 border rounded-lg"/>
                            <div className="flex gap-4">
                                <input type="number" value={time} onChange={e => setTime(e.target.value)} placeholder="Cooking Time" className="flex-1 px-4 py-2 border rounded-lg"/>
                                <select value={cuisine} onChange={e => setCuisine(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg">
                                    <option>Vietnamese</option>
                                    <option>Italian</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-orange-500 text-white rounded-lg">
                            {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};
