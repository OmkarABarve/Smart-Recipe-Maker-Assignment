"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import ImageUpload from "@/components/ImageUpload";
import FilterBar from "@/components/FilterBar";
import RecipeCard from "@/components/RecipeCard";
import EmptyState from "@/components/EmptyState";
import { matchRecipes } from "@/lib/matching";
import { normalize } from "@/lib/normalize";
import { FilterState, DEFAULT_FILTERS, RecipeMatch } from "@/types";
import { getAllSaved, getTopRatedIds } from "@/lib/favorites";
import { recipes } from "@/data/recipes";
import Link from "next/link";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [topRatedIds, setTopRatedIds] = useState<string[]>([]);

  // Hydrate favorites / ratings on mount
  useEffect(() => {
    setSavedIds(getAllSaved().map((s) => s.recipeId));
    setTopRatedIds(getTopRatedIds());
  }, []);

  const results = useMemo(
    () => matchRecipes(ingredients, filters),
    [ingredients, filters]
  );

  const handleImageIngredients = useCallback(
    (recognized: string[]) => {
      const existingNorm = new Set(ingredients.map(normalize));
      const toAdd = recognized.filter(
        (name) => !existingNorm.has(normalize(name))
      );
      if (toAdd.length > 0) {
        setIngredients((prev) => [...prev, ...toAdd]);
      }
    },
    [ingredients]
  );

  const hasIngredients = ingredients.length > 0;
  const hasActiveFilters =
    filters.dietary.length > 0 ||
    filters.difficulty.length > 0 ||
    filters.cuisine.length > 0 ||
    filters.maxTime !== null;

  // Build "Suggested for you" from top-rated recipe tags/cuisines
  const suggestions = useMemo(() => {
    if (topRatedIds.length === 0) return [];
    // Gather cuisines and tags from top-rated recipes
    const ratedRecipes = recipes.filter((r) => topRatedIds.includes(r.id));
    const cuisineSet = new Set(ratedRecipes.map((r) => r.cuisine));
    const tagSet = new Set(ratedRecipes.flatMap((r) => r.tags));

    return recipes
      .filter(
        (r) =>
          !topRatedIds.includes(r.id) &&
          (cuisineSet.has(r.cuisine) || r.tags.some((t) => tagSet.has(t)))
      )
      .slice(0, 6);
  }, [topRatedIds]);

  // Build simple RecipeMatch objects for suggestion cards
  const suggestionMatches: RecipeMatch[] = useMemo(
    () =>
      suggestions.map((recipe) => ({
        recipe,
        score: 0,
        matchedIngredients: [],
        missingIngredients: [],
        substitutions: [],
      })),
    [suggestions]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header savedCount={savedIds.length} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <section className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Recipes with What You Have
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Enter the ingredients in your kitchen and we&apos;ll match you with
            the best recipes — plus smart substitution suggestions.
          </p>
        </section>

        {/* Ingredient input */}
        <section className="mb-4">
          <IngredientInput
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
          />
        </section>

        {/* Image upload for ingredient recognition */}
        <section className="mb-4">
          <ImageUpload onIngredientsRecognized={handleImageIngredients} />
        </section>

        {/* Filters */}
        <section className="mb-6">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
        </section>

        {/* Results */}
        <section>
          {!hasIngredients && !hasActiveFilters && <EmptyState type="initial" />}

          {hasIngredients && results.length === 0 && (
            <EmptyState type="no-results" />
          )}

          {(hasIngredients || hasActiveFilters) && results.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Matching Recipes
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({results.length} found)
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((match) => (
                  <RecipeCard key={match.recipe.id} match={match} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Suggestions section (only when idle) */}
        {!hasIngredients && !hasActiveFilters && suggestions.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Suggested for You
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                Based on your ratings
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestionMatches.map((match) => (
                <Link
                  key={match.recipe.id}
                  href={`/recipe/${match.recipe.id}`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {match.recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 mb-3">
                    {match.recipe.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{match.recipe.prepTime + match.recipe.cookTime} min</span>
                    <span>{match.recipe.difficulty}</span>
                    <span>{match.recipe.cuisine}</span>
                    <span className="font-semibold text-orange-500">{match.recipe.nutrition.calories} kcal</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Saved recipes quick access (only when idle) */}
        {!hasIngredients && !hasActiveFilters && savedIds.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Favorites
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({savedIds.length})
                </span>
              </h2>
              <Link
                href="/favorites"
                className="text-sm text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedIds.slice(0, 3).map((id) => {
                const recipe = recipes.find((r) => r.id === id);
                if (!recipe) return null;
                return (
                  <Link
                    key={recipe.id}
                    href={`/recipe/${recipe.id}`}
                    className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 p-5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-red-500 fill-red-500" viewBox="0 0 24 24">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                        {recipe.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 mb-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                      <span>{recipe.difficulty}</span>
                      <span className="font-semibold text-orange-500">{recipe.nutrition.calories} kcal</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Smart Recipe Generator — Built with Next.js, TypeScript &amp; Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
