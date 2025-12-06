/**
 * Common measurement units used for ingredient suggestions.
 * These units correspond to the standard units stored in the backend database.
 * Using these specific units ensures accurate nutrition calculations.
 */
export const commonUnits = [
    // Mass/Weight
    'g', 'kg', 'oz', 'lb',

    // Volume/Liquid
    'ml', 'l', 'cup', 'tbsp', 'tsp',

    // Count/Quantity
    'piece', 'whole', 'slice', 'clove', 'head'
];

/**
 * Mock nutrition data repository.
 * Provides approximate nutritional values per 100g (or standard unit).
 * This data is used as a fallback system when the backend API is unreachable.
 */
export const mockIngredientNutritionData: Record<string, any> = {
    'chicken': { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
    'beef': { calories: 250, protein: 26, fat: 17, carbs: 0 },
    'pork': { calories: 242, protein: 27, fat: 14, carbs: 0 },
    'egg': { calories: 155, protein: 13, fat: 11, carbs: 1.1 },
    'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
    'pasta': { calories: 131, protein: 5, fat: 1.1, carbs: 25 },
    'bread': { calories: 265, protein: 9, fat: 3.2, carbs: 49 },
    'tomato': { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
    'onion': { calories: 40, protein: 1.1, fat: 0.1, carbs: 9 },
    'garlic': { calories: 149, protein: 6.4, fat: 0.5, carbs: 33 },
    'potato': { calories: 77, protein: 2, fat: 0.1, carbs: 17 },
    'carrot': { calories: 41, protein: 0.9, fat: 0.2, carbs: 10 },
    'milk': { calories: 42, protein: 3.4, fat: 1, carbs: 5 },
    'oil': { calories: 884, protein: 0, fat: 100, carbs: 0 },
    'sugar': { calories: 387, protein: 0, fat: 0, carbs: 100 },
    'salt': { calories: 0, protein: 0, fat: 0, carbs: 0 }
};

/**
 * Calculates estimated nutrition for a recipe based on local mock data.
 * This function is invoked automatically if the primary API call fails.
 *
 * @param {Object} recipeData - The recipe object containing an array of ingredients.
 * @returns {Object} An object containing the aggregated total calories, protein, fat, and carbs.
 */
export const calculateRecipeNutrition = (recipeData: { ingredients: any[] }) => {
    let total = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
        return total;
    }

    recipeData.ingredients.forEach(ing => {
        const name = ing.name ? ing.name.toLowerCase() : '';
        let nutrition = mockIngredientNutritionData[name];

        // Attempt partial match if exact match fails (e.g., 'chicken breast' -> 'chicken')
        if (!nutrition) {
            const key = Object.keys(mockIngredientNutritionData).find(k => name.includes(k));
            if (key) nutrition = mockIngredientNutritionData[key];
        }

        if (nutrition) {
            // Estimation Logic: Assume input quantity roughly maps to 100g units for mock purposes.
            // Note: This is a simplified calculation for offline/fallback mode only.
            const qty = parseFloat(ing.quantity) || 0;
            const factor = qty / 100;

            total.calories += nutrition.calories * factor;
            total.protein += nutrition.protein * factor;
            total.fat += nutrition.fat * factor;
            total.carbs += nutrition.carbs * factor;
        }
    });

    // Return rounded values for cleaner UI display
    return {
        calories: Math.round(total.calories),
        protein: parseFloat(total.protein.toFixed(1)),
        fat: parseFloat(total.fat.toFixed(1)),
        carbs: parseFloat(total.carbs.toFixed(1))
    };
};