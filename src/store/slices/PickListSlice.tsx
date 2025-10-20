import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {callGetPickLists} from "@/services/PickListService";
import {PickList} from "@/components/pickLists/PickList";
import {LoadingStatus} from "@/store/LoadingStatus";

type PickListState = {
    list: PickList[];
    status: string;
    error?: string;
}

const initialState: PickListState = {
    list: [],
    status: '',
};

export const fetchPickLists = createAsyncThunk("pickLists", async () => {
   return await callGetPickLists();
});

export const pickListSlice = createSlice({
    name: "pickLists",
    initialState,
    reducers: {
        addPickList: (state, action: PayloadAction<PickList>) => {
            state.list.push(action.payload);
        },
        updatePickList: (state, action: PayloadAction<PickList>) => {
            const index = state.list.findIndex(pickList => pickList.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        removePickList: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(pickList => pickList.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPickLists.pending, (state) => {
                state.status = LoadingStatus.LOADING;
            })
            .addCase(fetchPickLists.fulfilled, (state, action) => {
                state.status = LoadingStatus.SUCCEEDED;
                state.list = action.payload;
            })
            .addCase(fetchPickLists.rejected, (state, action) => {
                state.status = LoadingStatus.FAILED;
                state.error = action.error.message || "Failed to load";
            });
    },
});

export const { addPickList, updatePickList, removePickList } = pickListSlice.actions;

export default pickListSlice.reducer;