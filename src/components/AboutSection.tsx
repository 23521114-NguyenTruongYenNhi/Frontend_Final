import React from 'react';
import { ChefHat, Users, Heart, Star } from 'lucide-react';

export const AboutSection: React.FC = () => {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">About Mystère Meal</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We're on a mission to make cooking easier and more enjoyable for everyone.
                        Discover recipes based on what you already have in your kitchen!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Feature 1 */}
                    <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ChefHat className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Search</h3>
                        <p className="text-gray-600">
                            Enter the ingredients you have, and we'll find perfect recipes that match.
                            No more wondering what to cook!
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Community Driven</h3>
                        <p className="text-gray-600">
                            Share your favorite recipes and discover amazing dishes from food lovers
                            around the world.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Save Favorites</h3>
                        <p className="text-gray-600">
                            Build your personal cookbook by saving recipes you love. Access them
                            anytime, anywhere.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">10k+</div>
                        <div className="text-gray-600">Recipes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">50k+</div>
                        <div className="text-gray-600">Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">100k+</div>
                        <div className="text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-4xl font-bold text-orange-500 mb-2">
                            4.8 <Star className="w-8 h-8 fill-orange-500" />
                        </div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
