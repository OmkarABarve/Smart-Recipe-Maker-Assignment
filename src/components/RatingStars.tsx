"use client";

import { useState, useCallback } from "react";

interface RatingStarsProps {
  rating: number;         // current rating (0 = unrated)
  onRate: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function RatingStars({
  rating,
  onRate,
  size = "md",
  readonly = false,
}: RatingStarsProps) {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const sizeClass = SIZES[size];

  const getStarClass = useCallback(
    (index: number) => {
      const active = hoverIndex >= 0 ? index <= hoverIndex : index < rating;
      return active
        ? "text-yellow-400 fill-yellow-400"
        : "text-gray-300 dark:text-gray-600";
    },
    [hoverIndex, rating]
  );

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="group"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => {
            if (!readonly) {
              // Click same star to clear
              onRate(rating === i + 1 ? 0 : i + 1);
            }
          }}
          onMouseEnter={() => !readonly && setHoverIndex(i)}
          onMouseLeave={() => !readonly && setHoverIndex(-1)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform focus:outline-none`}
          aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
        >
          <svg
            className={`${sizeClass} ${getStarClass(i)} transition-colors`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          {rating}/5
        </span>
      )}
    </div>
  );
}
