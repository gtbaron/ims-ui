import {api} from "@/services/ImsClient"
import {PickList} from "@/components/pickLists/PickList";
import {ApiResponse} from "@/services/ApiResponse";

export const callGetPickLists = async (): Promise<PickList[]> => {
    const response = await api.get<ApiResponse<PickList[]>>('/pick-lists');
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