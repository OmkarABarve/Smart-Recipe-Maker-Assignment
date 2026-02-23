"use client";

import Link from "next/link";
import { RecipeMatch } from "@/types";
import MatchScoreBadge from "./MatchScoreBadge";
import SubstitutionBadge from "./SubstitutionBadge";

interface RecipeCardProps {
  match: RecipeMatch;
}

export default function RecipeCard({ match }: RecipeCardProps) {
  const { recipe, score, matchedIngredients, missingIngredients, substitutions } =
    match;

  const totalTime = recipe.prepTime + recipe.cookTime;
  const { calories, protein } = recipe.nutrition;

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200"
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalTime} min
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                {recipe.servings}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  recipe.difficulty === "easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : recipe.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <MatchScoreBadge score={score} size="md" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {recipe.description}
        </p>

        {/* Nutrition quick view */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="inline-flex items-center gap-1">
            <span className="font-semibold text-orange-500">{calories}</span> kcal
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="font-semibold text-blue-500">{protein}g</span> protein
          </span>
          {recipe.dietaryTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Matched ingredients */}
        {matchedIngredients.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              You have ({matchedIngredients.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {matchedIngredients.map((name) => (
                <span
                  key={name}
                  className="px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded text-xs"
                >
                  ✓ {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing ingredients */}
        {missingIngredients.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Missing ({missingIngredients.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {missingIngredients.map((name) => (
                <span
                  key={name}
                  className="px-2 py-0.5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded text-xs"
                >
                  ✗ {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Substitutions */}
        {substitutions.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Substitutions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {substitutions.map((sub) => (
                <SubstitutionBadge key={sub.missing} substitution={sub} />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {recipe.cuisine}
          </span>
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-400 dark:text-gray-500"
            >
              · {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
