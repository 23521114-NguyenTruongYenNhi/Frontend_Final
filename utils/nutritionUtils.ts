import { Recipe, RecipeIngredient, IngredientNutrition } from '../types/recipe';

// Mock ingredient nutrition data (subset of common ingredients)
// In production, this would be fetched from API
export const mockIngredientNutritionData: Record<string, IngredientNutrition> = {
    'chicken': {
        name: 'chicken',
        caloriesPerUnit: 165,
        proteinPerUnit: 31,
        fatPerUnit: 3.6,
        carbsPerUnit: 0,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'oz': 0.28 }
    },
    'tomato': {
        name: 'tomato',
        caloriesPerUnit: 18,
        proteinPerUnit: 0.9,
        fatPerUnit: 0.2,
        carbsPerUnit: 3.9,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'whole': 1.23 }
    },
    'onion': {
        name: 'onion',
        caloriesPerUnit: 40,
        proteinPerUnit: 1.1,
        fatPerUnit: 0.1,
        carbsPerUnit: 9.3,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'whole': 1.1 }
    },
    'garlic': {
        name: 'garlic',
        caloriesPerUnit: 149,
        proteinPerUnit: 6.4,
        fatPerUnit: 0.5,
        carbsPerUnit: 33,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'cloves': 0.03 }
    },
    'olive oil': {
        name: 'olive oil',
        caloriesPerUnit: 884,
        proteinPerUnit: 0,
        fatPerUnit: 100,
        carbsPerUnit: 0,
        standardUnit: '100ml',
        conversions: { 'ml': 0.01, 'tbsp': 0.15, 'tsp': 0.05 }
    },
    'rice': {
        name: 'rice',
        caloriesPerUnit: 130,
        proteinPerUnit: 2.7,
        fatPerUnit: 0.3,
        carbsPerUnit: 28,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'cup': 1.95 }
    },
    'pasta': {
        name: 'pasta',
        caloriesPerUnit: 371,
        proteinPerUnit: 13,
        fatPerUnit: 1.5,
        carbsPerUnit: 75,
        standardUnit: '100g',
        conversions: { 'g': 0.01 }
    },
    'beef': {
        name: 'beef',
        caloriesPerUnit: 250,
        proteinPerUnit: 26,
        fatPerUnit: 15,
        carbsPerUnit: 0,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'oz': 0.28 }
    },
    'egg': {
        name: 'egg',
        caloriesPerUnit: 155,
        proteinPerUnit: 13,
        fatPerUnit: 11,
        carbsPerUnit: 1.1,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'whole': 0.5 }
    },
    'cheese': {
        name: 'cheese',
        caloriesPerUnit: 300,
        proteinPerUnit: 25,
        fatPerUnit: 20,
        carbsPerUnit: 3,
        standardUnit: '100g',
        conversions: { 'g': 0.01, 'oz': 0.28 }
    }
};

/**
 * Get nutrition data for an ingredient by name
 * Supports partial matching and common aliases
 */
export function getIngredientNutrition(ingredientName: string): IngredientNutrition | null {
    const name = ingredientName.toLowerCase();

    // Direct match
    if (mockIngredientNutritionData[name]) {
        return mockIngredientNutritionData[name];
    }

    // Partial match
    for (const [key, value] of Object.entries(mockIngredientNutritionData)) {
        if (name.includes(key) || key.includes(name)) {
            return value;
        }
    }

    // Default fallback nutrition
    return {
        name: ingredientName,
        caloriesPerUnit: 50,
        proteinPerUnit: 2,
        fatPerUnit: 1,
        carbsPerUnit: 8,
        standardUnit: '100g',
        conversions: { 'g': 0.01 }
    };
}

/**
 * Convert quantity to standard unit using conversion factors
 */
function convertToStandardUnit(quantity: number, unit: string, conversions: Record<string, number>): number {
    const unitLower = unit.toLowerCase();

    // If already in standard unit or no conversion available
    if (!conversions[unitLower]) {
        return quantity;
    }

    // Apply conversion factor
    return quantity * conversions[unitLower];
}

/**
 * Calculate nutrition for a single ingredient
 */
export function calculateIngredientNutrition(
    ingredient: RecipeIngredient
): { calories: number; protein: number; fat: number; carbs: number } | null {
    const nutritionData = getIngredientNutrition(ingredient.name);

    if (!nutritionData) {
        return null;
    }

    // Convert quantity to standard unit
    const standardQuantity = convertToStandardUnit(
        ingredient.quantity,
        ingredient.unit,
        nutritionData.conversions || {}
    );

    // Calculate nutrition based on standard quantity
    return {
        calories: Math.round(nutritionData.caloriesPerUnit * standardQuantity),
        protein: Math.round(nutritionData.proteinPerUnit * standardQuantity * 10) / 10,
        fat: Math.round(nutritionData.fatPerUnit * standardQuantity * 10) / 10,
        carbs: Math.round(nutritionData.carbsPerUnit * standardQuantity * 10) / 10
    };
}

/**
 * Calculate total nutrition for entire recipe from ingredients
 * This is the main function used in RecipeDetailPage
 */
export function calculateRecipeNutrition(recipe: Recipe): {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
} {
    let totalNutrition = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
    };

    recipe.ingredients.forEach(ingredient => {
        const ingredientNutrition = calculateIngredientNutrition(ingredient);
        if (ingredientNutrition) {
            totalNutrition.calories += ingredientNutrition.calories;
            totalNutrition.protein += ingredientNutrition.protein;
            totalNutrition.fat += ingredientNutrition.fat;
            totalNutrition.carbs += ingredientNutrition.carbs;
        }
    });

    return {
        calories: Math.round(totalNutrition.calories),
        protein: Math.round(totalNutrition.protein * 10) / 10,
        fat: Math.round(totalNutrition.fat * 10) / 10,
        carbs: Math.round(totalNutrition.carbs * 10) / 10
    };
}

/**
 * Format ingredient for display
 */
export function formatIngredient(ingredient: RecipeIngredient): string {
    const quantityStr = ingredient.quantity % 1 === 0
        ? ingredient.quantity.toString()
        : ingredient.quantity.toFixed(1);

    return `${quantityStr}${ingredient.unit} ${ingredient.name}`;
}

/**
 * Get ingredients list as string array (for backward compatibility)
 */
export function getIngredientsAsStrings(ingredients: RecipeIngredient[]): string[] {
    return ingredients.map(formatIngredient);
}
