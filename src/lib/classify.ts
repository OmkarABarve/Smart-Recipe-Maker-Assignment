import { IngredientCategory } from "@/types";

const CATEGORY_KEYWORDS: Record<IngredientCategory, string[]> = {
  protein: [
    "chicken", "beef", "pork", "turkey", "lamb", "salmon", "shrimp", "tuna",
    "trout", "prawn", "bacon", "pancetta", "egg", "tofu", "tempeh", "paneer",
    "anchovy", "fish", "sausage", "sirloin", "ground beef", "ground turkey",
    "ground pork", "ground chicken", "chicken breast", "chicken thigh",
    "beef sirloin", "edamame",
  ],
  dairy: [
    "milk", "cream", "butter", "cheese", "mozzarella", "cheddar", "parmesan",
    "feta", "gruyere", "yogurt", "sour cream", "ricotta", "goat cheese",
    "cream cheese", "provolone", "halloumi", "swiss cheese",
  ],
  vegetable: [
    "onion", "garlic", "tomato", "potato", "carrot", "bell pepper", "broccoli",
    "spinach", "lettuce", "zucchini", "eggplant", "mushroom", "cucumber",
    "celery", "pea", "corn", "bean sprout", "bamboo shoot", "seaweed",
    "romaine lettuce", "red onion", "green onion", "scallion", "kale",
    "cauliflower", "sweet potato", "cabbage", "asparagus",
  ],
  fruit: [
    "tomato", "avocado", "lemon", "lime", "banana", "blueberry", "strawberry",
    "cherry", "apple", "orange", "mango", "pineapple", "coconut", "olive",
    "jalapeno", "poblano pepper",
  ],
  grain: [
    "rice", "flour", "bread", "pasta", "spaghetti", "penne", "macaroni",
    "noodle", "ramen", "tortilla", "pita", "oat", "bulgur", "quinoa",
    "couscous", "arborio", "breadcrumb", "pizza dough", "pie crust",
    "burger bun", "naan",
  ],
  spice: [
    "salt", "pepper", "cumin", "paprika", "turmeric", "chili", "oregano",
    "thyme", "basil", "cilantro", "parsley", "garam masala", "curry",
    "ginger", "cinnamon", "nutmeg", "mint", "rosemary", "gochujang",
    "lemongrass", "dill", "bay leaf",
  ],
  condiment: [
    "soy sauce", "fish sauce", "olive oil", "sesame oil", "vegetable oil",
    "vinegar", "balsamic", "mustard", "ketchup", "mayonnaise", "salsa",
    "honey", "maple syrup", "sugar", "miso paste", "tahini", "peanut butter",
    "tomato sauce", "hot sauce", "sriracha", "coconut milk", "vanilla extract",
    "baking powder", "cornstarch", "green curry paste",
  ],
  other: [
    "water", "broth", "stock", "wine", "chickpea", "black bean", "lentil",
    "peanut", "cashew", "almond", "walnut", "sesame seed", "chia seed",
    "flax seed",
  ],
};

const cache = new Map<string, IngredientCategory>();

export function classifyIngredient(name: string): IngredientCategory {
  const lower = name.toLowerCase().trim();

  const cached = cache.get(lower);
  if (cached) return cached;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    IngredientCategory,
    string[],
  ][]) {
    for (const keyword of keywords) {
      if (lower === keyword || lower.includes(keyword) || keyword.includes(lower)) {
        cache.set(lower, category);
        return category;
      }
    }
  }

  cache.set(lower, "other");
  return "other";
}

export const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  protein: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  dairy: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  vegetable: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  fruit: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  grain: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  spice: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  condiment: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  protein: "Protein",
  dairy: "Dairy",
  vegetable: "Vegetable",
  fruit: "Fruit",
  grain: "Grain",
  spice: "Spice",
  condiment: "Condiment",
  other: "Other",
};
