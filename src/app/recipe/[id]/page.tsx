import { notFound } from "next/navigation";
import { getRecipeById } from "@/lib/matching";
import { recipes } from "@/data/recipes";
import Header from "@/components/Header";
import RecipeDetail from "@/components/RecipeDetail";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

// Generate static paths for all recipes
export function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: recipe.id,
  }));
}

// Generate metadata for each recipe page
export async function generateMetadata({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) {
    return { title: "Recipe Not Found" };
  }
  return {
    title: `${recipe.title} — Smart Recipe Generator`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <RecipeDetail recipe={recipe} />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Smart Recipe Generator — Built with Next.js, TypeScript &amp; Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
