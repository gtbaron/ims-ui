import { describe, it, expect } from 'vitest'
import { itemsSlice, addItem, updateItem, removeItem, setSelectedItem, fetchItems } from './ItemsSlice'
import { ItemCategory } from '@/components/items/ItemCategory'
import { ItemStatus } from '@/components/items/ItemStatus'
import { LoadingStatus } from '@/store/LoadingStatus'
import type { Item } from '@/components/items/Item'

const reducer = itemsSlice.reducer

const sampleItem: Item = {
  id: 1,
  name: 'Lamp A',
  listPrice: 100,
  itemCategory: ItemCategory.LAMP,
  itemStatus: ItemStatus.ACTIVE,
  overrideSuggestedListPrice: false,
  quantityOnHand: 5,
  desiredQuantity: 10,
}

const anotherItem: Item = {
  id: 2,
  name: 'Sconce B',
  listPrice: 200,
  itemCategory: ItemCategory.SCONCE,
  itemStatus: ItemStatus.DRAFT,
  overrideSuggestedListPrice: true,
  quantityOnHand: 0,
  desiredQuantity: 1,
}

describe('itemsSlice', () => {
  describe('initial state', () => {
    it('starts with an empty list', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.list).toEqual([])
    })

    it('starts with an empty status string', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.status).toBe('')
    })

    it('starts with a default selectedItem', () => {
      const state = reducer(undefined, { type: '@@INIT' })
      expect(state.selectedItem).toBeDefined()
      expect(state.selectedItem.name).toBe('')
    })
  })

  describe('addItem', () => {
    it('appends the item to the list', () => {
      const state = reducer({ list: [], selectedItem: sampleItem, status: '' }, addItem(sampleItem))
      expect(state.list).toHaveLength(1)
      expect(state.list[0]).toEqual(sampleItem)
    })

    it('appends multiple items in order', () => {
      let state = reducer({ list: [], selectedItem: sampleItem, status: '' }, addItem(sampleItem))
      state = reducer(state, addItem(anotherItem))
      expect(state.list).toHaveLength(2)
      expect(state.list[1]).toEqual(anotherItem)
    })
  })

  describe('updateItem', () => {
    it('replaces the item with matching id', () => {
      const updated: Item = { ...sampleItem, name: 'Updated Lamp' }
      const state = reducer(
        { list: [sampleItem, anotherItem], selectedItem: sampleItem, status: '' },
        updateItem(updated)
      )
      expect(state.list[0].name).toBe('Updated Lamp')
      expect(state.list[1]).toEqual(anotherItem)
    })

    it('does not modify the list when id is not found', () => {
      const unknown: Item = { ...sampleItem, id: 999 }
      const state = reducer(
        { list: [sampleItem, anotherItem], selectedItem: sampleItem, status: '' },
        updateItem(unknown)
      )
      expect(state.list).toHaveLength(2)
      expect(state.list[0]).toEqual(sampleItem)
    })
  })

  describe('removeItem', () => {
    it('removes the item with the given id', () => {
      const state = reducer(
        { list: [sampleItem, anotherItem], selectedItem: sampleItem, status: '' },
        removeItem(1)
      )
      expect(state.list).toHaveLength(1)
      expect(state.list[0]).toEqual(anotherItem)
    })

    it('leaves the list unchanged when id is not found', () => {
      const state = reducer(
        { list: [sampleItem, anotherItem], selectedItem: sampleItem, status: '' },
        removeItem(999)
      )
      expect(state.list).toHaveLength(2)
    })
  })

  describe('setSelectedItem', () => {
    it('sets the selectedItem to the provided item', () => {
      const state = reducer(
        { list: [], selectedItem: sampleItem, status: '' },
        setSelectedItem(anotherItem)
      )
      expect(state.selectedItem).toEqual(anotherItem)
    })
  })

  describe('fetchItems thunk', () => {
    it('sets status to LOADING when pending', () => {
      const state = reducer(
        { list: [], selectedItem: sampleItem, status: '' },
        { type: fetchItems.pending.type }
      )
      expect(state.status).toBe(LoadingStatus.LOADING)
    })

    it('sets status to SUCCEEDED and populates list when fulfilled', () => {
      const state = reducer(
        { list: [], selectedItem: sampleItem, status: LoadingStatus.LOADING },
        { type: fetchItems.fulfilled.type, payload: [sampleItem, anotherItem] }
      )
      expect(state.status).toBe(LoadingStatus.SUCCEEDED)
      expect(state.list).toEqual([sampleItem, anotherItem])
    })

    it('sets status to FAILED and records the error message when rejected', () => {
      const state = reducer(
        { list: [], selectedItem: sampleItem, status: LoadingStatus.LOADING },
        { type: fetchItems.rejected.type, error: { message: 'Network error' } }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Network error')
    })

    it('falls back to "Failed to load" when rejected error has no message', () => {
      const state = reducer(
        { list: [], selectedItem: sampleItem, status: LoadingStatus.LOADING },
        { type: fetchItems.rejected.type, error: {} }
      )
      expect(state.status).toBe(LoadingStatus.FAILED)
      expect(state.error).toBe('Failed to load')
    })
  })
})
