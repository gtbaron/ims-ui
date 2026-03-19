import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSortableTable } from './useSortableTable'

interface Person {
  name: string
  age: number
}

interface NullableRow {
  name: string | null | undefined
}

describe('useSortableTable', () => {
  describe('initial state', () => {
    it('has sortConfig {key: null, order: "asc"} when no default key is provided', () => {
      const data: Person[] = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
      const { result } = renderHook(() => useSortableTable(data))
      expect(result.current.sortConfig).toEqual({ key: null, order: 'asc' })
    })

    it('returns the input data unsorted when no default key is provided', () => {
      const data: Person[] = [{ name: 'Charlie', age: 40 }, { name: 'Alice', age: 30 }]
      const { result } = renderHook(() => useSortableTable(data))
      expect(result.current.sortedData).toEqual(data)
    })
  })

  describe('default sort key and order', () => {
    it('sorts immediately by the given default key ascending', () => {
      const data: Person[] = [
        { name: 'Charlie', age: 40 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const { result } = renderHook(() => useSortableTable(data, 'name'))
      expect(result.current.sortConfig).toEqual({ key: 'name', order: 'asc' })
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })
  })

  describe('handleSort', () => {
    it('first click on a column sets key and order="asc", data sorted ascending', () => {
      const data: Person[] = [
        { name: 'Charlie', age: 40 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const { result } = renderHook(() => useSortableTable(data))

      act(() => {
        result.current.handleSort('name')
      })

      expect(result.current.sortConfig).toEqual({ key: 'name', order: 'asc' })
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('second click on the same column toggles order to "desc", data sorted descending', () => {
      const data: Person[] = [
        { name: 'Charlie', age: 40 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const { result } = renderHook(() => useSortableTable(data))

      act(() => { result.current.handleSort('name') })
      act(() => { result.current.handleSort('name') })

      expect(result.current.sortConfig).toEqual({ key: 'name', order: 'desc' })
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['Charlie', 'Bob', 'Alice'])
    })

    it('third click on the same column toggles order back to "asc"', () => {
      const data: Person[] = [
        { name: 'Charlie', age: 40 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const { result } = renderHook(() => useSortableTable(data))

      act(() => { result.current.handleSort('name') })
      act(() => { result.current.handleSort('name') })
      act(() => { result.current.handleSort('name') })

      expect(result.current.sortConfig).toEqual({ key: 'name', order: 'asc' })
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('switching to a different column resets order to "asc"', () => {
      const data: Person[] = [
        { name: 'Charlie', age: 40 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const { result } = renderHook(() => useSortableTable(data))

      // Sort by name desc
      act(() => { result.current.handleSort('name') })
      act(() => { result.current.handleSort('name') })
      expect(result.current.sortConfig.order).toBe('desc')

      // Switch to age
      act(() => { result.current.handleSort('age') })

      expect(result.current.sortConfig).toEqual({ key: 'age', order: 'asc' })
      expect(result.current.sortedData.map((r) => r.age)).toEqual([25, 30, 40])
    })
  })

  describe('string sorting', () => {
    it('uses localeCompare order for string values', () => {
      const data: Person[] = [
        { name: 'banana', age: 1 },
        { name: 'apple', age: 2 },
        { name: 'cherry', age: 3 },
      ]
      const { result } = renderHook(() => useSortableTable(data, 'name'))
      const names = result.current.sortedData.map((r) => r.name)
      expect(names).toEqual(['apple', 'banana', 'cherry'])
    })
  })

  describe('number sorting', () => {
    it('sorts numbers numerically, not lexicographically', () => {
      interface Priced { price: number }
      const data: Priced[] = [
        { price: 10 },
        { price: 2 },
        { price: 100 },
      ]
      const { result } = renderHook(() => useSortableTable(data, 'price'))
      expect(result.current.sortedData.map((r) => r.price)).toEqual([2, 10, 100])
    })
  })

  describe('null and undefined handling', () => {
    it('sorts null values to the end when order is ascending', () => {
      const data: NullableRow[] = [
        { name: null },
        { name: 'B' },
        { name: 'A' },
      ]
      const { result } = renderHook(() => useSortableTable(data, 'name'))
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['A', 'B', null])
    })

    it('sorts null values to the end when order is descending', () => {
      const data: NullableRow[] = [
        { name: null },
        { name: 'B' },
        { name: 'A' },
      ]
      const { result } = renderHook(() => useSortableTable(data, 'name', 'desc'))
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['B', 'A', null])
    })

    it('sorts undefined values to the end when order is ascending', () => {
      const data: NullableRow[] = [
        { name: undefined },
        { name: 'B' },
        { name: 'A' },
      ]
      const { result } = renderHook(() => useSortableTable(data, 'name'))
      expect(result.current.sortedData.map((r) => r.name)).toEqual(['A', 'B', undefined])
    })
  })

  describe('edge cases', () => {
    it('handles an empty array without error', () => {
      const { result } = renderHook(() => useSortableTable<Person>([], 'name'))
      expect(result.current.sortedData).toEqual([])
    })

    it('handles a single-item array without error', () => {
      const data: Person[] = [{ name: 'Alice', age: 30 }]
      const { result } = renderHook(() => useSortableTable(data, 'name'))
      expect(result.current.sortedData).toEqual([{ name: 'Alice', age: 30 }])
    })

    it('does not mutate the original input array after sorting', () => {
      const data: Person[] = [
        { name: 'Charlie', age: 40 },
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]
      const originalOrder = data.map((r) => r.name)
      renderHook(() => useSortableTable(data, 'name'))
      expect(data.map((r) => r.name)).toEqual(originalOrder)
    })
  })
})
