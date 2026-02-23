"use client";

interface ServingAdjusterProps {
  baseServings: number;
  servings: number;
  onChange: (servings: number) => void;
}

export default function ServingAdjuster({
  baseServings,
  servings,
  onChange,
}: ServingAdjusterProps) {
  const decrease = () => {
    if (servings > 1) onChange(servings - 1);
  };
  const increase = () => {
    if (servings < 20) onChange(servings + 1);
  };
  const reset = () => onChange(baseServings);

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Servings:</span>
      <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={decrease}
          disabled={servings <= 1}
          className="px-2.5 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease servings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="px-3 py-1 text-sm font-bold text-gray-900 dark:text-white min-w-[2.5rem] text-center">
          {servings}
        </span>
        <button
          onClick={increase}
          disabled={servings >= 20}
          className="px-2.5 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase servings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      {servings !== baseServings && (
        <button
          onClick={reset}
          className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
        >
          Reset
        </button>
      )}
    </div>
  );
}
