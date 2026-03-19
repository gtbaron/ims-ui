import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/services/ImsClient'
import {
  callGetPickLists,
  callCreatePickList,
  callUpdatePickList,
  callDeletePickList,
  callPullPickList,
  callReturnPickList,
  callCompletePickList,
  callCancelPickList,
  callArchivePickList,
} from './PickListService'
import { PickList, PickListStatus } from '@/components/pickLists/PickList'

vi.mock('@/services/ImsClient', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

const mockPickList: PickList = {
  id: 1,
  itemId: 2,
  quantity: 5,
  pickListStatus: PickListStatus.DRAFT,
  missingParts: [],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('callGetPickLists', () => {
  it('calls GET /pick-lists?includeArchived=false by default and returns response.data.data', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [mockPickList] } })

    const result = await callGetPickLists()

    expect(api.get).toHaveBeenCalledWith('/pick-lists?includeArchived=false')
    expect(result).toEqual([mockPickList])
  })

  it('calls GET /pick-lists?includeArchived=true when includeArchived is true', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [mockPickList] } })

    const result = await callGetPickLists(true)

    expect(api.get).toHaveBeenCalledWith('/pick-lists?includeArchived=true')
    expect(result).toEqual([mockPickList])
  })

  it('calls GET /pick-lists?includeArchived=false when includeArchived is false', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [] } })

    const result = await callGetPickLists(false)

    expect(api.get).toHaveBeenCalledWith('/pick-lists?includeArchived=false')
    expect(result).toEqual([])
  })
})

describe('callCreatePickList', () => {
  it('calls POST /pick-lists with pick list and returns response.data.data[0]', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { data: [mockPickList] } })

    const result = await callCreatePickList(mockPickList)

    expect(api.post).toHaveBeenCalledWith('/pick-lists', mockPickList)
    expect(result).toEqual(mockPickList)
  })
})

describe('callUpdatePickList', () => {
  it('calls PUT /pick-lists/:id with pick list and returns response.data.data[0]', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: { data: [mockPickList] } })

    const result = await callUpdatePickList(mockPickList)

    expect(api.put).toHaveBeenCalledWith(`/pick-lists/${mockPickList.id}`, mockPickList)
    expect(result).toEqual(mockPickList)
  })
})

describe('callDeletePickList', () => {
  it('calls DELETE /pick-lists/:id and returns response.data.success boolean', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } })

    const result = await callDeletePickList(1)

    expect(api.delete).toHaveBeenCalledWith('/pick-lists/1')
    expect(result).toBe(true)
  })

  it('returns false when success is false', async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: false } })

    const result = await callDeletePickList(2)

    expect(result).toBe(false)
  })
})

describe('callPullPickList', () => {
  it('calls POST /pick-lists/:id/pull and returns response.data.data[0]', async () => {
    const pulled = { ...mockPickList, pickListStatus: PickListStatus.IN_BUILD }
    vi.mocked(api.post).mockResolvedValue({ data: { data: [pulled] } })

    const result = await callPullPickList(1)

    expect(api.post).toHaveBeenCalledWith('/pick-lists/1/pull')
    expect(result).toEqual(pulled)
  })
})

describe('callReturnPickList', () => {
  it('calls POST /pick-lists/:id/return and returns response.data.data[0]', async () => {
    const returned = { ...mockPickList, pickListStatus: PickListStatus.DRAFT }
    vi.mocked(api.post).mockResolvedValue({ data: { data: [returned] } })

    const result = await callReturnPickList(1)

    expect(api.post).toHaveBeenCalledWith('/pick-lists/1/return')
    expect(result).toEqual(returned)
  })
})

describe('callCompletePickList', () => {
  it('calls POST /pick-lists/:id/complete and returns response.data.data[0]', async () => {
    const completed = { ...mockPickList, pickListStatus: PickListStatus.COMPLETED }
    vi.mocked(api.post).mockResolvedValue({ data: { data: [completed] } })

    const result = await callCompletePickList(1)

    expect(api.post).toHaveBeenCalledWith('/pick-lists/1/complete')
    expect(result).toEqual(completed)
  })
})

describe('callCancelPickList', () => {
  it('calls POST /pick-lists/:id/cancel and returns response.data.data[0]', async () => {
    const cancelled = { ...mockPickList, pickListStatus: PickListStatus.CANCELLED }
    vi.mocked(api.post).mockResolvedValue({ data: { data: [cancelled] } })

    const result = await callCancelPickList(1)

    expect(api.post).toHaveBeenCalledWith('/pick-lists/1/cancel')
    expect(result).toEqual(cancelled)
  })
})

describe('callArchivePickList', () => {
  it('calls POST /pick-lists/:id/archive and returns response.data.data[0]', async () => {
    const archived = { ...mockPickList, pickListStatus: PickListStatus.ARCHIVED }
    vi.mocked(api.post).mockResolvedValue({ data: { data: [archived] } })

    const result = await callArchivePickList(1)

    expect(api.post).toHaveBeenCalledWith('/pick-lists/1/archive')
    expect(result).toEqual(archived)
  })
})
