import {Part} from "@/components/parts/Part";
import {ApiResponse} from "./ApiResponse";
import {api} from "@/services/ImsClient";

export const callGetParts = async (): Promise<Part[]> => {
    const response = await api.get<ApiResponse<Part[]>>('/parts');
    return response.data.data;
}

export const callDeletePart = async (id: number): Promise<boolean> => {
    const response = await api.delete(`/parts/${id}`);
    return response.data.success
}

export const callCreatePart = async (part: Part): Promise<Part> => {
    const response = await api.post('/parts', part);
    return response.data.data[0];
}

export const callUpdatePart = async (part: Part): Promise<Part> => {
    const response = await api.put(`/parts/${part.id}`, part);
    return response.data.data[0];
}
