import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { User, Lock, Mail, AlertTriangle, Loader, ArrowRight, ChevronLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, signup, isLoading: isAuthLoading } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                navigate('/');
            } else {
                if (!formData.name.trim()) {
                    setError('Please enter your name');
                    setIsLoading(false);
                    return;
                }
                await signup(formData.name, formData.email, formData.password);
                setIsLogin(true);
                setError("Account created! Please login now.");
                setFormData({ ...formData, name: '', password: '' });
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <Loader className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
    );

    return (
        <div className="h-screen flex bg-white overflow-hidden">

            {/* --- LEFT SIDE: THEME CAM NHẠT (LIGHT ORANGE) --- */}
            <div className="hidden lg:flex lg:w-1/2 relative shrink-0 h-full bg-orange-100">

                {/* 1. Hình nền Food */}
                <img
                    src="https://images.unsplash.com/photo-1592417817038-d13fd7342605?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Delicious Food"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* 2. GRADIENT CAM NHẠT (Light Orange Overlay)
                   - from-orange-200/95: Màu cam nhạt, độ chắn sáng 95% (Rất rõ để đỡ chữ).
                   - via-orange-100/70: Chuyển dần sang cam nhạt hơn.
                   - to-transparent: Trong suốt để lộ hình món ăn bên phải.
                */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/95 via-orange-30/10 to-transparent z-10" />

                {/* Content */}
                <div className="relative z-20 flex flex-col justify-between h-full p-16">
                    {/* Logo */}
                    <Link to="/" className="w-fit hover:opacity-20 transition-opacity transform scale-150 origin-left mb-4">
                        <Logo />
                    </Link>

                    <div className="space-y-6">
                        {/* Tiêu đề: Màu Cam Đậm (orange-950) - Tương phản cực cao */}
                        <h1 className="text-5xl font-extrabold leading-tight text-orange-950">
                            Master the Art of <br />
                            <span className="text-orange-600">Home Cooking</span>
                        </h1>

                        {/* Đoạn văn: Màu Đen Nhạt (gray-900) - Đậm hơn lúc nãy để không bị lu mờ */}
                        <p className="text-lg text-white max-w-md leading-relaxed font-semibold">
                            Join our community of food lovers. Discover recipes, organize your pantry, and create magic in your kitchen.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-800 font-bold">
                        <span>© 2024 Mystère Meal Inc.</span>
                        <div className="h-1 w-1 bg-orange-600 rounded-full" />
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: FORM (Giữ nguyên) --- */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white">
                <div className="min-h-full flex flex-col justify-center items-center p-8 lg:p-16">
                    <div className="w-full max-w-md space-y-8">

                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8 flex justify-center text-4xl">
                            <Link to="/">
                                <Logo />
                            </Link>
                        </div>

                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {isLogin ? 'Welcome Back' : 'Create an Account'}
                            </h2>
                            <p className="text-gray-500">
                                {isLogin ? 'Enter your credentials to access your account.' : 'Join us today and start your culinary journey.'}
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <div className="p-1 bg-gray-100 rounded-xl flex">
                            <button
                                onClick={() => { setIsLogin(true); setError(''); }}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setError(''); }}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm font-medium">{error}</div>
                                </div>
                            )}

                            {/* Full Name Animation */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="space-y-1.5 pb-5">
                                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                    <div className="relative group">
                                        <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                <div className="relative group">
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative group">
                                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={`flex justify-end transition-all duration-300 ease-in-out overflow-hidden ${isLogin ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <button type="button" className="text-sm font-medium text-orange-600 hover:text-orange-700 pb-2">
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-8">
                            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors group">
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;