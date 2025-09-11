import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Item} from "@/components/items/Item";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";

const defaultItem: Item = {
    name: '',
    listPrice: 0,
    itemCategory: ItemCategory.HOME_DECOR,
    itemStatus: ItemStatus.DRAFT
};

type ItemsState = {
    list: Item[];
    selectedItem: Item;
}

const initialState: ItemsState = {
    list: [],
    selectedItem: defaultItem
};

export const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setItemsList: (state, action: PayloadAction<Item[]>) => {
            state.list = action.payload;
        },
        addItem: (state, action: PayloadAction<Item>) => {
            state.list.push(action.payload);
        },
        updateItem: (state, action: PayloadAction<Item>) => {
            const index = state.list.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        },
        setSelectedItem: (state, action: PayloadAction<Item>) => {
            state.selectedItem = action.payload;
        },
        clearSelectedItem: (state) => {
            state.selectedItem = defaultItem;
        }
    },
})

export const { setItemsList, addItem, updateItem, removeItem, setSelectedItem, clearSelectedItem } = itemsSlice.actions;

export default itemsSlice.reducer;