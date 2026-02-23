interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SIZES = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export default function LoadingSpinner({
  size = "md",
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`${SIZES[size]} border-brand-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
    </div>
  );
}
