import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Item} from "@/components/items/Item";

type ItemsState = {
    list: Item[];
}

const initialState: ItemsState = {
    list: []
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
        }
    },
})

export const { setItemsList, addItem, updateItem, removeItem } = itemsSlice.actions;

export default itemsSlice.reducer;