import React from 'react';
import { ChefHat, Users, Heart, Star } from 'lucide-react';

export const AboutSection: React.FC = () => {
    return (
        // FIX: Giảm padding py-16 xuống py-12 cho gọn hơn
        <section id="about" className="py-12 bg-white w-full">
            <div className="container mx-auto px-4">
                {/* Header Section - Giảm kích thước chữ tiêu đề */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Mystère Meal</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-base leading-relaxed">
                        We're on a mission to make cooking easier and more enjoyable for everyone.
                        Discover recipes based on what you already have in your kitchen!
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature 1 - Giảm padding p-8 -> p-6 */}
                    <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-orange-100">
                        {/* Giảm kích thước vòng tròn w-20 -> w-16 và icon w-10 -> w-8 */}
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ChefHat className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Search</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Enter the ingredients you have, and we'll find perfect recipes that match.
                            No more wondering what to cook!
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-orange-100">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Community Driven</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Share your favorite recipes and discover amazing dishes from food lovers
                            around the world.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-orange-100">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Save Favorites</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Build your personal cookbook by saving recipes you love. Access them
                            anytime, anywhere.
                        </p>
                    </div>
                </div>

                {/* Stats Section - Giảm kích thước số liệu */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">10k+</div>
                        <div className="text-base text-gray-600 font-medium">Recipes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">50k+</div>
                        <div className="text-base text-gray-600 font-medium">Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">100k+</div>
                        <div className="text-base text-gray-600 font-medium">Reviews</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-orange-500 mb-2">
                            4.8 <Star className="w-8 h-8 fill-orange-500" />
                        </div>
                        <div className="text-base text-gray-600 font-medium">Average Rating</div>
                    </div>
                </div>
            </div>
        </section>
    );
};