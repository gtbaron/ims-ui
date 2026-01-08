import {ItemListing} from "@/components/listings/ItemListing";
import {ApiResponse} from "@/services/ApiResponse";
import {api} from "@/services/ImsClient";

export const callGetListings = async (): Promise<ItemListing[]> => {
    const response = await api.get<ApiResponse<ItemListing[]>>('/items/listings');
    return response.data.data;
}
