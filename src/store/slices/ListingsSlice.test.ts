import { describe, it, expect } from 'vitest'
import { listingsSlice, fetchListings } from './ListingsSlice'
import { LoadingStatus } from '@/store/LoadingStatus'
import type { ItemListing } from '@/components/listings/ItemListing'

const reducer = listingsSlice.reducer

const sampleListing: ItemListing = {
  itemId: 1,
  name: 'Brass Lamp',
  costOfParts: 50,
  listPrice: 150,
  overrideSuggestedListPrice: false,
}

const anotherListing: ItemListing = {
  itemId: 2,
  name: 'Wall Sconce',
  costOfParts: 80,
  listPrice: 200,
  overrideSuggestedListPrice: true,
}

describe('listingsSlice', () => {
  describe('initial state', () => {
    it('starts with an empty list', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.list).toEqual([])
    })

    it('starts with an empty status string', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.status).toBe('')
    })

    it('has no synchronous reducers', () => {
      // The slice actions object should be empty — reducers: {} in source
      expect(Object.keys(listingsSlice.actions)).toHaveLength(0)
    })
  })

  describe('fetchListings thunk', () => {
    it('sets status to LOADING when pending', () => {
      const state = reducer(
        { list: [], status: '' },
        { type: fetchListings.pending.type }
      )
      expect(state.status).toBe(LoadingStatus.LOADING)
    })

    it('sets status to SUCCEEDED and populates list when fulfilled', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING },
        { type: fetchListings.fulfilled.type, payload: [sampleListing, anotherListing] }
      )
      expect(state.status).toBe(LoadingStatus.SUCCEEDED)
      expect(state.list).toEqual([sampleListing, anotherListing])
    })

    it('sets status to FAILED and records the error message when rejected', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING },
        { type: fetchListings.rejected.type, error: { message: 'Server error' } }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Server error')
    })

    it('falls back to "Failed to load" when rejected error has no message', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING },
        { type: fetchListings.rejected.type, error: {} }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Failed to load')
    })
  })
})
