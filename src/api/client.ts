// File: src/api/client.ts
import axiosClient from './axiosClient';

// Helper for generic requests if needed, but we mainly use axiosClient
// The base URL is now dynamically determined by the environment variable
// VITE_API_URL (used in production/deployment) or defaults to local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Auth API ---
export const authAPI = {
    login: async (credentials: any) => {
        const response = await axiosClient.post('/users/login', credentials);
        return response.data;
    },
    signup: async (userData: any) => {
        const response = await axiosClient.post('/users/signup', userData);
        return response.data;
    }
};

// --- Recipe API ---
export const recipeAPI = {
    // 1. Get All Recipes (Discovery Feed)
    getAll: async () => {
        const response = await axiosClient.get('/recipes');
        return response.data;
    },

    // 2. Search Recipes
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

        // Backend expects comma-separated string for ingredients
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

        const response = await axiosClient.get(`/recipes/search?${queryParams.toString()}`);
        return response.data;
    },

    // 3. Get Single Recipe by ID
    getById: async (id: string) => {
        const response = await axiosClient.get(`/recipes/${id}`);
        return response.data;
    },

    // 4. Create New Recipe
    create: async (data: any) => {
        const response = await axiosClient.post('/recipes', data);
        return response.data;
    },

    // 5. Add Comment
    addComment: async (recipeId: string, data: { text: string; rating: number }) => {
        const response = await axiosClient.post(`/recipes/${recipeId}/comments`, data);
        return response.data;
    }
};

// --- User API ---
export const userAPI = {
    getProfile: async (userId: string) => {
        const response = await axiosClient.get(`/users/${userId}`);
        return response.data;
    },

    getFavorites: async (userId: string) => {
        const response = await axiosClient.get(`/users/${userId}/favorites`);
        return response.data;
    },

    // --- FIX: Added missing method to fetch recipes created by the user ---
    getCreatedRecipes: async (userId: string) => {
        const response = await axiosClient.get(`/users/${userId}/recipes`);
        return response.data;
    },
    // ---------------------------------------------------------------------

    addFavorite: async (userId: string, recipeId: string) => {
        const response = await axiosClient.post(`/users/${userId}/favorites`, { recipeId });
        return response.data;
    },

    removeFavorite: async (userId: string, recipeId: string) => {
        const response = await axiosClient.delete(`/users/${userId}/favorites/${recipeId}`);
        return response.data;
    }
};

// --- Admin API ---
export const adminAPI = {
    getRecipes: async (status?: string) => {
        const params = status ? { status } : {};
        const response = await axiosClient.get('/admin/recipes', { params });
        return response.data;
    },
    getUsers: async () => {
        const response = await axiosClient.get('/admin/users');
        return response.data;
    },
    approveRecipe: async (id: string) => {
        const response = await axiosClient.post(`/admin/recipes/${id}/approve`);
        return response.data;
    },
    rejectRecipe: async (id: string) => {
        const response = await axiosClient.post(`/admin/recipes/${id}/reject`);
        return response.data;
    },
    deleteRecipe: async (id: string) => {
        const response = await axiosClient.delete(`/admin/recipes/${id}`);
        return response.data;
    },
    lockUser: async (id: string) => {
        const response = await axiosClient.post(`/admin/users/${id}/lock`);
        return response.data;
    },
    unlockUser: async (id: string) => {
        const response = await axiosClient.post(`/admin/users/${id}/unlock`);
        return response.data;
    }
};

export { API_BASE_URL };