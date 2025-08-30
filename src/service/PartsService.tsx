import axios, { AxiosInstance } from "axios";
import { PartType } from "@/components/parts/part/Part";
import { ApiResponse } from "./ApiResponse";

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {'Content-Type': 'application/json'}
})

export const getParts = async (): Promise<PartType[]> => {
    const response = await api.get<ApiResponse<PartType[]>>('/parts');
    return response.data.data;
}
