import { Recipe, RecipeMatch, Substitution, FilterState } from "@/types";
import { recipes } from "@/data/recipes";
import { normalize } from "./normalize";
import { findSubstitution } from "./substitutions";
import {
  SUBSTITUTION_WEIGHT,
  MAX_RESULTS,
  MIN_SCORE_THRESHOLD,
} from "./constants";

/**
 * Score and rank all recipes against the user's available ingredients,
 * applying optional filters.
 */
export function matchRecipes(
  userIngredients: string[],
  filters?: FilterState
): RecipeMatch[] {
  // Normalize user ingredients once
  const normalizedUser = userIngredients.map(normalize);
  const userSet = new Set(normalizedUser);

  if (normalizedUser.length === 0) return [];

  const results: RecipeMatch[] = [];

  for (const recipe of recipes) {
    // Apply filters before scoring (cheaper)
    if (filters && !passesFilters(recipe, filters)) continue;

    const result = scoreRecipe(recipe, normalizedUser, userSet);
    if (result.score >= MIN_SCORE_THRESHOLD) {
      results.push(result);
    }
  }

  // Sort by score descending, then by fewer missing ingredients as tiebreaker
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.missingIngredients.length - b.missingIngredients.length;
  });

  return results.slice(0, MAX_RESULTS);
}

/**
 * Check if a recipe passes the given filters.
 */
function passesFilters(recipe: Recipe, filters: FilterState): boolean {
  // Dietary: recipe must have ALL selected dietary tags
  if (filters.dietary.length > 0) {
    if (!filters.dietary.every((tag) => recipe.dietaryTags.includes(tag))) {
      return false;
    }
  }

  // Difficulty
  if (filters.difficulty.length > 0) {
    if (!filters.difficulty.includes(recipe.difficulty)) {
      return false;
    }
  }

  // Max cooking time
  if (filters.maxTime !== null) {
    if (recipe.prepTime + recipe.cookTime > filters.maxTime) {
      return false;
    }
  }

  // Cuisine
  if (filters.cuisine.length > 0) {
    if (!filters.cuisine.includes(recipe.cuisine)) {
      return false;
    }
  }

  return true;
}

/**
 * Score a single recipe against the user's normalized ingredients.
 */
function scoreRecipe(
  recipe: Recipe,
  normalizedUser: string[],
  userSet: Set<string>
): RecipeMatch {
  const matched: string[] = [];
  const missing: string[] = [];
  const substitutions: Substitution[] = [];

  // Count only required (non-optional) ingredients
  const requiredIngredients = recipe.ingredients.filter(
    (ing) => !ing.optional
  );

  for (const ing of requiredIngredients) {
    const normalizedName = normalize(ing.name);

    if (userSet.has(normalizedName)) {
      matched.push(ing.name);
    } else {
      // Try to find a substitution
      const sub = findSubstitution(normalizedName, normalizedUser);
      if (sub) {
        substitutions.push(sub);
      } else {
        missing.push(ing.name);
      }
    }
  }

  const requiredCount = requiredIngredients.length;

  if (requiredCount === 0) {
    return {
      recipe,
      score: 100,
      matchedIngredients: matched,
      missingIngredients: missing,
      substitutions,
    };
  }

  // Base score from direct matches
  const baseScore = (matched.length / requiredCount) * 100;

  // Substitution bonus: each sub counts as (similarity * SUBSTITUTION_WEIGHT) of a full match
  const substitutionBonus =
    substitutions.reduce((sum, sub) => sum + sub.similarity * SUBSTITUTION_WEIGHT, 0) /
    requiredCount *
    100;

  // Clamp between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(baseScore + substitutionBonus)));

  return {
    recipe,
    score: finalScore,
    matchedIngredients: matched,
    missingIngredients: missing,
    substitutions,
  };
}

/**
 * Look up a single recipe by its ID.
 */
export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

/**
 * Get all recipes optionally filtered, useful for browsing/suggestions.
 */
export function getFilteredRecipes(filters?: FilterState): Recipe[] {
  if (!filters) return recipes;
  return recipes.filter((r) => passesFilters(r, filters));
}
