import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ChevronLeft, AlertTriangle, Loader } from 'lucide-react';// Note: AuthContext.tsx must be updated to remove auto-login logic from 'signup'

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, signup, isLoading: isAuthLoading } = useAuth();

    // State to toggle between Login and Sign Up forms
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Local loading state

    // Handler for all form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                // --- 1. LOGIN FLOW ---
                await login(formData.email, formData.password);
                // On successful login, navigate to the home page.
                navigate('/');

            } else {
                // --- 2. SIGN UP FLOW ---
                if (!formData.name.trim()) {
                    setError('Please enter your name');
                    setIsLoading(false);
                    return;
                }

                // Call signup (which no longer auto-logs in, thanks to the fix in AuthContext)
                await signup(formData.name, formData.email, formData.password);

                // On successful signup, switch to the Login view and display message.
                setIsLogin(true);
                setError("Account created successfully. Please login.");
                setFormData({ ...formData, name: '', password: '' }); // Clear form/password
            }

        } catch (err: any) {
            // Display user-friendly error message from AuthContext (e.g., "Invalid email or password")
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // If AuthContext is still loading initial user session, show loading spinner
    if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center">Loading authentication...</div>;


    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
                    <p className="text-sm text-gray-600">
                        {isLogin ? 'Sign in to discover recipes.' : 'Fill in your details to get started.'}
                    </p>
                </div>

                <div className="flex mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 text-lg font-bold transition-colors ${isLogin ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 text-lg font-bold transition-colors ${!isLogin ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* --- Form --- */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Name Field (Only visible for Sign Up) */}
                    {!isLogin && (
                        <div>
                            <label className="sr-only">Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Full Name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-colors"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="sr-only">Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="sr-only">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-orange-500 text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;