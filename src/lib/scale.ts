/**
 * Scales an ingredient amount string by a multiplier.
 *
 * Handles patterns like:
 *   "2 cups" → "4 cups"
 *   "1/2 cup" → "1 cup"
 *   "1.5 cups" → "3 cups"
 *   "to taste" → "to taste" (unchanged)
 *   "for serving" → "for serving" (unchanged)
 */
export function scaleAmount(amount: string, multiplier: number): string {
  if (multiplier === 1) return amount;

  // Don't scale non-numeric amounts
  if (/^(to taste|for serving|for topping|for garnish|for drizzling|for frying|pinch)/i.test(amount)) {
    return amount;
  }

  // Match leading number: integer, decimal, fraction, or mixed
  return amount.replace(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)/,
    (match) => {
      const value = parseFraction(match);
      const scaled = value * multiplier;
      return formatNumber(scaled);
    }
  );
}

function parseFraction(str: string): number {
  str = str.trim();

  // Mixed number: "1 1/2"
  const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    return parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]);
  }

  // Simple fraction: "1/2"
  const fracMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    return parseInt(fracMatch[1]) / parseInt(fracMatch[2]);
  }

  // Decimal or integer
  return parseFloat(str) || 0;
}

function formatNumber(n: number): string {
  // Show clean integers
  if (Number.isInteger(n)) return n.toString();

  // Common fractions
  const frac = n % 1;
  const whole = Math.floor(n);

  const FRACTIONS: [number, string][] = [
    [0.25, "1/4"],
    [0.333, "1/3"],
    [0.5, "1/2"],
    [0.667, "2/3"],
    [0.75, "3/4"],
  ];

  for (const [val, repr] of FRACTIONS) {
    if (Math.abs(frac - val) < 0.05) {
      return whole > 0 ? `${whole} ${repr}` : repr;
    }
  }

  // Otherwise round to one decimal
  return Math.round(n * 10) / 10 + "";
}
