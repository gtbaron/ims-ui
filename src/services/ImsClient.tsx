import axios, {AxiosInstance} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {'Content-Type': 'application/json'},
    timeout: 30000
})