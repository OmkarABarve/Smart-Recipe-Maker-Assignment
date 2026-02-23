import { NutritionInfo } from "@/types";

interface NutritionLabelProps {
  nutrition: NutritionInfo;
  servings: number;
  adjustedServings?: number;
  layout?: "row" | "grid";
}

export default function NutritionLabel({
  nutrition,
  servings,
  adjustedServings,
  layout = "row",
}: NutritionLabelProps) {
  const scale = adjustedServings ? adjustedServings / servings : 1;

  const items = [
    { label: "Calories", value: Math.round(nutrition.calories * scale), unit: "kcal", color: "text-orange-500" },
    { label: "Protein", value: Math.round(nutrition.protein * scale), unit: "g", color: "text-blue-500" },
    { label: "Carbs", value: Math.round(nutrition.carbs * scale), unit: "g", color: "text-green-500" },
    { label: "Fat", value: Math.round(nutrition.fat * scale), unit: "g", color: "text-yellow-500" },
    { label: "Fiber", value: Math.round(nutrition.fiber * scale), unit: "g", color: "text-purple-500" },
  ];

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-5 gap-3">
        {items.map(({ label, value, unit, color }) => (
          <div
            key={label}
            className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <div className={`text-lg font-bold ${color}`}>
              {value}
              <span className="text-xs font-normal ml-0.5">{unit}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {items.map(({ label, value, unit, color }) => (
        <div key={label} className="flex items-center gap-1 text-sm">
          <span className={`font-semibold ${color}`}>{value}{unit}</span>
          <span className="text-gray-400 dark:text-gray-500">{label}</span>
        </div>
      ))}
      <span className="text-xs text-gray-400 dark:text-gray-500">
        per serving{adjustedServings && adjustedServings !== servings ? " (adjusted)" : ""}
      </span>
    </div>
  );
}
