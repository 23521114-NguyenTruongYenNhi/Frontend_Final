// File: src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/client';

// 1. Define the User Interface (CRITICAL: Must match backend response)
interface User {
    _id: string; // MongoDB ID
    name: string;
    email: string;
    token: string;
    isAdmin?: boolean; // Admin privilege flag
}

// 2. Define the Context Interface
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// 3. Create the Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Effect: Load persistent user data from LocalStorage on mount (for persistence)
    useEffect(() => {
        const storedUser = localStorage.getItem('mystere-meal-user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.token) {
                    setUser(parsedUser);
                }
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                localStorage.removeItem('mystere-meal-user');
            }
        }
        setIsLoading(false);
    }, []);

    // Login Function (Authenticates and sets session)
    const login = async (email: string, password: string) => {
        try {
            const data: any = await authAPI.login({ email, password });

            const userData: User = {
                _id: data._id || data.id,
                name: data.name,
                email: data.email,
                token: data.token,
                isAdmin: data.isAdmin,
            };

            if (!userData._id) throw new Error("Authentication failed: Missing User ID.");

            // Update state and persist
            setUser(userData);
            localStorage.setItem('mystere-meal-user', JSON.stringify(userData));

        } catch (error: any) {
            console.error('Login failed:', error);
            // Provide more user-friendly error messages based on API response
            if (error.response?.status === 401) {
                throw new Error("Invalid email or password.");
            }
            // Re-throw generic error
            throw new Error(error.message || "Login failed.Please try again!");
        }
    };

    // Signup Function (Registers a new user)
    const signup = async (name: string, email: string, password: string) => {
        try {
            // Call Signup API. If successful, it creates the user on the backend.
            await authAPI.signup({ name, email, password });

            // CRITICAL CHANGE: 
            // The logic to automatically set the user state and persist the token 
            // (setUser() and localStorage.setItem()) has been REMOVED here.
            // This ensures the user is NOT logged in immediately after signing up.
            // The calling component (LoginPage.tsx) will now handle redirecting 
            // the user to the login form after a successful call.

        } catch (error: any) {
            console.error('Signup failed:', error);
            // Re-throw the error with a friendly message
            throw new Error(error.response?.data?.message || 'Signup failed.');
        }
    };

    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};