import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { commonIngredients } from '../data/mockIngredients';

interface SearchBarProps {
    onAddIngredient: (ingredient: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onAddIngredient }) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (input.trim().length > 0) {
            const filtered = commonIngredients.filter(ing =>
                ing.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 8));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [input]);

    const handleAddIngredient = (ingredient: string) => {
        if (ingredient.trim()) {
            onAddIngredient(ingredient.trim().toLowerCase());
            setInput('');
            setSuggestions([]);
            setShowSuggestions(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            handleAddIngredient(input);
        }
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type an ingredient (e.g., tomato, chicken, onion)..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                />
                {input && (
                    <button
                        onClick={() => setInput('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleAddIngredient(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <span className="text-gray-700 capitalize">{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
