// File: src/api/client.ts
// API Client for Mystère Meal Backend

// 1. IMPORT THE MOCK CALCULATION FUNCTION
import { calculateRecipeNutrition as calculateMockNutrition } from '../utils/nutritionUtils';

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'https://myst-re-meal-1.onrender.com/api';
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, '');

// 2. DEFINE THE MISSING TYPE INTERFACE
export interface IngredientNutritionPayload {
    name: string;
    quantity: number;
    unit: string;
}

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
    const user = localStorage.getItem('mystere-meal-user');
    if (user) {
        try {
            const parsed = JSON.parse(user);
            return parsed.token || null;
        } catch {
            return null;
        }
    }
    return null;
};

// Generic API request handler
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
        mode: 'cors', // Enable CORS mode
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && (error as TypeError).message.includes('fetch')) {
            throw new Error('Cannot connect to server. Please make sure the backend is running.');
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error occurred');
    }
}

// Auth API
export const authAPI = {
    signup: async (data: { name: string; email: string; password: string }) => {
        return apiRequest('/users/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async (data: { email: string; password: string }) => {
        return apiRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// Recipe API
export const recipeAPI = {
    search: async (params: any) => {
        const queryParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                if (Array.isArray(params[key])) {
                    if (params[key].length > 0) queryParams.append(key, params[key].join(','));
                } else {
                    queryParams.append(key, params[key].toString());
                }
            }
        }
        return apiRequest(`/recipes/search?${queryParams.toString()}`);
    },

    getById: async (id: string) => {
        return apiRequest(`/recipes/${id}`);
    },

    addComment: async (recipeId: string, data: { text: string; rating: number }) => {
        return apiRequest(`/recipes/${recipeId}/comments`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    create: async (data: any) => {
        return apiRequest('/recipes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const ingredientNutritionAPI = {
    calculateRecipeNutrition: async (
        ingredients: IngredientNutritionPayload[]
    ) => {
        // Log the payload to verify data being sent
        console.log("Calling Real API with data:", ingredients);

        // Direct API call without try/catch block
        // This ensures any network or server error is thrown directly
        const result = await apiRequest('/ingredients/nutrition/calculate-recipe', {
            method: 'POST',
            body: JSON.stringify({ ingredients }),
        });

        console.log("Real API Result:", result);
        return result;
    },
};

// User API 
export const userAPI = {
    getProfile: async (userId: string) => {
        return apiRequest(`/users/${userId}`);
    },

    addFavorite: async (userId: string, recipeId: string) => {
        return apiRequest(`/users/${userId}/favorites`, {
            method: 'POST',
            body: JSON.stringify({ recipeId }),
        });
    },

    removeFavorite: async (userId: string, recipeId: string) => {
        return apiRequest(`/users/${userId}/favorites/${recipeId}`, {
            method: 'DELETE',
        });
    },

    getFavorites: async (userId: string) => {
        return apiRequest(`/users/${userId}/favorites`);
    },

    getCreatedRecipes: async (userId: string) => {
        return apiRequest(`/users/${userId}/recipes`);
    },
};

// Admin API 
export const adminAPI = {
    getRecipes: async (status?: string) => {
        const query = status && status !== 'all' ? `?status=${status}` : '';
        return apiRequest(`/admin/recipes${query}`);
    },
    getUsers: async () => apiRequest('/admin/users'),
    approveRecipe: async (id: string) => apiRequest(`/admin/recipes/${id}/approve`, { method: 'POST' }),
    rejectRecipe: async (id: string) => apiRequest(`/admin/recipes/${id}/reject`, { method: 'POST' }),
    deleteRecipe: async (id: string) => apiRequest(`/admin/recipes/${id}`, { method: 'DELETE' }),
    lockUser: async (id: string) => apiRequest(`/admin/users/${id}/lock`, { method: 'POST' }),
    unlockUser: async (id: string) => apiRequest(`/admin/users/${id}/unlock`, { method: 'POST' }),
};

// Shopping List API 
export const shoppingListAPI = {
    getList: async () => {
        return apiRequest('/shopping-list');
    },

    addItem: async (data: { name: string; quantity: number; unit: string; recipeId?: string }) => {
        return apiRequest('/shopping-list/items', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    toggleItem: async (itemId: string) => {
        return apiRequest(`/shopping-list/items/${itemId}/toggle`, {
            method: 'PATCH',
        });
    },

    deleteItem: async (itemId: string) => {
        return apiRequest(`/shopping-list/items/${itemId}`, {
            method: 'DELETE',
        });
    },

    clearCompleted: async () => {
        return apiRequest('/shopping-list/clear-completed', {
            method: 'DELETE',
        });
    },

    addMissingIngredients: async (recipeId: string) => {
        return apiRequest('/shopping-list/add-from-recipe', {
            method: 'POST',
            body: JSON.stringify({ recipeId }),
        });
    },
};

export { API_BASE_URL };