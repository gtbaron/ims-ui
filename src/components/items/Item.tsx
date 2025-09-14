import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";

export type Item = {
    id?: number,
    name: string,
    listPrice: number,
    itemCategory: ItemCategory,
    itemStatus: ItemStatus,
    overrideSuggestedListPrice: boolean
}
