import {ItemInventory} from "@/components/inventory/items/ItemInventory";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {callGetItemsInventory} from "@/services/ItemsService";
import {LoadingStatus} from "@/store/LoadingStatus";

type ItemsInventoryState = {
    list: ItemInventory[];
    status: string;
    error?: string;
}

export const fetchItemsInventory = createAsyncThunk("itemsInventory", async () => {
    return await callGetItemsInventory();
});

const initialState: ItemsInventoryState = {
    list: [],
    status: '',
};

export const itemsInventorySlice = createSlice({
    name: 'itemsInventory',
    initialState,
    reducers: {
        addItemInventory: (state, action) => {
            state.list.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItemsInventory.pending, (state) => {
                state.status = LoadingStatus.LOADING;
            })
            .addCase(fetchItemsInventory.fulfilled, (state, action) => {
                state.status = LoadingStatus.SUCCEEDED;
                state.list = action.payload;
            })
            .addCase(fetchItemsInventory.rejected, (state, action) => {
                state.status = LoadingStatus.FAILED;
                state.error = action.error.message || "Failed to load";
            });
    },
});

export const { addItemInventory } = itemsInventorySlice.actions;

export default itemsInventorySlice.reducer;