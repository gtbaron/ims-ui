import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/services/ImsClient'
import {
  callGetItems,
  callCreateItem,
  callUpdateItem,
  callDeleteItem,
  callGetCostOfParts,
  callGetItemParts,
  callCreateItemParts,
  callUpdateItemParts,
  callDeleteItemParts,
  callHaveSufficientParts,
} from './ItemsService'
import { Item } from '@/components/items/Item'
import { ItemPart } from '@/components/items/ItemPart'
import { ItemCategory } from '@/components/items/ItemCategory'
import { ItemStatus } from '@/components/items/ItemStatus'

vi.mock('@/services/ImsClient', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockItem: Item = {
  id: 1,
  name: 'Widget',
  listPrice: 100,
  itemCategory: 'ELECTRONICS' as ItemCategory,
  itemStatus: 'ACTIVE' as ItemStatus,
  overrideSuggestedListPrice: false,
  quantityOnHand: 5,
  desiredQuantity: 10,
}

const mockItemPart: ItemPart = { id: 1, itemId: 1, partId: 2, quantity: 3 }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('callGetItems', () => {
  it('calls GET /items and returns response.data.data', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [mockItem] } })

    const result = await callGetItems()

    expect(api.get).toHaveBeenCalledWith('/items')
    expect(result).toEqual([mockItem])
  })
})

describe('callCreateItem', () => {
  it('calls POST /items with item and returns response.data.data[0]', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { data: [mockItem] } })

    const result = await callCreateItem(mockItem)

    expect(api.post).toHaveBeenCalledWith('/items', mockItem)
    expect(result).toEqual(mockItem)
  })
})

describe('callUpdateItem', () => {
  it('calls PUT /items/:id with item and returns response.data.data[0]', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: { data: [mockItem] } })

    const result = await callUpdateItem(mockItem)

    expect(api.put).toHaveBeenCalledWith(`/items/${mockItem.id}`, mockItem)
    expect(result).toEqual(mockItem)
  })
})

describe('callDeleteItem', () => {
  it('calls DELETE /items/:id and returns response.data.success boolean', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } })

    const result = await callDeleteItem(1)

    expect(api.delete).toHaveBeenCalledWith('/items/1')
    expect(result).toBe(true)
  })

  it('returns false when success is false', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: false } })

    const result = await callDeleteItem(2)

    expect(result).toBe(false)
  })
})

describe('callGetCostOfParts', () => {
  it('calls GET /items/:id/cost-of-parts and returns response.data.data[0].cost', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [{ cost: 42.5 }] } })

    const result = await callGetCostOfParts(1)

    expect(api.get).toHaveBeenCalledWith('/items/1/cost-of-parts')
    expect(result).toBe(42.5)
  })
})

describe('callGetItemParts', () => {
  it('calls GET /items/:id/parts and returns response.data.data', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [mockItemPart] } })

    const result = await callGetItemParts(1)

    expect(api.get).toHaveBeenCalledWith('/items/1/parts')
    expect(result).toEqual([mockItemPart])
  })
})

describe('callCreateItemParts', () => {
  it('calls POST /items/:id/parts with wrapped payload', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} })

    await callCreateItemParts(1, [mockItemPart])

    expect(api.post).toHaveBeenCalledWith('/items/1/parts', { data: [mockItemPart] })
  })
})

describe('callUpdateItemParts', () => {
  // NOTE: callUpdateItemParts and callCreateItemParts use the same endpoint
  // (POST /items/:id/parts). This appears to be intentional — the backend
  // upserts parts via POST rather than using a separate PUT endpoint.
  it('calls POST /items/:id/parts with wrapped payload (same endpoint as create)', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} })

    await callUpdateItemParts(1, [mockItemPart])

    expect(api.post).toHaveBeenCalledWith('/items/1/parts', { data: [mockItemPart] })
  })
})

describe('callDeleteItemParts', () => {
  it('calls DELETE /items/:id/parts with data config containing item parts', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: {} })

    await callDeleteItemParts(1, [mockItemPart])

    expect(api.delete).toHaveBeenCalledWith('/items/1/parts', {
      data: { data: [mockItemPart] },
    })
  })
})

describe('callHaveSufficientParts', () => {
  it('returns true when response.data.data is [true]', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [true] } })

    const result = await callHaveSufficientParts(1)

    expect(api.get).toHaveBeenCalledWith('/items/1/have-sufficient-parts')
    expect(result).toBe(true)
  })

  it('returns false when response.data.data is [false]', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [false] } })

    const result = await callHaveSufficientParts(1)

    expect(result).toBe(false)
  })

  it('returns false when response.data.data is an empty array', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [] } })

    const result = await callHaveSufficientParts(1)

    expect(result).toBe(false)
  })

  it('returns false when response.data.data is null/undefined', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: null } })

    const result = await callHaveSufficientParts(1)

    expect(result).toBe(false)
  })
})
