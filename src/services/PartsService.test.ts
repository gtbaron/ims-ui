import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/services/ImsClient'
import {
  callGetParts,
  callCreatePart,
  callUpdatePart,
  callDeletePart,
} from './PartsService'
import { Part } from '@/components/parts/Part'

vi.mock('@/services/ImsClient', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockPart: Part = {
  id: 1,
  name: 'Resistor',
  provider: 'Digi-Key',
  bulkPrice: 9.99,
  bulkQuantity: 100,
  url: 'https://digikey.com/resistor',
  quantityOnHand: 50,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('callGetParts', () => {
  it('calls GET /parts and returns response.data.data', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [mockPart] } })

    const result = await callGetParts()

    expect(api.get).toHaveBeenCalledWith('/parts')
    expect(result).toEqual([mockPart])
  })
})

describe('callCreatePart', () => {
  it('calls POST /parts with part and returns response.data.data[0]', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { data: [mockPart] } })

    const result = await callCreatePart(mockPart)

    expect(api.post).toHaveBeenCalledWith('/parts', mockPart)
    expect(result).toEqual(mockPart)
  })
})

describe('callUpdatePart', () => {
  it('calls PUT /parts/:id with part and returns response.data.data[0]', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: { data: [mockPart] } })

    const result = await callUpdatePart(mockPart)

    expect(api.put).toHaveBeenCalledWith(`/parts/${mockPart.id}`, mockPart)
    expect(result).toEqual(mockPart)
  })
})

describe('callDeletePart', () => {
  it('calls DELETE /parts/:id and returns response.data.success boolean', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } })

    const result = await callDeletePart(1)

    expect(api.delete).toHaveBeenCalledWith('/parts/1')
    expect(result).toBe(true)
  })

  it('returns false when success is false', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: false } })

    const result = await callDeletePart(2)

    expect(result).toBe(false)
  })
})
