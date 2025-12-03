// API Client for Mystère Meal Backend
// Centralized API configuration and request handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        // Enhanced error handling
        if (error instanceof TypeError && error.message.includes('fetch')) {
            // Network error - backend likely not running
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
    search: async (params: {
        ingredients?: string[];
        cuisine?: string;
        mealType?: string;
        difficulty?: string;
        maxTime?: number;
        minRating?: number;
        isVegetarian?: boolean;
        isVegan?: boolean;
        isGlutenFree?: boolean;
    }) => {
        const queryParams = new URLSearchParams();

        if (params.ingredients && params.ingredients.length > 0) {
            queryParams.append('ingredients', params.ingredients.join(','));
        }
        if (params.cuisine) queryParams.append('cuisine', params.cuisine);
        if (params.mealType) queryParams.append('mealType', params.mealType);
        if (params.difficulty) queryParams.append('difficulty', params.difficulty);
        if (params.maxTime) queryParams.append('maxTime', params.maxTime.toString());
        if (params.minRating) queryParams.append('minRating', params.minRating.toString());
        if (params.isVegetarian) queryParams.append('isVegetarian', 'true');
        if (params.isVegan) queryParams.append('isVegan', 'true');
        if (params.isGlutenFree) queryParams.append('isGlutenFree', 'true');

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
    getRecipes: async (status?: 'pending' | 'approved' | 'rejected') => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/admin/recipes${query}`);
    },

    approveRecipe: async (recipeId: string) => {
        return apiRequest(`/admin/recipes/${recipeId}/approve`, {
            method: 'POST',
        });
    },

    rejectRecipe: async (recipeId: string) => {
        return apiRequest(`/admin/recipes/${recipeId}/reject`, {
            method: 'POST',
        });
    },

    deleteRecipe: async (recipeId: string) => {
        return apiRequest(`/admin/recipes/${recipeId}`, {
            method: 'DELETE',
        });
    },

    getUsers: async () => {
        return apiRequest('/admin/users');
    },

    lockUser: async (userId: string) => {
        return apiRequest(`/admin/users/${userId}/lock`, {
            method: 'POST',
        });
    },

    unlockUser: async (userId: string) => {
        return apiRequest(`/admin/users/${userId}/unlock`, {
            method: 'POST',
        });
    },
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
