// File: src/pages/HomePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
// Import thêm ShieldCheck cho Admin
import { ChefHat, LogOut, User, ShoppingBag, PlusCircle, Filter, ChevronDown, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';

const STORAGE_KEY = 'mystere-meal-ingredients';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, logout } = useAuth();

    const [ingredients, setIngredients] = useState<string[]>([]);
    const [filters, setFilters] = useState<RecipeFilters>({});
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const searchSectionRef = useRef<HTMLDivElement>(null);

    // --- Effect: Xử lý URL Params (Cuisine Filter) ---
    useEffect(() => {
        const cuisineParam = searchParams.get('cuisine');
        if (cuisineParam) {
            setFilters(prev => ({ ...prev, cuisine: cuisineParam }));
            setHasSearched(true);
            const fetchByCuisine = async () => {
                setIsSearching(true);
                try {
                    const data: any = await recipeAPI.search({ cuisine: cuisineParam });
                    setRecipes(data);
                } catch (error) {
                    console.error('Search by cuisine failed:', error);
                } finally {
                    setIsSearching(false);
                    setTimeout(() => {
                        searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            };
            fetchByCuisine();
        }
    }, [searchParams]);

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

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    }, [ingredients]);

    useEffect(() => {
        if (hasSearched && !searchParams.get('cuisine')) {
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
        navigate('/');
    };

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);
        try {
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

    const scrollToSearch = () => {
        searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 h-[80px]">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <Link to="/" onClick={() => handleClearAll()} className="flex items-center">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                About Us
                            </a>
                            <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
                                Contact
                            </a>
                            <Link
                                to="/create-recipe"
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-mono text-lg font-bold tracking-wider uppercase"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Share Recipe
                            </Link>
                        </nav>

                        {user && (
                            <>
                                {/* Shopping List Link */}
                                <Link
                                    to="/shopping-list"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Shopping List
                                </Link>

                                {/* --- NÚT PROFILE / ADMIN "BIẾN HÌNH" --- */}
                                <Link
                                    to={user.isAdmin ? "/admin" : "/profile"}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${user.isAdmin
                                            ? 'bg-gray-800 text-white hover:bg-gray-900 shadow-md border border-gray-700' // Style cho Admin (Ngầu hơn)
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' // Style cho User thường
                                        }`}
                                >
                                    {user.isAdmin ? (
                                        // Icon Admin: Cái khiên có dấu tích
                                        <ShieldCheck className="w-4 h-4 text-yellow-400" />
                                    ) : (
                                        // Icon User thường
                                        <User className="w-4 h-4" />
                                    )}

                                    <span className={`font-medium ${user.isAdmin ? 'tracking-wide' : ''}`}>
                                        {user.isAdmin ? 'Admin Portal' : 'Profile'}
                                    </span>
                                </Link>
                                {/* --------------------------------------- */}

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
            </header>

            {/* Hero Section */}
            <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1172&auto=format&fit=crop"
                    alt="Fresh Ingredients"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pb-20">
                    <span className="bg-[#FFB800] text-gray-900 px-6 py-2 rounded-full font-bold mb-6 text-sm md:text-base uppercase tracking-wide shadow-lg">
                        Smart Kitchen Companion
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight max-w-4xl">
                        Turn Your Ingredients Into Delicious Meals
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl leading-relaxed">
                        Don't know what to cook? Simply tell us what ingredients you have in your fridge, and we'll find the perfect recipe for you.
                    </p>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                    <button
                        onClick={scrollToSearch}
                        className="group flex flex-col items-center gap-2 text-white hover:text-orange-300 transition-colors animate-bounce cursor-pointer"
                    >
                        <span className="font-medium text-lg">Start Cooking</span>
                        <ChevronDown className="w-8 h-8 group-hover:translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4">
                {/* Search Section */}
                <div
                    ref={searchSectionRef}
                    className="scroll-mt-20 min-h-[calc(100vh-80px)] flex flex-col pt-16 pb-10"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-sans text-gray-900 mb-3 pt-2">
                            What Ingredients Do You Have?
                        </h2>
                        <p className="text-base text-gray-600 font-medium">Discover delicious recipes tailored to what's in your kitchen</p>
                    </div>

                    <SearchBar onAddIngredient={handleAddIngredient} />
                    <TagList
                        ingredients={ingredients}
                        onRemove={handleRemoveIngredient}
                        onClearAll={handleClearAll}
                    />

                    {ingredients.length > 0 && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSearching ? 'Searching...' : 'Find Recipes'}
                            </button>
                        </div>
                    )}

                    <div className="mt-4 mb-4">
                        <FiltersPanel filters={filters} onFilterChange={setFilters} />
                    </div>

                    {hasSearched && (
                        <div>
                            {searchParams.get('cuisine') && (
                                <div className="mb-4 text-center">
                                    <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
                                        Showing results for: <strong>{searchParams.get('cuisine')}</strong> cuisine
                                        <button
                                            onClick={handleClearAll}
                                            className="ml-2 text-orange-600 hover:text-orange-900 font-bold"
                                        >✕</button>
                                    </span>
                                </div>
                            )}

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

                    {!hasSearched && ingredients.length === 0 && (
                        <div className="text-center py-0 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                                <div className="aspect-square p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                        <ChefHat className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h4 className="font-sans font-bold text-base text-gray-800 mb-2">Smart Search</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed px-1">
                                        Enter what you have, show what you can make. No food waste!
                                    </p>
                                </div>
                                <div className="aspect-square p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                        <Filter className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h4 className="font-sans font-bold text-base text-gray-800 mb-2">Dietary Friendly</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed px-1">
                                        Vegetarian, Vegan, or Gluten-free? We cover every lifestyle.
                                    </p>
                                </div>
                                <div className="aspect-square p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                        <PlusCircle className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h4 className="font-sans font-bold text-base text-gray-800 mb-2">Community</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed px-1">
                                        Discover and share secret recipes with other home cooks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* About Section */}
            <div id="about" className="scroll-mt-20 flex flex-col bg-white pt-0 pb-12">
                <AboutSection />
            </div>

            {/* Contact Section */}
            <div id="contact" className="scroll-mt-20 min-h-[calc(100vh-80px)] flex flex-col justify-center bg-white py-12">
                <ContactSection />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};