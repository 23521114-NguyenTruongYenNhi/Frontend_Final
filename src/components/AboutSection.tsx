import React from 'react';
import { ChefHat, Users, Heart, Star } from 'lucide-react';

export const AboutSection: React.FC = () => {
    return (
        // FIX: Tăng padding py-16 để phần này to hơn, thoáng hơn
        <section id="about" className="py-16 bg-white w-full">
            <div className="container mx-auto px-4">
                {/* Header Section - Tăng kích thước chữ */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About Mystère Meal</h2>
                    <p className="text-gray-600 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
                        We're on a mission to make cooking easier and more enjoyable for everyone.
                        Discover recipes based on what you already have in your kitchen!
                    </p>
                </div>

                {/* Features Grid - Tăng kích thước thẻ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {/* Feature 1 - Tăng padding p-8, icon w-20 */}
                    <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-shadow border border-transparent hover:border-orange-100">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ChefHat className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Search</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Enter the ingredients you have, and we'll find perfect recipes that match.
                            No more wondering what to cook!
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-shadow border border-transparent hover:border-orange-100">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Community Driven</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Share your favorite recipes and discover amazing dishes from food lovers
                            around the world.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-shadow border border-transparent hover:border-orange-100">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Save Favorites</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Build your personal cookbook by saving recipes you love. Access them
                            anytime, anywhere.
                        </p>
                    </div>
                </div>

                {/* Stats Section - Tăng kích thước số liệu */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-orange-500 mb-3">10k+</div>
                        <div className="text-xl text-gray-600 font-medium">Recipes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold text-orange-500 mb-3">50k+</div>
                        <div className="text-xl text-gray-600 font-medium">Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold text-orange-500 mb-3">100k+</div>
                        <div className="text-xl text-gray-600 font-medium">Reviews</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-5xl font-bold text-orange-500 mb-3">
                            4.8 <Star className="w-10 h-10 fill-orange-500" />
                        </div>
                        <div className="text-xl text-gray-600 font-medium">Average Rating</div>
                    </div>
                </div>
            </div>
        </section>
    );
};