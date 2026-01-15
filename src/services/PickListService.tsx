import {api} from "@/services/ImsClient"
import {PickList} from "@/components/pickLists/PickList";
import {ApiResponse} from "@/services/ApiResponse";

export const callGetPickLists = async (includeArchived: boolean = false): Promise<PickList[]> => {
    const response = await api.get<ApiResponse<PickList[]>>(`/pick-lists?includeArchived=${includeArchived}`);
    return response.data.data;
}

export const callCreatePickList = async (pickList: PickList): Promise<PickList> => {
    const response = await api.post('/pick-lists', pickList);
    return response.data.data[0];
}

export const callUpdatePickList = async (pickList: PickList): Promise<PickList> => {
    const response = await api.put(`/pick-lists/${pickList.id}`, pickList);
    return response.data.data[0];
}

export const callDeletePickList = async (id: number): Promise<boolean> => {
    const response = await api.delete(`/pick-lists/${id}`);
    return response.data.success;
}

export const callPullPickList = async (id: number): Promise<PickList> => {
    const response = await api.post(`/pick-lists/${id}/pull`);
    return response.data.data[0];
}

export const callReturnPickList = async (id: number): Promise<PickList> => {
    const response = await api.post(`/pick-lists/${id}/return`);
    return response.data.data[0];
}

export const callCompletePickList = async (id: number): Promise<PickList> => {
    const response = await api.post(`/pick-lists/${id}/complete`);
    return response.data.data[0];
}

export const callCancelPickList = async (id: number): Promise<PickList> => {
    const response = await api.post(`/pick-lists/${id}/cancel`);
    return response.data.data[0];
}

export const callArchivePickList = async (id: number): Promise<PickList> => {
    const response = await api.post(`/pick-lists/${id}/archive`);
    return response.data.data[0];
}