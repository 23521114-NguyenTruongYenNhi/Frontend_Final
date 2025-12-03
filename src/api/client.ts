// File: src/api/client.ts
// API Client for Mystère Meal Backend
// Centralized API configuration and request handling

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'https://mystere-meal.onrender.com/api';
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, ''); 


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

// --- Ingredient Nutrition API (ĐÃ SỬA VỚI LOGIC FAILOVER) ---
export const ingredientNutritionAPI = {
    calculateRecipeNutrition: async (
        ingredients: IngredientNutritionPayload[]
    ) => {
        try {
            // 1. THỬ GỌI API THẬT
            const result = await apiRequest('/ingredients/nutrition/calculate-recipe', {
                method: 'POST',
                body: JSON.stringify({ ingredients }),
            });
            
            // Trả về kết quả từ Backend
            return result; 

        } catch (error) {
            // 2. FALLBACK: Nếu API thật thất bại (lỗi kết nối, 404,...)
            console.warn("[MOCK NUTRITION] Real API failed. Falling back to mock data.", error);
            
            // Cấu trúc dữ liệu mock cần thiết cho hàm calculateMockNutrition
            const mockRecipeObject = { ingredients: ingredients }; 

            // Gọi hàm tính toán mock. 
            // CHÚ Ý: Hàm mock này phải được cấu hình để trả về object: { calories: X, protein: Y, ... }
            const mockResult = calculateMockNutrition(mockRecipeObject); 
            
            // Trả về dữ liệu mock theo cấu trúc mà Frontend (AddRecipePage) mong đợi: { totalNutrition: {...} }
            return {
                totalNutrition: mockResult
            };
        }
    },
};

// User API 
export const userAPI = {
    // ...
};

// Admin API 
// --- Admin API (Khối code hoàn chỉnh) ---
export const adminAPI = {
    // GET /api/admin/recipes
    getRecipes: async (status?: string) => {
        // Xử lý query string cho trạng thái
        const query = status && status !== 'all' ? `?status=${status}` : '';
        return apiRequest(`/admin/recipes${query}`);
    },

    // GET /api/admin/users
    getUsers: async () => apiRequest('/admin/users'),

    // POST /api/admin/recipes/:id/approve
    approveRecipe: async (id: string) => apiRequest(`/admin/recipes/${id}/approve`, { method: 'POST' }),

    // POST /api/admin/recipes/:id/reject
    rejectRecipe: async (id: string) => apiRequest(`/admin/recipes/${id}/reject`, { method: 'POST' }),

    // DELETE /api/admin/recipes/:id
    deleteRecipe: async (id: string) => apiRequest(`/admin/recipes/${id}`, { method: 'DELETE' }),

    // POST /api/admin/users/:id/lock
    lockUser: async (id: string) => apiRequest(`/admin/users/${id}/lock`, { method: 'POST' }),

    // POST /api/admin/users/:id/unlock
    unlockUser: async (id: string) => apiRequest(`/admin/users/${id}/unlock`, { method: 'POST' }),
};
// Shopping List API 
export const shoppingListAPI = {
    // ...
};

export { API_BASE_URL };