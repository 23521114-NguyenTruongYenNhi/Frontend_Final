// File: src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recipe } from '../types/recipe';
import { RecipeCard } from '../components/RecipeCard';
import { userAPI } from '../api/client';
import {
    ChefHat, Heart, BookOpen, LogOut, Edit, Loader,
    MapPin, Calendar, Camera, Settings
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // State Management
    const [activeTab, setActiveTab] = useState<'favorites' | 'created'>('favorites');
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadUserRecipes = async () => {
            setLoading(true);
            try {
                const userId = user._id || (user as any).id;
                if (!userId) return;

                const [favorites, created] = await Promise.all([
                    userAPI.getFavorites(userId),
                    userAPI.getCreatedRecipes(userId)
                ]);

                setFavoriteRecipes(Array.isArray(favorites) ? favorites : []);
                setCreatedRecipes(Array.isArray(created) ? created : []);

            } catch (error: any) {
                console.error('Failed to load user recipes:', error);
                if (error.response?.status === 401) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        loadUserRecipes();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleRecipeClick = (recipeId: string) => {
        navigate(`/recipe/${recipeId}`);
    };

    if (!user) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-orange-50/50">
                <Loader className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* --- Header --- */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <ChefHat className="w-6 h-6 text-orange-600" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Mystère Meal</h1>
                        </Link>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4">
                {/* --- Profile Section --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-8 relative">

                    {/* 1. Cover Photo */}
                    <div className="h-48 md:h-64 bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        {/* Edit Cover Button (Visual Only) */}
                        <button className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-6 gap-6">

                            {/* 2. Avatar with Border */}
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-1.5 rounded-full shadow-xl">
                                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                                        <span className="text-5xl font-extrabold text-orange-500 select-none">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                {/* Status Indicator */}
                                <div className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 mt-2 md:mt-0">
                                <h2 className="text-3xl font-bold text-gray-800 mb-1">{user.name}</h2>
                                <p className="text-gray-500 font-medium mb-3">{user.email}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>Vietnam</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>Joined 2025</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <button className="flex-1 md:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200 transition-all font-medium">
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                                <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-6"></div>

                        {/* 3. Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50 text-center">
                                <span className="block text-2xl font-bold text-orange-600">{favoriteRecipes.length}</span>
                                <span className="text-sm text-gray-600 font-medium">Favorites</span>
                            </div>
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-center">
                                <span className="block text-2xl font-bold text-blue-600">{createdRecipes.length}</span>
                                <span className="text-sm text-gray-600 font-medium">Created</span>
                            </div>
                            {/* Placeholder stats to fill space */}
                            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50 text-center">
                                <span className="block text-2xl font-bold text-purple-600">128</span>
                                <span className="text-sm text-gray-600 font-medium">Following</span>
                            </div>
                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50 text-center">
                                <span className="block text-2xl font-bold text-green-600">4.8</span>
                                <span className="text-sm text-gray-600 font-medium">Rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Tabs Navigation (Modern Pill Style) --- */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 inline-flex">
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'favorites'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
                            Favorites
                        </button>
                        <button
                            onClick={() => setActiveTab('created')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'created'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            My Recipes
                        </button>
                    </div>
                </div>

                {/* --- Content Area --- */}
                <div className="animate-fade-in-up">
                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div>
                            {favoriteRecipes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols