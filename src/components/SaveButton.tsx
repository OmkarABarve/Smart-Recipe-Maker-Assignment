"use client";

interface SaveButtonProps {
  saved: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export default function SaveButton({ saved, onToggle, size = "md" }: SaveButtonProps) {
  const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 transition-colors focus:outline-none ${
        saved
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400"
      }`}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      title={saved ? "Remove from favorites" : "Save to favorites"}
    >
      <svg
        className={`${iconSize} transition-transform ${saved ? "scale-110" : ""}`}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={saved ? 0 : 1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {size === "md" && (
        <span className="text-sm font-medium">
          {saved ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
