import { describe, it, expect } from 'vitest'
import {
  calculateSuggestedListPrice,
  calculateAskPrice,
  calculateDiscountAmount,
  calculateMarginPercent,
  calculateProfitDollars,
  calculateItemFinancials,
} from './FinancialCalculations'

describe('calculateSuggestedListPrice', () => {
  it('returns cost divided by 0.3 when override is off', () => {
    expect(calculateSuggestedListPrice(100, 0, false)).toBeCloseTo(333.33, 2)
  })

  it('returns the manual list price when override is on', () => {
    expect(calculateSuggestedListPrice(100, 500, true)).toBeCloseTo(500, 2)
  })

  it('returns 0 when cost is 0 and override is off', () => {
    expect(calculateSuggestedListPrice(0, 0, false)).toBeCloseTo(0, 2)
  })

  it('returns the manual list price even when cost is non-zero and override is on', () => {
    expect(calculateSuggestedListPrice(200, 750, true)).toBeCloseTo(750, 2)
  })
})

describe('calculateAskPrice', () => {
  it('returns list price minus the discount amount', () => {
    expect(calculateAskPrice(100, 30)).toBeCloseTo(70, 2)
  })

  it('returns full list price when discount is 0', () => {
    expect(calculateAskPrice(100, 0)).toBeCloseTo(100, 2)
  })

  it('returns 0 when discount is 100%', () => {
    expect(calculateAskPrice(100, 100)).toBeCloseTo(0, 2)
  })

  it('handles fractional discount percentages correctly', () => {
    expect(calculateAskPrice(200, 15)).toBeCloseTo(170, 2)
  })
})

describe('calculateDiscountAmount', () => {
  it('returns the dollar value of a 30% discount on a $100 item', () => {
    expect(calculateDiscountAmount(100, 30)).toBeCloseTo(30, 2)
  })

  it('returns 0 when discount is 0', () => {
    expect(calculateDiscountAmount(100, 0)).toBeCloseTo(0, 2)
  })

  it('returns the full list price when discount is 100%', () => {
    expect(calculateDiscountAmount(100, 100)).toBeCloseTo(100, 2)
  })

  it('handles fractional discount percentages correctly', () => {
    expect(calculateDiscountAmount(200, 15)).toBeCloseTo(30, 2)
  })
})

describe('calculateMarginPercent', () => {
  it('returns 100% margin when revenue is double the cost', () => {
    expect(calculateMarginPercent(100, 50)).toBeCloseTo(100, 2)
  })

  it('returns 0 when costOfParts is 0 — divide-by-zero guard', () => {
    // This explicit test locks in the guard that prevents NaN/Infinity
    // when there are no parts costs.
    expect(calculateMarginPercent(100, 0)).toBeCloseTo(0, 2)
  })

  it('returns 0% margin when ask price equals cost', () => {
    expect(calculateMarginPercent(50, 50)).toBeCloseTo(0, 2)
  })

  it('returns a negative margin when selling below cost', () => {
    expect(calculateMarginPercent(40, 50)).toBeCloseTo(-20, 2)
  })

  it('returns 133.33% margin for the JSDoc worked example', () => {
    // From JSDoc: selling at $233.33 with $100 cost
    expect(calculateMarginPercent(233.33, 100)).toBeCloseTo(133.33, 2)
  })
})

describe('calculateProfitDollars', () => {
  it('returns the difference between ask price and cost', () => {
    expect(calculateProfitDollars(150, 100)).toBeCloseTo(50, 2)
  })

  it('returns 0 when ask price equals cost', () => {
    expect(calculateProfitDollars(100, 100)).toBeCloseTo(0, 2)
  })

  it('returns a negative number when selling below cost', () => {
    expect(calculateProfitDollars(80, 100)).toBeCloseTo(-20, 2)
  })
})

describe('calculateItemFinancials', () => {
  it('computes all metrics correctly for the JSDoc worked example (override=false)', () => {
    // JSDoc example: costOfParts=100, discount=30, listPrice=0, override=false
    // => suggestedListPrice=333.33, askPrice=233.33, discountAmount=100,
    //    marginPercent=133.33, profitDollars=133.33
    const result = calculateItemFinancials({
      costOfParts: 100,
      discount: 30,
      listPrice: 0,
      overrideSuggestedListPrice: false,
    })
    expect(result.suggestedListPrice).toBeCloseTo(333.33, 2)
    expect(result.askPrice).toBeCloseTo(233.33, 2)
    expect(result.discountAmount).toBeCloseTo(100, 2)
    expect(result.marginPercent).toBeCloseTo(133.33, 2)
    expect(result.profitDollars).toBeCloseTo(133.33, 2)
  })

  it('uses the manual list price when override=true', () => {
    const result = calculateItemFinancials({
      costOfParts: 100,
      discount: 10,
      listPrice: 500,
      overrideSuggestedListPrice: true,
    })
    // suggestedListPrice should be the manual override (500)
    expect(result.suggestedListPrice).toBeCloseTo(500, 2)
    // askPrice = 500 * (1 - 10/100) = 450
    expect(result.askPrice).toBeCloseTo(450, 2)
    // discountAmount = 500 * 0.10 = 50
    expect(result.discountAmount).toBeCloseTo(50, 2)
    // marginPercent = ((450 - 100) / 100) * 100 = 350
    expect(result.marginPercent).toBeCloseTo(350, 2)
    // profitDollars = 450 - 100 = 350
    expect(result.profitDollars).toBeCloseTo(350, 2)
  })

  it('handles zero cost of parts without NaN or Infinity', () => {
    const result = calculateItemFinancials({
      costOfParts: 0,
      discount: 0,
      listPrice: 0,
      overrideSuggestedListPrice: false,
    })
    expect(result.marginPercent).toBeCloseTo(0, 2)
    expect(isNaN(result.marginPercent)).toBe(false)
    expect(isFinite(result.marginPercent)).toBe(true)
  })

  it('computes a zero-discount scenario correctly', () => {
    const result = calculateItemFinancials({
      costOfParts: 60,
      discount: 0,
      listPrice: 0,
      overrideSuggestedListPrice: false,
    })
    // suggestedListPrice = 60 / 0.3 = 200
    expect(result.suggestedListPrice).toBeCloseTo(200, 2)
    // askPrice = 200 (no discount)
    expect(result.askPrice).toBeCloseTo(200, 2)
    // discountAmount = 0
    expect(result.discountAmount).toBeCloseTo(0, 2)
    // marginPercent = ((200 - 60) / 60) * 100 = 233.33
    expect(result.marginPercent).toBeCloseTo(233.33, 2)
    // profitDollars = 200 - 60 = 140
    expect(result.profitDollars).toBeCloseTo(140, 2)
  })
})
