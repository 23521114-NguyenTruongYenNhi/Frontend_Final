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
import { recipeAPI, userAPI } from '../api/client';
import { ChefHat, LogOut, User, Info, Mail, PlusCircle, Filter } from 'lucide-react';
import { Logo } from '../components/Logo';

const STORAGE_KEY = 'mystere-meal-ingredients';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // State definitions
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [filters, setFilters] = useState<RecipeFilters>({});
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    // Store IDs of recipes the user has liked
    const [likedRecipeIds, setLikedRecipeIds] = useState<Set<string>>(new Set());

    // UI States
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    // Load ingredients from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setIngredients(parsed);
            } catch (error) {
                console.error('Failed to parse stored ingredients:', error);
            }
        }
    }, []);

    // Fetch User Favorites to update Heart Icons
    useEffect(() => {
        if (user) {
            const fetchFavorites = async () => {
                try {
                    const userId = user._id || user.id;
                    const favs: any = await userAPI.getFavorites(userId);

                    if (Array.isArray(favs)) {
                        const ids = new Set(favs.map((r: any) => r._id));
                        setLikedRecipeIds(ids);
                    }
                } catch (error) {
                    console.error("Failed to load favorites", error);
                }
            };
            fetchFavorites();
        } else {
            setLikedRecipeIds(new Set());
        }
    }, [user]);

    // Fetch initial recipes (Discovery Mode)
    useEffect(() => {
        const fetchInitialRecipes = async () => {
            if (!hasSearched && ingredients.length === 0) {
                try {
                    const data: any = await recipeAPI.getAll();
                    setRecipes(data);
                } catch (error) {
                    console.error("Failed to load initial recipes:", error);
                } finally {
                    setIsLoadingInitial(false);
                }
            } else {
                setIsLoadingInitial(false);
            }
        };
        fetchInitialRecipes();
    }, [hasSearched, ingredients.length]);

    // Save ingredients to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    }, [ingredients]);

    // Auto-search trigger
    useEffect(() => {
        if (hasSearched) handleSearch();
    }, [filters]);

    // Handlers
    const handleAddIngredient = (ingredient: string) => {
        if (!ingredients.includes(ingredient)) setIngredients([...ingredients, ingredient]);
    };

    const handleRemoveIngredient = (ingredient: string) => {
        setIngredients(ingredients.filter(ing => ing !== ingredient));
    };

    const handleClearAll = () => {
        setIngredients([]);
        setFilters({});
        setHasSearched(false);
        setIsLoadingInitial(true);
        recipeAPI.getAll()
            .then((data: any) => setRecipes(data))
            .catch(err => console.error(err))
            .finally(() => setIsLoadingInitial(false));
    };

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);
        try {
            const data: any = await recipeAPI.search({
                ingredients,
                ...filters
            });
            setRecipes(data);
        } catch (error) {
            console.error('Search failed:', error);
            alert("Failed to connect to the server.");
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
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link to="/">
                            <Logo />
                        </Link>
                        <div className="flex items-center gap-6">
                            <nav className="hidden md:flex items-center gap-4">
                                <a href="#about" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium">
                                    <Info className="w-4 h-4" /> About Us
                                </a>
                                <a href="#contact" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium">
                                    <Mail className="w-4 h-4" /> Contact
                                </a>
                                <Link to="/add-recipe" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium">
                                    <PlusCircle className="w-4 h-4" /> Share Recipe
                                </Link>
                            </nav>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    {/* ADMIN LINK - UPDATED TEXT */}
                                    {user.isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-black text-sm font-medium font-rounded"
                                        >
                                            Admin
                                        </Link>
                                    )}

                                    <span className="text-sm text-gray-600 hidden md:inline">
                                        Hello, <strong>{user.name}</strong>
                                    </span>

                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-orange-600 font-medium transition-colors rounded-lg hover:bg-orange-50"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-700 font-medium transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-rounded font-bold text-gray-900 mb-4">
                            What ingredients do you have?
                        </h2>
                        <p className="text-lg text-gray-600 font-medium">Discover delicious recipes tailored to what's in your kitchen</p>
                    </div>

                    <SearchBar onAddIngredient={handleAddIngredient} />
                    <TagList
                        ingredients={ingredients}
                        onRemove={handleRemoveIngredient}
                        onClearAll={handleClearAll}
                    />

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

                <div className="mb-8">
                    <FiltersPanel filters={filters} onFilterChange={setFilters} />
                </div>

                {/* Results Section */}
                {(hasSearched || recipes.length > 0) ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 font-rounded">
                                {isSearching || isLoadingInitial
                                    ? 'Loading recipes...'
                                    : hasSearched
                                        ? `Found ${recipes.length} result${recipes.length !== 1 ? 's' : ''}`
                                        : 'Latest Recipes from Community'}
                            </h2>
                        </div>

                        <ResultsGrid
                            recipes={recipes}
                            onRecipeClick={handleRecipeClick}
                            isSearching={isSearching || isLoadingInitial}
                            likedIds={likedRecipeIds}
                        />
                    </div>
                ) : (
                    !isLoadingInitial && (
                        <div className="text-center py-20">
                            <ChefHat className="w-20 h-20 text-orange-300 mx-auto mb-6" />
                            <h3 className="text-3xl font-rounded font-bold text-gray-800 mb-4">Welcome to Mystère Meal!</h3>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                Your culinary journey starts here. Add your ingredients or browse our collection!
                            </p>

                            {/* Feature Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="p-6 bg-white rounded-xl shadow-md">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ChefHat className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h4 className="font-rounded font-bold text-gray-800 mb-2">Smart ingredient search</h4>
                                    <p className="text-sm text-gray-600">Instantly match your ingredients with perfect recipes</p>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-md">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Filter className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h4 className="font-rounded font-bold text-gray-800 mb-2">Advanced filters</h4>
                                    <p className="text-sm text-gray-600">Refine your search by cuisine, cooking time, and dietary preferences</p>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-md">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <PlusCircle className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h4 className="font-rounded font-bold text-gray-800 mb-2">Share your recipes</h4>
                                    <p className="text-sm text-gray-600">Join our culinary community and share your signature dishes</p>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </main>

            <AboutSection />
            <ContactSection />
            <Footer />
        </div>
    );
};