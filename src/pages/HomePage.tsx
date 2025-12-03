import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/SearchBar';
import { TagList } from '../components/TagList';
import { FiltersPanel } from '../components/FiltersPanel';
import { ResultsGrid } from '../components/ResultsGrid';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { Recipe, RecipeFilters } from '../types/recipe';
import { searchRecipes } from '../data/mockRecipes';
import { recipeAPI } from '../api/client';
import { ChefHat, LogOut, User, Info, Mail, PlusCircle, Search, Filter, Bookmark } from 'lucide-react';
import { Logo } from '../components/Logo';

const STORAGE_KEY = 'mystere-meal-ingredients';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [filters, setFilters] = useState<RecipeFilters>({});
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Load ingredients from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setIngredients(parsed);
                }
            } catch (error) {
                console.error('Failed to parse stored ingredients:', error);
            }
        }
    }, []);

    // Save ingredients to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    }, [ingredients]);

    // Auto-search when filters change (if already searched)
    useEffect(() => {
        if (hasSearched) {
            handleSearch();
        }
    }, [filters]);

    const handleAddIngredient = (ingredient: string) => {
        if (!ingredients.includes(ingredient)) {
            setIngredients([...ingredients, ingredient]);
        }
    };

    const handleRemoveIngredient = (ingredient: string) => {
        setIngredients(ingredients.filter(ing => ing !== ingredient));
    };

    const handleClearAll = () => {
        setIngredients([]);
        setFilters({});
        setRecipes([]);
        setHasSearched(false);
    };

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);

        try {
            // Call backend API for recipe search
            const data: any = await recipeAPI.search({
                ingredients: ingredients,
                cuisine: filters.cuisine,
                mealType: filters.mealType,
                difficulty: filters.difficulty,
                maxTime: filters.maxTime,
                minRating: filters.minRating,
                isVegetarian: filters.isVegetarian,
                isVegan: filters.isVegan,
                isGlutenFree: filters.isGlutenFree,
            });

            setRecipes(data);
        } catch (error) {
            console.error('Search failed:', error);
            // Fallback to mock data on API error
            const results = searchRecipes(ingredients, filters);
            setRecipes(results);
        } finally {
            setIsSearching(false);
        }
    };

    const handleRecipeClick = (recipeId: string) => {
        navigate(`/recipe/${recipeId}`);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <Logo />
                        </Link>
                        <div className="flex items-center gap-6">
                            {/* Navigation Links */}
                            <nav className="hidden md:flex items-center gap-6">
                                <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                    About Us
                                </a>
                                <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                    Contact
                                </a>
                                {/* Share Recipe - Prominent Button */}
                                <Link
                                    to="/add-recipe"
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-mono text-lg font-bold tracking-wider uppercase"
                                >
                                    <PlusCircle className="w-6 h-6" />
                                    Share Recipe
                                </Link>
                            </nav>

                            {/* User Menu */}
                            {user && (
                                <>
                                    <span className="text-sm text-gray-600">Hello, <strong>{user.name}</strong></span>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            )}
                            {!user && (
                                <Link
                                    to="/login"
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                {/* Search Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-rounded font-bold text-gray-900 mb-4">
                            What Ingredients Do You Have?
                        </h2>
                        <p className="text-lg text-gray-600 font-medium">Discover delicious recipes tailored to what's in your kitchen</p>
                    </div>

                    <SearchBar onAddIngredient={handleAddIngredient} />
                    <TagList
                        ingredients={ingredients}
                        onRemove={handleRemoveIngredient}
                        onClearAll={handleClearAll}
                    />

                    {/* Search Button */}
                    {ingredients.length > 0 && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSearching ? 'Searching...' : 'Find Recipes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters - Always visible */}
                <div className="mb-8">
                    <FiltersPanel filters={filters} onFilterChange={setFilters} />
                </div>

                {/* Results */}
                {hasSearched && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {recipes.length > 0
                                    ? `Found ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`
                                    : 'No recipes found'}
                            </h2>
                        </div>
                        <ResultsGrid
                            recipes={recipes}
                            onRecipeClick={handleRecipeClick}
                            isSearching={isSearching}
                        />
                    </div>
                )}

                {/* Welcome message for new users */}
                {!hasSearched && ingredients.length === 0 && (
                    <div className="text-center py-20">
                        <ChefHat className="w-20 h-20 text-orange-300 mx-auto mb-6" />
                        <h3 className="text-3xl font-rounded font-bold text-gray-800 mb-4">Welcome to Mystère Meal!</h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            Your culinary journey starts here. Add your ingredients and unlock a world of delicious possibilities!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="p-6 bg-white rounded-xl shadow-md">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChefHat className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-rounded font-bold text-gray-800 mb-2">Smart Ingredient Search</h4>
                                <p className="text-sm text-gray-600">
                                    Instantly match your ingredients with perfect recipes
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-xl shadow-md">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-rounded font-bold text-gray-800 mb-2">Advanced Filters</h4>
                                <p className="text-sm text-gray-600">
                                    Refine your search by cuisine, cooking time, and dietary preferences
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-xl shadow-md">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PlusCircle className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-rounded font-bold text-gray-800 mb-2">Share Your Recipes</h4>
                                <p className="text-sm text-gray-600">
                                    Join our culinary community and share your signature dishes
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* About Section */}
            <AboutSection />

            {/* Contact Section */}
            <ContactSection />

            {/* Footer */}
            <Footer />
        </div>
    );
};
