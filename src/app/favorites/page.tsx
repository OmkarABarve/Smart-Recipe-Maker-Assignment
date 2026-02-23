"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import RatingStars from "@/components/RatingStars";
import SaveButton from "@/components/SaveButton";
import Link from "next/link";
import { recipes } from "@/data/recipes";
import { Recipe } from "@/types";
import {
  getAllSaved,
  getAllRatings,
  toggleSaved,
  setRating as persistRating,
} from "@/lib/favorites";

interface FavoriteItem {
  recipe: Recipe;
  savedAt: number;
  rating: number;
}

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  const loadFavorites = useCallback(() => {
    const saved = getAllSaved();
    const ratings = getAllRatings();
    const ratingMap = new Map(ratings.map((r) => [r.recipeId, r.rating]));

    const favs: FavoriteItem[] = [];
    for (const s of saved) {
      const recipe = recipes.find((r) => r.id === s.recipeId);
      if (recipe) {
        favs.push({
          recipe,
          savedAt: s.savedAt,
          rating: ratingMap.get(s.recipeId) ?? 0,
        });
      }
    }
    setItems(favs);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleSave = (recipeId: string) => {
    toggleSaved(recipeId);
    loadFavorites();
  };

  const handleRate = (recipeId: string, rating: number) => {
    persistRating(recipeId, rating);
    loadFavorites();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header savedCount={items.length} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Your Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl">
          Recipes you&apos;ve saved and rated. Rate recipes to get personalized suggestions on the home page.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-6" role="img" aria-label="heart">
              💝
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              Browse recipes and click the heart icon to save your favorites here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Find recipes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(({ recipe, rating }) => (
              <div
                key={recipe.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:shadow-sm transition-shadow"
              >
                <Link href={`/recipe/${recipe.id}`} className="flex-1 min-w-0 group">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                    <span>{recipe.difficulty}</span>
                    <span>{recipe.cuisine}</span>
                    <span className="font-semibold text-orange-500">{recipe.nutrition.calories} kcal</span>
                    <span className="font-semibold text-blue-500">{recipe.nutrition.protein}g protein</span>
                  </div>
                </Link>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <RatingStars
                    rating={rating}
                    onRate={(r) => handleRate(recipe.id, r)}
                    size="md"
                  />
                  <SaveButton
                    saved={true}
                    onToggle={() => handleToggleSave(recipe.id)}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Smart Recipe Generator — Built with Next.js, TypeScript &amp; Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
