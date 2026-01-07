import { useMemo, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  calculateItemFinancials,
  FinancialCalculations,
} from '@/utils/FinancialCalculations';
import { Item } from '@/components/items/Item';

/**
 * Parameters for the useItemFinancials hook
 */
export type UseItemFinancialsParams = {
  /** The item to calculate financials for */
  item: Item;
  /** Total cost of all parts required for the item */
  costOfParts: number;
};

/**
 * Return type for the useItemFinancials hook
 * Includes all financial calculations plus the discount rate
 */
export type UseItemFinancialsResult = FinancialCalculations & {
  /** Shop-wide discount percentage from Redux store */
  discount: number;
  /** Cost of parts (included for convenience) */
  costOfParts: number;
};

/**
 * Custom hook for calculating item financial metrics
 *
 * This hook:
 * - Retrieves the shop discount from Redux store
 * - Calculates all financial metrics using pure utility functions
 * - Memoizes calculations for performance
 * - Optionally calls a callback when suggested list price changes
 *
 * @param params - Item and cost of parts
 * @param onSuggestedListPriceChange - Optional callback for price changes
 * @returns All financial calculations plus discount and cost
 *
 * @example
 * const financials = useItemFinancials(
 *   { item, costOfParts: 100 },
 *   (price) => console.log('New price:', price)
 * );
 * // Access: financials.askPrice, financials.marginPercent, etc.
 */
export function useItemFinancials(
  params: UseItemFinancialsParams,
  onSuggestedListPriceChange?: (price: number) => void
): UseItemFinancialsResult {
  // Get discount from Redux store
  const discount = useAppSelector((state) => state.shop.discount);

  // Calculate all financials with memoization
  // Only recalculates when dependencies change
  const calculations = useMemo(() => {
    return calculateItemFinancials({
      costOfParts: params.costOfParts,
      discount,
      listPrice: params.item.listPrice,
      overrideSuggestedListPrice: params.item.overrideSuggestedListPrice,
    });
  }, [
    params.costOfParts,
    params.item.listPrice,
    params.item.overrideSuggestedListPrice,
    discount,
  ]);

  // Call callback when suggestedListPrice changes
  // This maintains backward compatibility with existing component behavior
  useEffect(() => {
    if (onSuggestedListPriceChange) {
      onSuggestedListPriceChange(calculations.suggestedListPrice);
    }
  }, [calculations.suggestedListPrice, onSuggestedListPriceChange]);

  return {
    ...calculations,
    discount,
    costOfParts: params.costOfParts,
  };
}
