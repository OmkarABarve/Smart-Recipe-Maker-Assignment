// --- Core domain types ---

export interface Ingredient {
  name: string;
  category: IngredientCategory;
}

export type IngredientCategory =
  | "protein"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "grain"
  | "spice"
  | "condiment"
  | "other";

export interface NutritionInfo {
  calories: number;   // kcal per serving
  protein: number;    // grams per serving
  carbs: number;      // grams per serving
  fat: number;        // grams per serving
  fiber: number;      // grams per serving
}

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "low-carb"
  | "high-protein";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine: string;
  tags: string[];
  dietaryTags: DietaryTag[];
  nutrition: NutritionInfo;
  image?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  optional: boolean;
}

// --- Matching result types ---

export interface RecipeMatch {
  recipe: Recipe;
  score: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  substitutions: Substitution[];
}

export interface Substitution {
  missing: string;
  replacement: string;
  similarity: number;
}

// --- Filter types ---

export interface FilterState {
  dietary: DietaryTag[];
  difficulty: ("easy" | "medium" | "hard")[];
  maxTime: number | null;       // max total time in minutes, null = no limit
  cuisine: string[];
}

export const DEFAULT_FILTERS: FilterState = {
  dietary: [],
  difficulty: [],
  maxTime: null,
  cuisine: [],
};

// --- User feedback types ---

export interface UserRating {
  recipeId: string;
  rating: number;     // 1-5 stars
  timestamp: number;
}

export interface SavedRecipe {
  recipeId: string;
  savedAt: number;
}
