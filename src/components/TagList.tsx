import React from 'react';
import { X } from 'lucide-react';

interface TagListProps {
    ingredients: string[];
    onRemove: (ingredient: string) => void;
    onClearAll: () => void;
}

export const TagList: React.FC<TagListProps> = ({ ingredients, onRemove, onClearAll }) => {
    if (ingredients.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-sm font-medium text-gray-600">Your ingredients:</span>
            {ingredients.map((ingredient, index) => (
                <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                    <span className="capitalize">{ingredient}</span>
                    <button
                        onClick={() => onRemove(ingredient)}
                        className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${ingredient}`}
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}
            {ingredients.length > 1 && (
                <button
                    onClick={onClearAll}
                    className="text-sm text-red-600 hover:text-red-700 font-medium underline"
                >
                    Clear All
                </button>
            )}
        </div>
    );
};
