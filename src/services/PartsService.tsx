import axios, {AxiosInstance} from "axios";
import {PartType} from "@/components/parts/part/Part";
import {ApiResponse} from "./ApiResponse";

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {'Content-Type': 'application/json'}
})

export const callGetParts = async (): Promise<PartType[]> => {
    const response = await api.get<ApiResponse<PartType[]>>('/parts');
    return response.data.data;
}

export const callDeletePart = async (id: number): Promise<boolean> => {
    const response = await api.delete(`/parts/${id}`);
    return response.data.success
}

export const callCreatePart = async (part: PartType): Promise<PartType> => {
    const response = await api.post('/parts', part);
    return response.data.data[0];
}

export const callUpdatePart = async (part: PartType): Promise<PartType> => {
    const response = await api.patch(`/parts/${part.id}`, part);
    return response.data.data[0];
}
