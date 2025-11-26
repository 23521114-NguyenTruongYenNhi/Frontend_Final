import React from 'react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface ResultsGridProps {
    recipes: Recipe[];
    onRecipeClick: (id: string) => void;
    isSearching: boolean;
    likedIds?: Set<string>; // NEW: Optional prop for liked IDs
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ recipes, onRecipeClick, isSearching, likedIds }) => {
    if (isSearching) return <div className="text-center py-20 text-gray-500">Searching...</div>;
    if (!recipes || recipes.length === 0) return <div className="text-center py-20 text-gray-500">No recipes found.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    onClick={() => onRecipeClick(recipe._id)}
                    // Check if this recipe ID exists in the Set of liked IDs
                    initialLiked={likedIds ? likedIds.has(recipe._id) : false}
                />
            ))}
        </div>
    );
};