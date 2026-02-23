# Smart Recipe Generator
Link:https://smart-recipe-maker-assignment-submi.vercel.app/
A modern web app that matches recipes to the ingredients you already have, with smart substitution suggestions for anything you're missing.

## Features

- **Ingredient recognition from images** — Upload a photo of your fridge or ingredients and AI (Google Gemini 2.0 Flash) identifies them automatically. Recognized ingredients appear as selectable chips you can accept/reject before adding. *(Requires free `GEMINI_API_KEY`)*
- **Ingredient-based recipe matching** — Enter your available ingredients and get ranked results scored by match percentage.
- **Smart substitution suggestions** — Missing an ingredient? The app suggests swaps you can make from what you already have (e.g., use yogurt instead of sour cream). 70+ curated substitution pairs with similarity scores.
- **Ingredient classification** — Every ingredient is auto-classified into categories (Protein, Dairy, Vegetable, Fruit, Grain, Spice, Condiment) with color-coded badges on the recipe detail page.
- **Dietary restrictions handling** — Filter recipes by 7 dietary tags (vegetarian, vegan, gluten-free, dairy-free, nut-free, low-carb, high-protein), difficulty level, cooking time, and cuisine.
- **Autocomplete ingredient input** — Tag-style input with debounced suggestions from the recipe dataset, plus full keyboard navigation.
- **Nutritional information** — Every recipe shows calories, protein, carbs, fat, and fiber per serving, with automatic scaling when adjusting servings.
- **Serving size adjustment** — Scale ingredient amounts up or down with a single click. Supports fractions and mixed numbers.
- **Star ratings & favorites** — Rate recipes (1-5 stars) and save your favorites. Data persists in localStorage.
- **Personalized suggestions** — The home page suggests recipes based on your highly-rated cuisines and tags.
- **47 curated recipes** — Spanning Italian, Mexican, Asian, Indian, American, Mediterranean, French, Thai, Middle Eastern, Japanese, Korean, and Spanish cuisines.
- **Error handling** — Error boundaries at root and recipe-page level, custom 404 page, graceful API failure messages, and localStorage try/catch guards.
- **Loading states** — Skeleton loading UI for recipe pages and animated spinners during image recognition.
- **Responsive design** — Works great on mobile, tablet, and desktop.
- **Dark mode** — Automatic (system preference) with a manual toggle.

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Next.js 14 (App Router)             |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS 3.4                    |
| State         | React useState + useMemo            |
| Persistence   | localStorage (ratings & favorites)  |
| Data          | Static local dataset (47 recipes)   |
| AI/ML         | Google Gemini 2.0 Flash (free tier) |
| Deployment    | Vercel                              |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- (Optional) A free Google Gemini API key for image-based ingredient recognition

### Installation

```bash
git clone https://github.com/OmkarABarve/Smart-Recipe-Maker-Assignment.git
cd Smart-Recipe-Maker-Assignment
npm install
```

### Environment Variables (optional)

The app works fully without any API key — all recipe data is local. Only the **"Scan Ingredients from Photo"** feature requires it.

To enable image recognition, copy the example file and add your key:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
GEMINI_API_KEY=your_api_key_here
```

Get a free API key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (metadata, dark-mode script)
│   ├── page.tsx                # Home page (ingredient input + image upload + results)
│   ├── error.tsx               # Root error boundary
│   ├── not-found.tsx           # Custom 404 page
│   ├── globals.css             # Tailwind directives + custom tokens
│   ├── favorites/page.tsx      # Saved recipes page
│   ├── api/recognize/route.ts  # Gemini Vision API route for image recognition
│   └── recipe/[id]/
│       ├── page.tsx            # Recipe detail page (SSG)
│       ├── loading.tsx         # Skeleton loading UI
│       └── error.tsx           # Recipe error boundary
├── components/
│   ├── IngredientInput.tsx     # Tag-style input with debounced autocomplete
│   ├── ImageUpload.tsx         # Drag-and-drop image upload with AI recognition
│   ├── FilterBar.tsx           # Dietary, difficulty, time, cuisine filters
│   ├── RecipeCard.tsx          # Result card with score, matched/missing pills
│   ├── RecipeDetail.tsx        # Full recipe view with ingredient classification
│   ├── SubstitutionBadge.tsx   # "Swap X → Y" chip
│   ├── MatchScoreBadge.tsx     # Circular score percentage badge
│   ├── NutritionLabel.tsx      # Nutritional info display (row or grid)
│   ├── ServingAdjuster.tsx     # Serving size +/- controls
│   ├── RatingStars.tsx         # 1-5 star rating component
│   ├── SaveButton.tsx          # Heart-style favorite toggle
│   ├── LoadingSpinner.tsx      # Reusable spinner component
│   ├── Header.tsx              # App header with dark mode toggle
│   └── EmptyState.tsx          # Onboarding + no-results states
├── lib/
│   ├── matching.ts             # Scoring algorithm (pure functions)
│   ├── substitutions.ts        # Substitution map + lookup logic (70+ pairs)
│   ├── normalize.ts            # Ingredient text normalization (5-step pipeline)
│   ├── classify.ts             # Ingredient category classification (8 categories)
│   ├── constants.ts            # App-wide configuration
│   ├── favorites.ts            # localStorage persistence (ratings, saves)
│   └── scale.ts                # Ingredient amount scaling (fractions, mixed numbers)
├── data/
│   └── recipes.ts              # Curated recipe dataset (47 recipes, 12 cuisines)
└── types/
    └── index.ts                # TypeScript interfaces & filter types
```

## How the Matching Algorithm Works

For each recipe, the algorithm:

1. **Normalizes** all user ingredients (lowercase, strip plurals, resolve aliases).
2. **Compares** each required recipe ingredient against the user's list.
3. **Finds substitutions** for missing ingredients from what the user has.
4. **Scores** the recipe:

```
baseScore = (matchedCount / requiredCount) × 100
substitutionBonus = Σ(similarity × 0.6) / requiredCount × 100
finalScore = clamp(baseScore + substitutionBonus, 0, 100)
```

- Only required (non-optional) ingredients count toward the score.
- Substitutions count at 60% of a direct match, weighted by similarity.
- Results are sorted by score descending, capped at 20, with a 10% minimum threshold.

## Normalization Pipeline

User input goes through a 5-step normalization pipeline before matching:

1. **Lowercase** — `"Fresh Garlic"` → `"fresh garlic"`
2. **Trim whitespace** — `"  garlic  "` → `"garlic"`
3. **Strip qualifiers** — `"fresh garlic"` → `"garlic"` (removes "fresh", "dried", "frozen", "chopped", etc.)
4. **Depluralize** — `"tomatoes"` → `"tomato"` (handles irregular plurals)
5. **Resolve aliases** — `"capsicum"` → `"bell pepper"`, `"aubergine"` → `"eggplant"`

## Substitution System

The app includes a curated map of 70+ ingredient substitutions with similarity scores (0-1):

- **Dairy**: butter → margarine (0.9), milk → oat milk (0.85)
- **Proteins**: chicken breast → turkey breast (0.8), ground beef → ground turkey (0.85)
- **Grains**: spaghetti → linguine (0.9), rice → quinoa (0.75)
- **Herbs**: cilantro → parsley (0.7), oregano → thyme (0.7)

When a recipe requires an ingredient you don't have, the system checks if any of your ingredients can substitute for it.

## Ingredient Recognition from Images

The app uses **Google Gemini 2.0 Flash** (free tier) for image-based ingredient recognition:

1. User uploads a photo via drag-and-drop or file picker (JPG, PNG, WebP up to 5 MB).
2. The image is sent as base64 to the `/api/recognize` Next.js API route.
3. The server calls Gemini with a structured prompt requesting a JSON array of ingredient names.
4. The response is parsed and returned to the client.
5. Recognized ingredients appear as selectable chips — the user confirms which to add.

Error handling covers: no food detected, API rate limits (429), invalid file types, oversized files, network failures, and malformed API responses.

## Ingredient Classification

Each ingredient is automatically classified into one of 8 categories using a keyword-based classifier (`src/lib/classify.ts`):

| Category  | Color  | Examples                          |
|-----------|--------|-----------------------------------|
| Protein   | Red    | chicken breast, egg, tofu, salmon |
| Dairy     | Blue   | milk, cheddar cheese, yogurt      |
| Vegetable | Green  | garlic, onion, broccoli, spinach  |
| Fruit     | Orange | avocado, lemon, banana            |
| Grain     | Amber  | rice, flour, pasta, bread         |
| Spice     | Purple | cumin, basil, garam masala        |
| Condiment | Yellow | soy sauce, olive oil, honey       |
| Other     | Gray   | broth, chickpea, peanut           |

Color-coded category badges appear next to each ingredient on the recipe detail page.

## Error Handling

| Layer | Mechanism | File |
|-------|-----------|------|
| Root app | React Error Boundary | `src/app/error.tsx` |
| Recipe page | React Error Boundary | `src/app/recipe/[id]/error.tsx` |
| Missing routes | Custom 404 page | `src/app/not-found.tsx` |
| Invalid recipe ID | `notFound()` redirect | `src/app/recipe/[id]/page.tsx` |
| localStorage | try/catch fallback | `src/lib/favorites.ts` |
| Image upload | Inline error messages | `src/components/ImageUpload.tsx` |
| API route | HTTP status codes (400, 429, 500, 502) | `src/app/api/recognize/route.ts` |

## Loading States

- **Recipe page** — Skeleton UI with pulsing placeholder blocks (`src/app/recipe/[id]/loading.tsx`)
- **Image recognition** — Spinner animation with "Analyzing image..." text while API processes
- **Reusable spinner** — `LoadingSpinner` component with sm/md/lg sizes

## Deployment

### Vercel (recommended)

1. Push to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework preset: **Next.js** (auto-detected).
4. Add the `GEMINI_API_KEY` environment variable in Vercel project settings (for image recognition).
5. Deploy.

No database required. All recipe data is bundled at build time.

## License

MIT
