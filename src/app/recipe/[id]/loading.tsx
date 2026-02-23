import Header from "@/components/Header";

export default function RecipeLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto animate-pulse">
          {/* Back link skeleton */}
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded mb-6" />

          {/* Title skeleton */}
          <div className="h-9 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg mb-3" />
          <div className="h-5 w-full bg-gray-100 dark:bg-gray-800/60 rounded mb-2" />
          <div className="h-5 w-2/3 bg-gray-100 dark:bg-gray-800/60 rounded mb-6" />

          {/* Meta bar skeleton */}
          <div className="flex gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg"
              />
            ))}
          </div>

          {/* Nutrition skeleton */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8">
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center p-3">
                  <div className="h-6 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                  <div className="h-3 w-10 mx-auto bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Two-column skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-3">
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-100 dark:bg-gray-800/60 rounded"
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
              ))}
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800/60 rounded w-full" />
                    <div className="h-4 bg-gray-100 dark:bg-gray-800/60 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
