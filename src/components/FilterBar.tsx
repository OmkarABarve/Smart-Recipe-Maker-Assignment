"use client";

import { FilterState, DietaryTag, DEFAULT_FILTERS } from "@/types";
import { getAllCuisines } from "@/data/recipes";
import { useMemo, useState } from "react";

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const DIETARY_OPTIONS: { value: DietaryTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "nut-free", label: "Nut-Free" },
  { value: "low-carb", label: "Low-Carb" },
  { value: "high-protein", label: "High-Protein" },
];

const DIFFICULTY_OPTIONS: { value: "easy" | "medium" | "hard"; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const TIME_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Any time" },
  { value: 15, label: "≤ 15 min" },
  { value: 30, label: "≤ 30 min" },
  { value: 45, label: "≤ 45 min" },
  { value: 60, label: "≤ 1 hour" },
];

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const cuisines = useMemo(() => getAllCuisines(), []);

  const activeCount =
    filters.dietary.length +
    filters.difficulty.length +
    filters.cuisine.length +
    (filters.maxTime !== null ? 1 : 0);

  const toggleDietary = (tag: DietaryTag) => {
    const next = filters.dietary.includes(tag)
      ? filters.dietary.filter((t) => t !== tag)
      : [...filters.dietary, tag];
    onFiltersChange({ ...filters, dietary: next });
  };

  const toggleDifficulty = (d: "easy" | "medium" | "hard") => {
    const next = filters.difficulty.includes(d)
      ? filters.difficulty.filter((x) => x !== d)
      : [...filters.difficulty, d];
    onFiltersChange({ ...filters, difficulty: next });
  };

  const toggleCuisine = (c: string) => {
    const next = filters.cuisine.includes(c)
      ? filters.cuisine.filter((x) => x !== c)
      : [...filters.cuisine, c];
    onFiltersChange({ ...filters, cuisine: next });
  };

  const setMaxTime = (t: number | null) => {
    onFiltersChange({ ...filters, maxTime: t });
  };

  const clearAll = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  return (
    <div className="w-full">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-brand-500 text-white rounded-full text-xs font-bold">
            {activeCount}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter panel */}
      {open && (
        <div className="mt-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm space-y-5">
          {/* Dietary Preferences */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Dietary Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleDietary(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.dietary.includes(value)
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Difficulty
            </h3>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleDifficulty(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.difficulty.includes(value)
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Time */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Total Cooking Time
            </h3>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setMaxTime(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.maxTime === value
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Cuisine
            </h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.cuisine.includes(c)
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
