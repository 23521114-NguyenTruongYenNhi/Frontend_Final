import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <ChefHat className="w-8 h-8 text-orange-500" />
                            <h3 className="text-2xl font-bold">Mystère Meal</h3>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Discover delicious recipes based on ingredients you have.
                            Share your culinary creations and explore a world of flavors.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <a href="#about" className="text-gray-400 hover:text-orange-500 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <Link to="/add-recipe" className="text-gray-400 hover:text-orange-500 transition-colors">
                                    Share Recipe
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:mysteremeal.official@gmail.com" className="hover:text-orange-500 transition-colors">
                                    mysteremeal.official@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>© {currentYear} Mystère Meal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
