// File: src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    XCircle,
    Trash2,
    Lock,
    Unlock,
    User,
    ChefHat,
    AlertCircle,
    Clock,
    Loader,
    Search
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { adminAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Interfaces matching your Backend Data
interface Recipe {
    _id: string;
    title: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    image?: string;
    cuisine: string;
    difficulty: string;
    time: number;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface UserAccount {
    id: string;
    _id?: string;
    name: string;
    email: string;
    recipesCount: number;
    joinedAt: string;
    isLocked: boolean;
    isAdmin: boolean;
}

export const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Data States
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [users, setUsers] = useState<UserAccount[]>([]);

    // UI States
    const [activeTab, setActiveTab] = useState<'recipes' | 'users'>('recipes');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    // --- 1. DATA FETCHING (GET Requests) ---
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch Recipes (GET /admin/recipes)
            const recipesData = await adminAPI.getRecipes();
            setRecipes(recipesData);

            // Fetch Users (GET /admin/users)
            const usersData = await adminAPI.getUsers();
            setUsers(usersData);

        } catch (err: any) {
            console.error('Error loading admin data:', err);
            setError('Failed to load data. Ensure you have Admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadData();
    }, [user, navigate]);

    // --- 2. RECIPE ACTIONS (POST/DELETE Requests) ---

    // Approve Recipe (POST /admin/recipes/:id/approve)
    const handleApprove = async (id: string) => {
        try {
            await adminAPI.approveRecipe(id);
            // Update local state to reflect change immediately
            setRecipes(prev => prev.map(r => r._id === id ? { ...r, status: 'approved' } : r));
        } catch (err: any) {
            alert('Failed to approve: ' + err.message);
        }
    };

    // Reject Recipe (POST /admin/recipes/:id/reject)
    const handleReject = async (id: string) => {
        try {
            await adminAPI.rejectRecipe(id);
            setRecipes(prev => prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
        } catch (err: any) {
            alert('Failed to reject: ' + err.message);
        }
    };

    // Delete Recipe (DELETE /admin/recipes/:id)
    // This matches the red DELETE button in your Swagger
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await adminAPI.deleteRecipe(id);
            setRecipes(prev => prev.filter(r => r._id !== id));
        } catch (err: any) {
            alert('Failed to delete: ' + err.message);
        }
    };

    // --- 3. USER ACTIONS (POST Requests) ---

    // Lock/Unlock User (POST /admin/users/:id/lock | unlock)
    const toggleUserLock = async (userId: string, isLocked: boolean) => {
        try {
            if (isLocked) {
                await adminAPI.unlockUser(userId);
            } else {
                await adminAPI.lockUser(userId);
            }
            // Update local state
            setUsers(prev => prev.map(u =>
                (u.id === userId || u._id === userId) ? { ...u, isLocked: !isLocked } : u
            ));
        } catch (err: any) {
            alert('Failed to update user status: ' + err.message);
        }
    };

    // --- 4. FILTERING LOGIC ---
    const filteredRecipes = recipes.filter(r => {
        if (filterStatus === 'all') return true;
        return r.status === filterStatus;
    });

    const pendingCount = recipes.filter(r => r.status === 'pending').length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Top Navigation Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/"><Logo /></Link>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <span className="font-rounded font-bold text-gray-700 text-lg">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Logged in as <strong className="text-gray-800">{user?.name}</strong></span>
                        <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Refresh Data">
                            <Loader className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-center gap-3">
                        <AlertCircle className="w-6 h-6" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Pending Review</p>
                            <p className="text-3xl font-bold text-orange-500 mt-1">{pendingCount}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full"><Clock className="w-6 h-6 text-orange-500" /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Total Recipes</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{recipes.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full"><ChefHat className="w-6 h-6 text-blue-500" /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Total Users</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{users.length}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full"><User className="w-6 h-6 text-green-500" /></div>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
                    <div className="flex border-b border-gray-200 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`px-8 py-4 font-medium text-sm transition-all ${activeTab === 'recipes' ? 'bg-white text-orange-600 border-t-2 border-t-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Recipe Management
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-8 py-4 font-medium text-sm transition-all ${activeTab === 'users' ? 'bg-white text-orange-600 border-t-2 border-t-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            User Management
                        </button>
                    </div>

                    <div className="p-6">
                        {/* RECIPES TAB */}
                        {activeTab === 'recipes' && (
                            <div>
                                {/* Filter Bar */}
                                <div className="flex gap-2 mb-6 pb-6 border-b border-gray-100 overflow-x-auto">
                                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status as any)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === status
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>

                                {/* Recipe List */}
                                <div className="space-y-4">
                                    {filteredRecipes.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">No recipes found in this category.</div>
                                    ) : (
                                        filteredRecipes.map((recipe) => (
                                            <div key={recipe._id} className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow group">
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                        {recipe.image ? (
                                                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-400"><ChefHat size={24} /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${recipe.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                    recipe.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                        'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {recipe.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400">{new Date(recipe.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{recipe.title}</h3>
                                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                                            <User size={14} /> {recipe.author?.name || 'Unknown'}
                                                        </p>
                                                        <div className="text-xs text-gray-400 mt-2 flex gap-3">
                                                            <span>{recipe.cuisine}</span> • <span>{recipe.difficulty}</span> • <span>{recipe.time} min</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {recipe.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(recipe._id)}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm font-medium"
                                                            >
                                                                <CheckCircle size={16} /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(recipe._id)}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm font-medium"
                                                            >
                                                                <XCircle size={16} /> Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* DELETE BUTTON - Available for ALL statuses (Matches your Swagger) */}
                                                    <button
                                                        onClick={() => handleDelete(recipe._id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded hover:bg-gray-200 text-sm font-medium mt-2"
                                                        title="Permanently Delete"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* USERS TAB */}
                        {activeTab === 'users' && (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                                                <th className="pb-3 font-medium">User</th>
                                                <th className="pb-3 font-medium">Role</th>
                                                <th className="pb-3 font-medium">Stats</th>
                                                <th className="pb-3 font-medium">Status</th>
                                                <th className="pb-3 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {users.map(u => {
                                                const userId = u.id || u._id || '';
                                                return (
                                                    <tr key={userId} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-4 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${u.isLocked ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                                                                    {u.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{u.name}</p>
                                                                    <p className="text-sm text-gray-500">{u.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">
                                                            {u.isAdmin ? (
                                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">Admin</span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase">User</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-sm text-gray-600">
                                                            <span className="font-bold">{u.recipesCount || 0}</span> recipes
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`flex items-center gap-1 text-sm font-medium ${u.isLocked ? 'text-red-600' : 'text-green-600'}`}>
                                                                {u.isLocked ? <Lock size={14} /> : <CheckCircle size={14} />}
                                                                {u.isLocked ? 'Locked' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            {!u.isAdmin && (
                                                                <button
                                                                    onClick={() => toggleUserLock(userId, u.isLocked)}
                                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${u.isLocked
                                                                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                        }`}
                                                                >
                                                                    {u.isLocked ? 'Unlock' : 'Lock'}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};