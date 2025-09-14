import {Item} from "@/components/items/Item";
import {ApiResponse} from "@/services/ApiResponse";
import {api} from "@/services/ImsClient";
import {ItemPart} from "@/components/items/ItemPart";

export const callGetItems = async (): Promise<Item[]> => {
    const response = await api.get<ApiResponse<Item[]>>('/items');
    return response.data.data;
}

export const callDeleteItem = async (id: number): Promise<boolean> => {
    const response = await api.delete(`/items/${id}`);
    return response.data.success
}

export const callCreateItem = async (item: Item): Promise<Item> => {
    const response = await api.post('/items', item);
    return response.data.data[0];
}

export const callUpdateItem = async (item: Item): Promise<Item> => {
    const response = await api.patch(`/items/${item.id}`, item);
    return response.data.data[0];
}

export const callGetCostOfParts = async (itemId: number): Promise<number> => {
    const response = await api.get(`/items/${itemId}/cost-of-parts`);
    return response.data.data[0].cost;
}

export const callGetItemParts = async (itemId: number): Promise<ItemPart[]> => {
    const response = await api.get(`/items/${itemId}/parts`);
    return response.data.data;
}

export const callCreateItemParts = async (itemId: number, itemParts: ItemPart[]) => {
    for (const itemPart of itemParts) {
        await api.post(`/items/${itemId}/parts/${itemPart.partId}`, {
            quantity: itemPart.quantity
        });
    }
}