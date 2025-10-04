import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Item} from "@/components/items/Item";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";
import {callGetItems} from "@/services/ItemsService";
import {LoadingStatus} from "@/store/LoadingStatus";

const defaultItem: Item = {
    id: 0,
    name: '',
    listPrice: 0,
    itemCategory: ItemCategory.HOME_DECOR,
    itemStatus: ItemStatus.DRAFT,
    overrideSuggestedListPrice: false,
    quantityOnHand: 0,
};

type ItemsState = {
    list: Item[];
    selectedItem: Item;
    status: string;
    error?: string;
};

export const fetchItems = createAsyncThunk("items", async () => {
    const items = await callGetItems();
    return items.sort((a: Item, b: Item) => a.name.localeCompare(b.name));
});

const initialState: ItemsState = {
    list: [],
    selectedItem: defaultItem,
    status: '',
};

export const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = LoadingStatus.LOADING;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = LoadingStatus.SUCCEEDED;
                state.list = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = LoadingStatus.FAILED;
                state.error = action.error.message || "Failed to load";
            });
    },
});

export const { addItem, updateItem, removeItem, setSelectedItem } = itemsSlice.actions;

export default itemsSlice.reducer;