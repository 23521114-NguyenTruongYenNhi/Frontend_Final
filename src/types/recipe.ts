export interface Recipe {
    _id: string;
    title: string;
    image: string;
    cuisine: string;
    mealType: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    time: number; // in minutes
    rating: number;
    ingredients: string[];
    steps: string[];
    nutrition: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
    };
    author?: string;
    authorId?: string;
    tags: string[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
}

export interface Comment {
    id: string;
    userId: string;
    username: string;
    recipeId: string;
    text: string;
    rating: number;
    createdAt: string;
}

export interface RecipeFilters {
    cuisine?: string;
    mealType?: string;
    difficulty?: string;
    maxTime?: number;
    minRating?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
}
