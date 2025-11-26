import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { RecipeFilters } from '../types/recipe';

interface FiltersPanelProps {
    filters: RecipeFilters;
    onFilterChange: (filters: RecipeFilters) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const cuisines = ['Italian', 'American', 'Chinese', 'Mexican', 'French', 'Greek', 'Thai', 'Japanese', 'Indian', 'Spanish', 'Korean', 'Vietnamese', 'Mediterranean', 'Middle Eastern', 'International'];
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const handleFilterChange = (key: keyof RecipeFilters, value: any) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isExpanded && (
                <div className="px-6 py-4 border-t border-gray-200 space-y-6">
                    {/* Cuisine Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine</label>
                        <select
                            value={filters.cuisine || ''}
                            onChange={(e) => handleFilterChange('cuisine', e.target.value || undefined)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                        >
                            <option value="">All Cuisines</option>
                            {cuisines.map(cuisine => (
                                <option key={cuisine} value={cuisine}>{cuisine}</option>
                            ))}
                        </select>
                    </div>

                    {/* Meal Type Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
                        <select
                            value={filters.mealType || ''}
                            onChange={(e) => handleFilterChange('mealType', e.target.value || undefined)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                        >
                            <option value="">All Meal Types</option>
                            {mealTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                        <select
                            value={filters.difficulty || ''}
                            onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none"
                        >
                            <option value="">All Levels</option>
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>{diff}</option>
                            ))}
                        </select>
                    </div>

                    {/* Max Time Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Max Time: {filters.maxTime ? `${filters.maxTime} min` : 'Any'}
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="120"
                            step="5"
                            value={filters.maxTime || 120}
                            onChange={(e) => handleFilterChange('maxTime', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10 min</span>
                            <span>120 min</span>
                        </div>
                    </div>

                    {/* Min Rating Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Minimum Rating: {filters.minRating ? `${filters.minRating}★` : 'Any'}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={filters.minRating || 0}
                            onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Any</span>
                            <span>5★</span>
                        </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Dietary Preferences</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isVegetarian || false}
                                    onChange={(e) => handleFilterChange('isVegetarian', e.target.checked || undefined)}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">Vegetarian</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isVegan || false}
                                    onChange={(e) => handleFilterChange('isVegan', e.target.checked || undefined)}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">Vegan</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isGlutenFree || false}
                                    onChange={(e) => handleFilterChange('isGlutenFree', e.target.checked || undefined)}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">Gluten-Free</span>
                            </label>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => onFilterChange({})}
                            className="w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
