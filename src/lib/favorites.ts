/**
 * localStorage-based persistence for user ratings and saved (favorite) recipes.
 *
 * Keys:
 *   "srg_ratings"  → Record<recipeId, { rating, timestamp }>
 *   "srg_saved"    → Record<recipeId, { savedAt }>
 */

import { UserRating, SavedRecipe } from "@/types";

// ── Storage keys ───────────────────────────────────────────

const RATINGS_KEY = "srg_ratings";
const SAVED_KEY = "srg_saved";

// ── Generic helpers ────────────────────────────────────────

function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Ratings ────────────────────────────────────────────────

type RatingsMap = Record<string, { rating: number; timestamp: number }>;

export function getRating(recipeId: string): number {
  const map = getJSON<RatingsMap>(RATINGS_KEY, {});
  return map[recipeId]?.rating ?? 0;
}

export function getAllRatings(): UserRating[] {
  const map = getJSON<RatingsMap>(RATINGS_KEY, {});
  return Object.entries(map).map(([recipeId, data]) => ({
    recipeId,
    rating: data.rating,
    timestamp: data.timestamp,
  }));
}

export function setRating(recipeId: string, rating: number): void {
  const map = getJSON<RatingsMap>(RATINGS_KEY, {});
  if (rating <= 0) {
    delete map[recipeId];
  } else {
    map[recipeId] = { rating: Math.min(5, Math.max(1, rating)), timestamp: Date.now() };
  }
  setJSON(RATINGS_KEY, map);
}

// ── Saved / Favorites ──────────────────────────────────────

type SavedMap = Record<string, { savedAt: number }>;

export function isSaved(recipeId: string): boolean {
  const map = getJSON<SavedMap>(SAVED_KEY, {});
  return !!map[recipeId];
}

export function getAllSaved(): SavedRecipe[] {
  const map = getJSON<SavedMap>(SAVED_KEY, {});
  return Object.entries(map)
    .map(([recipeId, data]) => ({ recipeId, savedAt: data.savedAt }))
    .sort((a, b) => b.savedAt - a.savedAt); // most recent first
}

export function toggleSaved(recipeId: string): boolean {
  const map = getJSON<SavedMap>(SAVED_KEY, {});
  if (map[recipeId]) {
    delete map[recipeId];
    setJSON(SAVED_KEY, map);
    return false; // now unsaved
  } else {
    map[recipeId] = { savedAt: Date.now() };
    setJSON(SAVED_KEY, map);
    return true; // now saved
  }
}

// ── Suggestions ────────────────────────────────────────────

/**
 * Returns recipe IDs that the user has rated highly (>= 4 stars),
 * sorted by rating descending, then timestamp descending.
 */
export function getTopRatedIds(): string[] {
  return getAllRatings()
    .filter((r) => r.rating >= 4)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.timestamp - a.timestamp;
    })
    .map((r) => r.recipeId);
}
