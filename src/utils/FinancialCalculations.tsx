/**
 * Financial Calculations Utility
 *
 * Pure functions for calculating item financial metrics including pricing,
 * margins, and profits. These calculations are used across the application
 * for consistent financial reporting.
 */

/**
 * Input parameters for financial calculations
 */
export type FinancialInputs = {
  /** Total cost of all parts required for the item */
  costOfParts: number;
  /** Shop-wide discount percentage (0-100) */
  discount: number;
  /** Manual list price set by user */
  listPrice: number;
  /** Whether to use manual listPrice instead of calculated price */
  overrideSuggestedListPrice: boolean;
};

/**
 * Calculated financial metrics for an item
 */
export type FinancialCalculations = {
  /** Recommended list price based on cost or user override */
  suggestedListPrice: number;
  /** Final selling price after discount */
  askPrice: number;
  /** Dollar amount of discount applied */
  discountAmount: number;
  /** Percentage profit margin on material cost */
  marginPercent: number;
  /** Dollar amount of profit */
  profitDollars: number;
};

/**
 * Calculate suggested list price for an item
 *
 * Business Rule: List price should be calculated so that material cost
 * represents 30% of the list price (costOfParts / 0.3).
 *
 * @param costOfParts - Total cost of all parts
 * @param listPrice - Manual list price override
 * @param overrideSuggestedListPrice - Whether to use manual override
 * @returns Suggested list price
 *
 * @example
 * // With $100 in parts, suggested price is $333.33
 * calculateSuggestedListPrice(100, 0, false) // => 333.33
 *
 * // With override, uses manual price
 * calculateSuggestedListPrice(100, 500, true) // => 500
 */
export function calculateSuggestedListPrice(
  costOfParts: number,
  listPrice: number,
  overrideSuggestedListPrice: boolean
): number {
  if (overrideSuggestedListPrice) {
    return listPrice;
  }
  return costOfParts / 0.3;
}

/**
 * Calculate ask price (final selling price after discount)
 *
 * @param suggestedListPrice - Base list price
 * @param discount - Discount percentage (0-100)
 * @returns Final asking price
 *
 * @example
 * // 30% discount on $100 item = $70 ask price
 * calculateAskPrice(100, 30) // => 70
 */
export function calculateAskPrice(
  suggestedListPrice: number,
  discount: number
): number {
  return suggestedListPrice * (1 - (discount / 100));
}

/**
 * Calculate dollar amount of discount
 *
 * @param suggestedListPrice - Base list price
 * @param discount - Discount percentage (0-100)
 * @returns Dollar amount discounted
 *
 * @example
 * // 30% discount on $100 item = $30 discount
 * calculateDiscountAmount(100, 30) // => 30
 */
export function calculateDiscountAmount(
  suggestedListPrice: number,
  discount: number
): number {
  return suggestedListPrice * (discount / 100);
}

/**
 * Calculate profit margin as a percentage
 *
 * Formula: ((revenue - cost) / cost) × 100
 *
 * @param askPrice - Final selling price
 * @param costOfParts - Total material cost
 * @returns Margin as a percentage (e.g., 133.33 for 133.33%)
 *
 * @example
 * // Selling for $100 with $50 cost = 100% margin
 * calculateMarginPercent(100, 50) // => 100
 *
 * // Zero cost returns 0 to avoid division by zero
 * calculateMarginPercent(100, 0) // => 0
 */
export function calculateMarginPercent(
  askPrice: number,
  costOfParts: number
): number {
  if (costOfParts === 0) {
    return 0;
  }
  return ((askPrice - costOfParts) / costOfParts) * 100;
}

/**
 * Calculate profit in dollars
 *
 * @param askPrice - Final selling price
 * @param costOfParts - Total material cost
 * @returns Profit amount in dollars
 *
 * @example
 * // Selling for $150 with $100 cost = $50 profit
 * calculateProfitDollars(150, 100) // => 50
 */
export function calculateProfitDollars(
  askPrice: number,
  costOfParts: number
): number {
  return askPrice - costOfParts;
}

/**
 * Calculate all financial metrics for an item
 *
 * This is the main function that orchestrates all individual calculations
 * and returns a complete set of financial metrics.
 *
 * @param inputs - All required input parameters
 * @returns Complete financial calculations
 *
 * @example
 * const financials = calculateItemFinancials({
 *   costOfParts: 100,
 *   discount: 30,
 *   listPrice: 0,
 *   overrideSuggestedListPrice: false
 * });
 * // => {
 * //   suggestedListPrice: 333.33,
 * //   askPrice: 233.33,
 * //   discountAmount: 100,
 * //   marginPercent: 133.33,
 * //   profitDollars: 133.33
 * // }
 */
export function calculateItemFinancials(
  inputs: FinancialInputs
): FinancialCalculations {
  const suggestedListPrice = calculateSuggestedListPrice(
    inputs.costOfParts,
    inputs.listPrice,
    inputs.overrideSuggestedListPrice
  );

  const askPrice = calculateAskPrice(suggestedListPrice, inputs.discount);

  const discountAmount = calculateDiscountAmount(suggestedListPrice, inputs.discount);

  const marginPercent = calculateMarginPercent(askPrice, inputs.costOfParts);

  const profitDollars = calculateProfitDollars(askPrice, inputs.costOfParts);

  return {
    suggestedListPrice,
    askPrice,
    discountAmount,
    marginPercent,
    profitDollars,
  };
}
