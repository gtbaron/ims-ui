import { describe, it, expect } from 'vitest'
import { partsSlice, addPart, updatePart, removePart, fetchParts } from './PartsSlice'
import { LoadingStatus } from '@/store/LoadingStatus'
import type { Part } from '@/components/parts/Part'

const reducer = partsSlice.reducer

const samplePart: Part = {
  id: 1,
  name: 'Resistor 10k',
  provider: 'DigiKey',
  bulkPrice: 0.05,
  bulkQuantity: 100,
  url: 'https://example.com/resistor',
  quantityOnHand: 500,
}

const anotherPart: Part = {
  id: 2,
  name: 'Capacitor 100uF',
  provider: 'Mouser',
  bulkPrice: 0.20,
  bulkQuantity: 50,
  url: 'https://example.com/capacitor',
  quantityOnHand: 200,
}

describe('partsSlice (via createEntitySlice factory)', () => {
  describe('initial state', () => {
    it('starts with an empty list', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.list).toEqual([])
    })

    it('starts with an empty status string', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.status).toBe('')
    })
  })

  describe('addPart', () => {
    it('appends the part to the list', () => {
      const state = reducer({ list: [], status: '' }, addPart(samplePart))
      expect(state.list).toHaveLength(1)
      expect(state.list[0]).toEqual(samplePart)
    })

    it('appends multiple parts in order', () => {
      let state = reducer({ list: [], status: '' }, addPart(samplePart))
      state = reducer(state, addPart(anotherPart))
      expect(state.list).toHaveLength(2)
      expect(state.list[1]).toEqual(anotherPart)
    })
  })

  describe('updatePart', () => {
    it('replaces the part with matching id', () => {
      const updated: Part = { ...samplePart, name: 'Resistor 22k' }
      const state = reducer(
        { list: [samplePart, anotherPart], status: '' },
        updatePart(updated)
      )
      expect(state.list[0].name).toBe('Resistor 22k')
      expect(state.list[1]).toEqual(anotherPart)
    })

    it('does not modify the list when id is not found', () => {
      const unknown: Part = { ...samplePart, id: 999 }
      const state = reducer(
        { list: [samplePart, anotherPart], status: '' },
        updatePart(unknown)
      )
      expect(state.list).toHaveLength(2)
      expect(state.list[0]).toEqual(samplePart)
    })
  })

  describe('removePart', () => {
    it('removes the part with the given id', () => {
      const state = reducer(
        { list: [samplePart, anotherPart], status: '' },
        removePart(1)
      )
      expect(state.list).toHaveLength(1)
      expect(state.list[0]).toEqual(anotherPart)
    })

    it('leaves the list unchanged when id is not found', () => {
      const state = reducer(
        { list: [samplePart, anotherPart], status: '' },
        removePart(999)
      )
      expect(state.list).toHaveLength(2)
    })
  })

  describe('fetchParts thunk', () => {
    it('sets status to LOADING when pending', () => {
      const state = reducer(
        { list: [], status: '' },
        { type: fetchParts.pending.type }
      )
      expect(state.status).toBe(LoadingStatus.LOADING)
    })

    it('sets status to SUCCEEDED and populates list when fulfilled', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING },
        { type: fetchParts.fulfilled.type, payload: [samplePart, anotherPart] }
      )
      expect(state.status).toBe(LoadingStatus.SUCCEEDED)
      expect(state.list).toEqual([samplePart, anotherPart])
    })

    it('sets status to FAILED and records the error message when rejected', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING },
        { type: fetchParts.rejected.type, error: { message: 'Network error' } }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Network error')
    })

    it('falls back to "Failed to load" when rejected error has no message', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING },
        { type: fetchParts.rejected.type, error: {} }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Failed to load')
    })
  })
})
