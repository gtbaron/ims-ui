import { describe, it, expect } from 'vitest'
import { shopSlice, setDiscount } from './ShopSlice'

const reducer = shopSlice.reducer

describe('shopSlice', () => {
  describe('initial state', () => {
    it('has a discount of 30 by default', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.discount).toBe(30)
    })

    it('has exactly the expected shape', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state).toEqual({ discount: 30 })
    })
  })

  describe('setDiscount', () => {
    it('updates discount to the provided value', () => {
      const state = reducer(undefined, setDiscount(50))
      expect(state.discount).toBe(50)
    })

    it('sets discount to 0', () => {
      const state = reducer({ discount: 30 }, setDiscount(0))
      expect(state.discount).toBe(0)
    })

    it('overwrites a previously set discount', () => {
      const after1 = reducer({ discount: 10 }, setDiscount(25))
      const after2 = reducer(after1, setDiscount(99))
      expect(after2.discount).toBe(99)
    })
  })
})
