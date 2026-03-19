import { describe, it, expect } from 'vitest'
import { usdFormatter, formatPercent } from './FormatUtils'

describe('usdFormatter', () => {
  it('formats zero as $0.00', () => {
    expect(usdFormatter.format(0)).toBe('$0.00')
  })

  it('formats a whole number with two decimal places', () => {
    expect(usdFormatter.format(100)).toBe('$100.00')
  })

  it('formats a value with cents', () => {
    expect(usdFormatter.format(1234.5)).toBe('$1,234.50')
  })

  it('includes thousands separator for large values', () => {
    expect(usdFormatter.format(1000)).toBe('$1,000.00')
  })

  it('formats negative values with a leading minus sign', () => {
    expect(usdFormatter.format(-50)).toBe('-$50.00')
  })

  it('rounds to two decimal places', () => {
    // 1.005 should round to $1.01 (banker's rounding may apply, so we accept $1.00 or $1.01)
    const result = usdFormatter.format(1.555)
    expect(result).toMatch(/^\$1\.5[56]$/)
  })

  it('formats a typical item price', () => {
    expect(usdFormatter.format(333.33)).toBe('$333.33')
  })
})

describe('formatPercent', () => {
  it('converts 0.5 to "50%"', () => {
    // formatPercent multiplies the input by 100 before appending "%"
    // so a decimal fraction like 0.5 becomes "50%", not "0.5%"
    expect(formatPercent(0.5)).toBe('50%')
  })

  it('converts 1 to "100%"', () => {
    expect(formatPercent(1)).toBe('100%')
  })

  it('converts 0 to "0%"', () => {
    expect(formatPercent(0)).toBe('0%')
  })

  it('converts 0.333 to "33%" — rounds down to nearest integer', () => {
    // The input is multiplied by 100 (0.333 * 100 = 33.3), then toFixed(0) rounds it
    expect(formatPercent(0.333)).toBe('33%')
  })

  it('multiplies the value by 100 before formatting — not a pass-through', () => {
    // IMPORTANT: formatPercent(x) is NOT `${x}%`. It computes `${(x * 100).toFixed(0)}%`.
    // A value of 0.25 must come out as "25%", not "0%".
    expect(formatPercent(0.25)).toBe('25%')
  })

  it('handles values greater than 1 (e.g. 133% margin)', () => {
    expect(formatPercent(1.333)).toBe('133%')
  })
})
