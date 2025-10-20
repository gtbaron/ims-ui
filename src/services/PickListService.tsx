import {api} from "@/services/ImsClient"
import {PickList} from "@/components/pickLists/PickList";
import {ApiResponse} from "@/services/ApiResponse";

export const callGetPickLists = async (): Promise<PickList[]> => {
    const response = await api.get<ApiResponse<PickList[]>>('/pickLists');
    return response.data.data;
}

export const callCreatePickList = async (pickList: PickList): Promise<PickList> => {
    const response = await api.post('/pickLists', pickList);
    return response.data.data[0];
}

export const callUpdatePickList = async (pickList: PickList): Promise<PickList> => {
    const response = await api.put(`/pickLists/${pickList.id}`, pickList);
    return response.data.data[0];
}