import { describe, it, expect } from 'vitest'
import { pickListSlice, addPickList, updatePickList, removePickList, fetchPickLists } from './PickListSlice'
import { LoadingStatus } from '@/store/LoadingStatus'
import { PickListStatus } from '@/components/pickLists/PickList'
import type { PickList } from '@/components/pickLists/PickList'

const reducer = pickListSlice.reducer

const samplePickList: PickList = {
  id: 1,
  itemId: 10,
  quantity: 2,
  pickListStatus: PickListStatus.DRAFT,
  missingParts: [],
}

const anotherPickList: PickList = {
  id: 2,
  itemId: 20,
  quantity: 5,
  pickListStatus: PickListStatus.READY_TO_PICK,
  missingParts: [3, 7],
}

describe('pickListSlice', () => {
  describe('initial state', () => {
    it('starts with an empty list', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.list).toEqual([])
    })

    it('starts with an empty status string', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.status).toBe('')
    })

    it('starts with undefined error', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.error).toBeUndefined()
    })
  })

  describe('addPickList', () => {
    it('appends the pick list to the list', () => {
      const state = reducer({ list: [], status: '', error: undefined }, addPickList(samplePickList))
      expect(state.list).toHaveLength(1)
      expect(state.list[0]).toEqual(samplePickList)
    })

    it('appends multiple pick lists in order', () => {
      let state = reducer({ list: [], status: '', error: undefined }, addPickList(samplePickList))
      state = reducer(state, addPickList(anotherPickList))
      expect(state.list).toHaveLength(2)
      expect(state.list[1]).toEqual(anotherPickList)
    })
  })

  describe('updatePickList', () => {
    it('replaces the pick list with matching id', () => {
      const updated: PickList = { ...samplePickList, quantity: 10 }
      const state = reducer(
        { list: [samplePickList, anotherPickList], status: '', error: undefined },
        updatePickList(updated)
      )
      expect(state.list[0].quantity).toBe(10)
      expect(state.list[1]).toEqual(anotherPickList)
    })

    it('does not modify the list when id is not found', () => {
      const unknown: PickList = { ...samplePickList, id: 999 }
      const state = reducer(
        { list: [samplePickList, anotherPickList], status: '', error: undefined },
        updatePickList(unknown)
      )
      expect(state.list).toHaveLength(2)
      expect(state.list[0]).toEqual(samplePickList)
    })
  })

  describe('removePickList', () => {
    it('removes the pick list with the given id', () => {
      const state = reducer(
        { list: [samplePickList, anotherPickList], status: '', error: undefined },
        removePickList(1)
      )
      expect(state.list).toHaveLength(1)
      expect(state.list[0]).toEqual(anotherPickList)
    })

    it('leaves the list unchanged when id is not found', () => {
      const state = reducer(
        { list: [samplePickList, anotherPickList], status: '', error: undefined },
        removePickList(999)
      )
      expect(state.list).toHaveLength(2)
    })
  })

  describe('fetchPickLists thunk', () => {
    it('sets status to LOADING when pending', () => {
      const state = reducer(
        { list: [], status: '', error: undefined },
        { type: fetchPickLists.pending.type }
      )
      expect(state.status).toBe(LoadingStatus.LOADING)
    })

    it('sets status to SUCCEEDED and populates list when fulfilled', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING, error: undefined },
        { type: fetchPickLists.fulfilled.type, payload: [samplePickList, anotherPickList] }
      )
      expect(state.status).toBe(LoadingStatus.SUCCEEDED)
      expect(state.list).toEqual([samplePickList, anotherPickList])
    })

    it('sets status to FAILED and records the error message when rejected', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING, error: undefined },
        { type: fetchPickLists.rejected.type, error: { message: 'Service unavailable' } }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Service unavailable')
    })

    it('falls back to "Failed to load" when rejected error has no message', () => {
      const state = reducer(
        { list: [], status: LoadingStatus.LOADING, error: undefined },
        { type: fetchPickLists.rejected.type, error: {} }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Failed to load')
    })

    it('thunk action type contains the slice name when dispatched with includeArchived=true', () => {
      // fetchPickLists is an AsyncThunk — verify its pending/fulfilled type strings include the name
      expect(fetchPickLists.pending.type).toBe('pickLists/fetch/pending')
      expect(fetchPickLists.fulfilled.type).toBe('pickLists/fetch/fulfilled')
      expect(fetchPickLists.rejected.type).toBe('pickLists/fetch/rejected')
    })

    it('thunk can be called without arguments (includeArchived=undefined)', () => {
      // Calling without args should return a thunk function (not throw)
      const thunk = fetchPickLists(undefined)
      expect(typeof thunk).toBe('function')
    })
  })
})
