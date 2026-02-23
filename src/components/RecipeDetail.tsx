"use client";

import { Recipe } from "@/types";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import ServingAdjuster from "./ServingAdjuster";
import NutritionLabel from "./NutritionLabel";
import RatingStars from "./RatingStars";
import SaveButton from "./SaveButton";
import { getRating, setRating as persistRating } from "@/lib/favorites";
import { isSaved, toggleSaved } from "@/lib/favorites";
import { scaleAmount } from "@/lib/scale";
import {
  classifyIngredient,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "@/lib/classify";

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const [servings, setServings] = useState(recipe.servings);
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  // Hydrate client-only state after mount
  useEffect(() => {
    setRating(getRating(recipe.id));
    setSaved(isSaved(recipe.id));
  }, [recipe.id]);

  const handleRate = useCallback(
    (r: number) => {
      setRating(r);
      persistRating(recipe.id, r);
    },
    [recipe.id]
  );

  const handleToggleSave = useCallback(() => {
    const nowSaved = toggleSaved(recipe.id);
    setSaved(nowSaved);
  }, [recipe.id]);

  const scale = servings / recipe.servings;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to recipes
      </Link>

      {/* Title & meta */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {recipe.title}
          </h1>
          <SaveButton saved={saved} onToggle={handleToggleSave} />
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {recipe.description}
        </p>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong className="text-gray-900 dark:text-white">{totalTime}</strong> min total
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
            </svg>
            <span>
              Prep <strong className="text-gray-900 dark:text-white">{recipe.prepTime}</strong> min
              · Cook <strong className="text-gray-900 dark:text-white">{recipe.cookTime}</strong> min
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              recipe.difficulty === "easy"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : recipe.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            }`}
          >
            {recipe.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {recipe.cuisine}
          </span>
        </div>

        {/* Dietary tags */}
        {recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recipe.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Your rating:</span>
          <RatingStars rating={rating} onRate={handleRate} size="lg" />
        </div>
      </header>

      {/* Nutrition */}
      <section className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Nutritional Information (per serving)
        </h2>
        <NutritionLabel
          nutrition={recipe.nutrition}
          servings={recipe.servings}
          adjustedServings={servings}
          layout="grid"
        />
      </section>

      {/* Serving adjuster */}
      <section className="mb-6">
        <ServingAdjuster
          baseServings={recipe.servings}
          servings={servings}
          onChange={setServings}
        />
      </section>

      {/* Two-column: Ingredients & Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ingredients
            {scale !== 1 && (
              <span className="text-xs font-normal text-brand-500 ml-1">
                (×{Math.round(scale * 10) / 10})
              </span>
            )}
          </h2>
          <ul className="space-y-2.5">
            {recipe.ingredients.map((ing, idx) => {
              const category = classifyIngredient(ing.name);
              return (
                <li
                  key={idx}
                  className={`flex items-start gap-2 text-sm ${
                    ing.optional
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-400 dark:bg-brand-500 flex-shrink-0" />
                  <span className="flex-1">
                    <span className="font-medium">{scaleAmount(ing.amount, scale)}</span>{" "}
                    {ing.name}
                    <span
                      className={`ml-1.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium leading-none align-middle ${CATEGORY_COLORS[category]}`}
                      title={CATEGORY_LABELS[category]}
                    >
                      {CATEGORY_LABELS[category]}
                    </span>
                    {ing.optional && (
                      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 italic">
                        (optional)
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instructions
          </h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 pt-1.5 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
