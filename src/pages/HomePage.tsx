import React, { useState, useEffect, useRef } from 'react';
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
import { ChefHat, LogOut, User, ShoppingBag, PlusCircle, Filter, ChevronDown } from 'lucide-react';
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

    // Ref to scroll down to the search section
    const searchSectionRef = useRef<HTMLDivElement>(null);

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

    // Function to handle smooth scrolling to the search section
    const scrollToSearch = () => {
        searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 md:py-6">
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
                                {/* Share Recipe Button */}
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
                                    <Link
                                        to="/shopping-list"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Shopping List
                                    </Link>
                                    <span className="text-sm text-gray-600 hidden md:inline">Hello, <strong>{user.name}</strong></span>
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

            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <img 
                    src="https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Fresh Ingredients" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 pb-16">
                    <span className="bg-[#FFB800] text-gray-900 px-6 py-2 rounded-full font-bold mb-6 text-sm md:text-base uppercase tracking-wide">
                        Smart Kitchen Companion
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight max-w-4xl">
                        Turn Your Ingredients Into Delicious Meals
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-12 leading-relaxed">
                        Don't know what to cook? Simply tell us what ingredients you have in your fridge, and we'll find the perfect recipe for you.
                    </p>
                    
                    <button 
                        onClick={scrollToSearch}
                        className="group flex flex-col items-center gap-2 text-white hover:text-orange-300 transition-colors animate-bounce cursor-pointer"
                    >
                        <span className="font-medium text-lg">Start Cooking</span>
                        <ChevronDown className="w-8 h-8 group-hover:translate-y-1 transition-transform" />
                    </button>
                </div>

                {/* Wave Divider SVG */}
                <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
                    <svg 
                        data-name="Layer 1" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 1200 120" 
                        preserveAspectRatio="none" 
                        className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
                    >
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" opacity=".25"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#ffffff" opacity=".5"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                
                {/* Search Section - Ref attached here */}
                {/* Đã thêm class 'font-sans' vào h2 để ép dùng font không chân */}
                <div ref={searchSectionRef} className="mb-12 scroll-mt-32">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold font-sans text-gray-900 mb-4 pt-4">
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

                {/* Filters Panel - Always visible */}
                <div className="mb-8">
                    <FiltersPanel filters={filters} onFilterChange={setFilters} />
                </div>

                {/* Search Results */}
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

                {/* Welcome message for new users (Empty state) */}
                {!hasSearched && ingredients.length === 0 && (
                    <div className="text-center py-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChefHat className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-sans font-bold text-gray-800 mb-2">Smart Ingredient Search</h4>
                                <p className="text-sm text-gray-600">
                                    Enter what you have, and we'll show you what you can make. No more food waste!
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-sans font-bold text-gray-800 mb-2">Dietary Friendly</h4>
                                <p className="text-sm text-gray-600">
                                    Vegetarian, Vegan, Gluten-free? We have recipes for every lifestyle.
                                </p>
                            </div>
                            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PlusCircle className="w-6 h-6 text-orange-500" />
                                </div>
                                <h4 className="font-sans font-bold text-gray-800 mb-2">Community Driven</h4>
                                <p className="text-sm text-gray-600">
                                    Discover secret recipes shared by home cooks just like you.
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