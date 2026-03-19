import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/services/ImsClient'
import { callGetListings } from './ListingsService'
import { ItemListing } from '@/components/listings/ItemListing'

vi.mock('@/services/ImsClient', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockListing: ItemListing = {
  itemId: 1,
  name: 'Widget',
  costOfParts: 50,
  listPrice: 150,
  overrideSuggestedListPrice: false,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('callGetListings', () => {
  it('calls GET /items/listings and returns response.data.data', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [mockListing] } })

    const result = await callGetListings()

    expect(api.get).toHaveBeenCalledWith('/items/listings')
    expect(result).toEqual([mockListing])
  })

  it('returns an empty array when there are no listings', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [] } })

    const result = await callGetListings()

    expect(result).toEqual([])
  })
})
