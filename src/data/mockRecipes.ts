import { Recipe } from '../types/recipe';

export const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Classic Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
        cuisine: 'Italian',
        mealType: 'Dinner',
        difficulty: 'Medium',
        time: 45,
        rating: 4.8,
        ingredients: ['flour', 'tomato', 'mozzarella', 'basil', 'olive oil', 'yeast', 'salt'],
        steps: [
            'In a large mixing bowl, combine 500g all-purpose flour, 1 teaspoon salt, and 1 packet (7g) active dry yeast. Gradually add 300ml warm water while mixing until a sticky dough forms. Knead for 8-10 minutes until smooth and elastic. Place in an oiled bowl, cover with a damp cloth, and let rise in a warm place for 1 hour until doubled in size.',
            'Once the dough has risen, punch it down gently to release air bubbles. Transfer to a lightly floured surface and divide into 2 equal portions. Using a rolling pin, roll each portion into a 12-inch circle, starting from the center and working outward. The dough should be about 1/4 inch thick with slightly thicker edges for the crust.',
            'Preheat your oven to 475°F (245°C) with a pizza stone if available. Spread 1/2 cup of high-quality tomato sauce (or crushed San Marzano tomatoes) evenly over each pizza base, leaving a 1-inch border around the edges. Use the back of a spoon to create an even layer.',
            'Tear 250g fresh mozzarella cheese into small pieces and distribute evenly across the sauce. Don\'t overload - the cheese should cover about 70% of the surface. Add a light drizzle of extra virgin olive oil over the cheese for added flavor and moisture.',
            'Carefully transfer the pizza to your preheated oven (onto the pizza stone or a baking sheet). Bake for 12-15 minutes, rotating halfway through for even cooking. The crust should be golden brown and slightly charred at the edges, and the cheese should be bubbling and lightly browned.',
            'Remove from oven and immediately garnish with 8-10 fresh basil leaves torn by hand (never cut basil as it bruises easily). Drizzle with 1-2 tablespoons of high-quality extra virgin olive oil. Let cool for 2-3 minutes before slicing to allow the cheese to set slightly. Serve immediately while hot and crispy.'
        ],
        nutrition: { calories: 285, protein: 12, fat: 10, carbs: 38 },
        tags: ['Italian', 'Pizza', 'Dinner'],
        isVegetarian: true
    },
    {
        id: '2',
        title: 'Chicken Caesar Salad',
        image: 'https://images.unsplash.com/photo-1712746784937-aa56235fbab0?w=800',
        cuisine: 'American',
        mealType: 'Lunch',
        difficulty: 'Easy',
        time: 20,
        rating: 4.5,
        ingredients: ['chicken breast', 'romaine lettuce', 'parmesan', 'croutons', 'caesar dressing', 'lemon'],
        steps: [
            'Season 2 boneless, skinless chicken breasts (about 400g total) with 1/2 teaspoon each of salt, black pepper, and garlic powder on both sides. Heat 2 tablespoons olive oil in a grill pan or skillet over medium-high heat. Once hot, add chicken breasts and cook for 6-7 minutes on the first side without moving them to develop a nice golden crust. Flip and cook for another 6-7 minutes until internal temperature reaches 165°F (74°C). Remove from heat and let rest for 5 minutes to retain juices.',
            'While chicken is resting, wash 2 large heads of romaine lettuce thoroughly under cold water and pat completely dry with paper towels or use a salad spinner. Remove the tough outer leaves and cut the lettuce crosswise into 1-inch wide strips. For best texture, tear larger leaves by hand rather than cutting them.',
            'Once the chicken has rested, transfer to a cutting board and slice diagonally into 1/2-inch thick strips. Cutting against the grain will make the chicken more tender. If serving warm, keep the strips loosely covered; for cold salad, refrigerate for 10 minutes.',
            'Place the chopped romaine lettuce in a large mixing bowl. Add 1/2 cup of Caesar dressing and toss thoroughly using tongs or your hands, ensuring every leaf is lightly coated. Start with less dressing and add more as needed - the lettuce should be evenly coated but not swimming in dressing.',
            'Transfer the dressed lettuce to serving plates or a large platter. Arrange the sliced chicken strips on top in an attractive pattern. Sprinkle generously with 1/2 cup freshly shaved Parmesan cheese (use a vegetable peeler for best results), and add 1 cup of homemade or store-bought croutons scattered evenly over the top.',
            'Just before serving, cut a fresh lemon in half and squeeze the juice over the entire salad (about 1-2 tablespoons). This brightens the flavors and adds a fresh citrus note. Optional: Add 2-3 anchovy fillets and extra cracked black pepper for authentic Caesar flavor. Serve immediately while the lettuce is crisp and the chicken is at the perfect temperature.'
        ],
        nutrition: { calories: 320, protein: 28, fat: 18, carbs: 15 },
        tags: ['Salad', 'Healthy', 'Lunch']
    },
    {
        id: '3',
        title: 'Vegetable Stir Fry',
        image: 'https://images.unsplash.com/photo-1552914343-05ccdaf123d6?w=800',
        cuisine: 'Chinese',
        mealType: 'Dinner',
        difficulty: 'Easy',
        time: 25,
        rating: 4.6,
        ingredients: ['broccoli', 'carrot', 'bell pepper', 'onion', 'garlic', 'soy sauce', 'ginger', 'sesame oil'],
        steps: [
            'Prepare all vegetables before cooking (mis en place is crucial for stir-frying): Cut 1 head of broccoli into small florets about 1 inch in size. Peel and slice 2 large carrots diagonally into 1/4-inch thick ovals. Cut 1 red and 1 yellow bell pepper into 1-inch squares. Slice 1 large onion into thick wedges. Mince 4 cloves of garlic and grate a 2-inch piece of fresh ginger. Keep everything separate and within reach.',
            'Heat your wok or large skillet over high heat for 2 minutes until very hot - a drop of water should evaporate instantly. Add 2 tablespoons of sesame oil and swirl to coat the bottom. The oil should shimmer but not smoke. This high heat is essential for achieving that characteristic wok char (wok hei).',
            'Add the minced garlic and grated ginger to the hot oil. Stir-fry vigorously for 20-30 seconds using a wooden spoon or wok spatula, keeping them moving constantly to prevent burning. You should smell a wonderful aromatic fragrance - this is the foundation of flavor for your stir-fry.',
            'Add the harder vegetables first: toss in the carrots and broccoli florets. Stir-fry for 3-4 minutes, constantly tossing and stirring to cook evenly. The vegetables should start to develop slight char marks and become tender-crisp. If the pan seems too dry, add 2 tablespoons of water to create steam and help cook the vegetables through.',
            'Add the bell peppers and onion wedges to the wok. Continue stir-frying for another 2-3 minutes. The bell peppers should retain their bright color and have a slight crunch. All vegetables should be cooked but still crisp - not soggy. Keep the ingredients moving constantly.',
            'Push all vegetables to the sides of the wok, creating a well in the center. Add 3 tablespoons of soy sauce (or to taste) and 1 teaspoon of sesame oil to the center. Let it sizzle for 5 seconds, then toss everything together to coat evenly. For extra flavor, add 1 tablespoon of oyster sauce or hoisin sauce. Serve immediately over steamed rice while piping hot, garnished with toasted sesame seeds and sliced green onions if desired.'
        ],
        nutrition: { calories: 180, protein: 6, fat: 8, carbs: 24 },
        tags: ['Chinese', 'Vegetarian', 'Healthy'],
        isVegetarian: true,
        isVegan: true
    },
    {
        id: '4',
        title: 'Thai Green Curry',
        image: 'https://images.unsplash.com/photo-1716959669858-11d415bdead6?w=800',
        cuisine: 'French',
        mealType: 'Breakfast',
        difficulty: 'Easy',
        time: 15,
        rating: 4.7,
        ingredients: ['bread', 'egg', 'milk', 'cinnamon', 'butter', 'strawberries', 'blueberries', 'maple syrup'],
        steps: [
            'Whisk together eggs, milk, and cinnamon',
            'Dip bread slices in egg mixture',
            'Melt butter in a pan over medium heat',
            'Cook bread slices until golden on both sides',
            'Top with fresh berries and maple syrup',
            'Dust with powdered sugar if desired'
        ],
        nutrition: { calories: 340, protein: 12, fat: 14, carbs: 45 },
        tags: ['Breakfast', 'French', 'Sweet'],
        isVegetarian: true
    },
    {
        id: '5',
        title: 'Beef Tacos',
        image: 'https://images.unsplash.com/photo-1663626913917-8a638838905e?w=800',
        cuisine: 'Mexican',
        mealType: 'Dinner',
        difficulty: 'Easy',
        time: 30,
        rating: 4.9,
        ingredients: ['ground beef', 'taco shells', 'lettuce', 'tomato', 'cheese', 'sour cream', 'onion', 'taco seasoning'],
        steps: [
            'Brown ground beef in a skillet',
            'Add taco seasoning and water, simmer for 10 minutes',
            'Warm taco shells according to package directions',
            'Chop lettuce, tomatoes, and onions',
            'Fill shells with seasoned beef',
            'Top with lettuce, tomatoes, cheese, and sour cream'
        ],
        nutrition: { calories: 380, protein: 22, fat: 20, carbs: 28 },
        tags: ['Mexican', 'Dinner', 'Spicy']
    },
    {
        id: '6',
        title: 'Greek Salad',
        image: 'https://images.unsplash.com/photo-1563046937-046866771a6e?w=800',
        cuisine: 'Greek',
        mealType: 'Lunch',
        difficulty: 'Easy',
        time: 10,
        rating: 4.4,
        ingredients: ['cucumber', 'tomato', 'feta cheese', 'olives', 'red onion', 'olive oil', 'lemon', 'oregano'],
        steps: [
            'Chop cucumbers and tomatoes into chunks',
            'Slice red onion thinly',
            'Combine vegetables in a large bowl',
            'Add olives and crumbled feta cheese',
            'Drizzle with olive oil and lemon juice',
            'Season with oregano, salt, and pepper'
        ],
        nutrition: { calories: 220, protein: 8, fat: 16, carbs: 14 },
        tags: ['Greek', 'Salad', 'Vegetarian', 'Healthy'],
        isVegetarian: true
    },
    {
        id: '7',
        title: 'Classic Burger & Fries',
        image: 'https://images.unsplash.com/photo-1643234567681-b28137fb1c33?w=800',
        cuisine: 'American',
        mealType: 'Dessert',
        difficulty: 'Easy',
        time: 25,
        rating: 4.9,
        ingredients: ['flour', 'butter', 'sugar', 'brown sugar', 'egg', 'vanilla extract', 'chocolate chips', 'baking soda', 'salt'],
        steps: [
            'Cream together butter, sugar, and brown sugar',
            'Beat in eggs and vanilla extract',
            'Mix in flour, baking soda, and salt',
            'Fold in chocolate chips',
            'Drop spoonfuls onto baking sheet',
            'Bake at 375°F for 10-12 minutes until golden'
        ],
        nutrition: { calories: 150, protein: 2, fat: 8, carbs: 20 },
        tags: ['Dessert', 'Baking', 'Sweet'],
        isVegetarian: true
    },
    {
        id: '8',
        title: 'Teriyaki Salmon',
        image: 'https://images.unsplash.com/photo-1732759959723-27f1ba1d1fa5?w=800',
        cuisine: 'Thai',
        mealType: 'Dinner',
        difficulty: 'Medium',
        time: 35,
        rating: 4.7,
        ingredients: ['chicken', 'coconut milk', 'green curry paste', 'bamboo shoots', 'bell pepper', 'basil', 'fish sauce', 'lime'],
        steps: [
            'Heat oil and fry green curry paste until fragrant',
            'Add chicken pieces and cook until sealed',
            'Pour in coconut milk and bring to simmer',
            'Add bamboo shoots and bell peppers',
            'Season with fish sauce and lime juice',
            'Garnish with fresh basil leaves'
        ],
        nutrition: { calories: 420, protein: 28, fat: 26, carbs: 18 },
        tags: ['Thai', 'Curry', 'Spicy']
    },
    {
        id: '9',
        title: 'Spaghetti Carbonara',
        image: 'https://images.unsplash.com/photo-1651585594107-859f80b4ca3a?w=800',
        cuisine: 'Italian',
        mealType: 'Lunch',
        difficulty: 'Easy',
        time: 10,
        rating: 4.5,
        ingredients: ['ciabatta bread', 'mozzarella', 'tomato', 'basil', 'balsamic vinegar', 'olive oil'],
        steps: [
            'Slice ciabatta bread horizontally',
            'Drizzle bread with olive oil and balsamic vinegar',
            'Layer fresh mozzarella slices on bread',
            'Add thick tomato slices',
            'Top with fresh basil leaves',
            'Close sandwich and serve immediately'
        ],
        nutrition: { calories: 380, protein: 18, fat: 16, carbs: 42 },
        tags: ['Italian', 'Sandwich', 'Quick'],
        isVegetarian: true
    },
    {
        id: '10',
        title: 'Mushroom Risotto',
        image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800',
        cuisine: 'American',
        mealType: 'Breakfast',
        difficulty: 'Easy',
        time: 20,
        rating: 4.8,
        ingredients: ['flour', 'milk', 'egg', 'baking powder', 'blueberries', 'butter', 'maple syrup', 'sugar'],
        steps: [
            'Mix flour, baking powder, sugar, and salt',
            'Whisk together milk and eggs',
            'Combine wet and dry ingredients until just mixed',
            'Fold in fresh blueberries gently',
            'Cook pancakes on griddle until bubbles form',
            'Flip and cook until golden, serve with syrup'
        ],
        nutrition: { calories: 320, protein: 10, fat: 12, carbs: 46 },
        tags: ['Breakfast', 'Pancakes', 'Sweet'],
        isVegetarian: true
    },
    {
        id: '11',
        title: 'Pad Thai Noodles',
        image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
        cuisine: 'International',
        mealType: 'Lunch',
        difficulty: 'Easy',
        time: 30,
        rating: 4.6,
        ingredients: ['quinoa', 'chickpeas', 'avocado', 'kale', 'sweet potato', 'tahini', 'lemon', 'garlic'],
        steps: [
            'Cook quinoa according to package directions',
            'Roast chickpeas and cubed sweet potato',
            'Massage kale with lemon juice',
            'Make tahini dressing with garlic and lemon',
            'Arrange quinoa, vegetables, and chickpeas in bowl',
            'Top with sliced avocado and drizzle dressing'
        ],
        nutrition: { calories: 450, protein: 16, fat: 18, carbs: 58 },
        tags: ['Healthy', 'Vegetarian', 'Bowl'],
        isVegetarian: true,
        isVegan: true
    },
    {
        id: '12',
        title: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
        cuisine: 'Italian',
        mealType: 'Dinner',
        difficulty: 'Medium',
        time: 25,
        rating: 4.7,
        ingredients: ['spaghetti', 'bacon', 'egg', 'parmesan', 'black pepper', 'garlic'],
        steps: [
            'Cook spaghetti in salted boiling water',
            'Fry bacon until crispy, add garlic',
            'Whisk eggs with grated parmesan',
            'Drain pasta, reserving some pasta water',
            'Toss hot pasta with bacon and garlic',
            'Remove from heat, stir in egg mixture quickly'
        ],
        nutrition: { calories: 520, protein: 24, fat: 22, carbs: 56 },
        tags: ['Italian', 'Pasta', 'Comfort Food']
    }
];

// Search function that filters recipes based on ingredients and filters
export const searchRecipes = (
    ingredients: string[],
    filters?: {
        cuisine?: string;
        mealType?: string;
        difficulty?: string;
        maxTime?: number;
        minRating?: number;
        isVegetarian?: boolean;
        isVegan?: boolean;
        isGlutenFree?: boolean;
    }
): Recipe[] => {
    let results = [...mockRecipes];

    // Filter by ingredients (recipe must contain at least one searched ingredient)
    if (ingredients.length > 0) {
        results = results.filter(recipe =>
            ingredients.some(ingredient =>
                recipe.ingredients.some(recipeIngredient =>
                    recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
                )
            )
        );

        // Sort by number of matching ingredients (most matches first)
        results.sort((a, b) => {
            const aMatches = ingredients.filter(ing =>
                a.ingredients.some(recipeIng =>
                    recipeIng.toLowerCase().includes(ing.toLowerCase())
                )
            ).length;
            const bMatches = ingredients.filter(ing =>
                b.ingredients.some(recipeIng =>
                    recipeIng.toLowerCase().includes(ing.toLowerCase())
                )
            ).length;
            return bMatches - aMatches;
        });
    }

    // Apply filters
    if (filters) {
        if (filters.cuisine) {
            results = results.filter(recipe => recipe.cuisine === filters.cuisine);
        }
        if (filters.mealType) {
            results = results.filter(recipe => recipe.mealType === filters.mealType);
        }
        if (filters.difficulty) {
            results = results.filter(recipe => recipe.difficulty === filters.difficulty);
        }
        if (filters.maxTime) {
            results = results.filter(recipe => recipe.time <= filters.maxTime);
        }
        if (filters.minRating) {
            results = results.filter(recipe => recipe.rating >= filters.minRating);
        }
        if (filters.isVegetarian) {
            results = results.filter(recipe => recipe.isVegetarian);
        }
        if (filters.isVegan) {
            results = results.filter(recipe => recipe.isVegan);
        }
        if (filters.isGlutenFree) {
            results = results.filter(recipe => recipe.isGlutenFree);
        }
    }

    return results;
};

// Common ingredients for autocomplete
export const commonIngredients = [
    'egg', 'milk', 'flour', 'butter', 'sugar', 'salt', 'pepper', 'olive oil',
    'chicken', 'beef', 'pork', 'fish', 'shrimp',
    'tomato', 'onion', 'garlic', 'carrot', 'potato', 'bell pepper', 'broccoli',
    'lettuce', 'cucumber', 'spinach', 'kale', 'avocado',
    'rice', 'pasta', 'bread', 'quinoa',
    'cheese', 'mozzarella', 'parmesan', 'feta',
    'lemon', 'lime', 'basil', 'oregano', 'cilantro', 'parsley',
    'soy sauce', 'vinegar', 'honey', 'maple syrup'
];
