// src/api/client.ts
import axiosClient from './axiosClient';

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
    getAll: async () => {
        const response = await axiosClient.get('/recipes');
        return response.data;
    },
    search: async (params: any) => {
        const queryParams = new URLSearchParams();
        if (params.ingredients?.length) queryParams.append('ingredients', params.ingredients.join(','));
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
    getById: async (id: string) => {
        const response = await axiosClient.get(`/recipes/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await axiosClient.post('/recipes', data);
        return response.data;
    },
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
    getCreatedRecipes: async (userId: string) => {
        const response = await axiosClient.get(`/users/${userId}/recipes`);
        return response.data;
    },
    addFavorite: async (userId: string, recipeId: string) => {
        const response = await axiosClient.post(`/users/${userId}/favorites`, { recipeId });
        return response.data;
    },
    removeFavorite: async (userId: string, recipeId: string) => {
        const response = await axiosClient.delete(`/users/${userId}/favorites/${recipeId}`);
        return response.data;
    }
};

export { API_BASE_URL };
