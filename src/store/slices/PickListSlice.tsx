import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';
import { callGetPickLists } from '@/services/PickListService';
import { PickList } from '@/components/pickLists/PickList';
import { LoadingStatus } from '../LoadingStatus';

interface PickListState {
    list: PickList[];
    status: string;
    error?: string;
}

const initialState: PickListState = {
    list: [],
    status: '',
    error: undefined
};

export const fetchPickLists = createAsyncThunk(
    'pickLists/fetch',
    async (includeArchived?: boolean) => {
        return await callGetPickLists(includeArchived ?? false);
    }
);

export const pickListSlice = createSlice({
    name: 'pickLists',
    initialState,
    reducers: {
        addPickList: (state, action: PayloadAction<PickList>) => {
            state.list.push(action.payload as Draft<PickList>);
        },
        updatePickList: (state, action: PayloadAction<PickList>) => {
            const index = state.list.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload as Draft<PickList>;
            }
        },
        removePickList: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPickLists.pending, (state) => {
                state.status = LoadingStatus.LOADING;
            })
            .addCase(fetchPickLists.fulfilled, (state, action) => {
                state.status = LoadingStatus.SUCCEEDED;
                state.list = action.payload as Draft<PickList>[];
            })
            .addCase(fetchPickLists.rejected, (state, action) => {
                state.status = LoadingStatus.FAILED;
                state.error = action.error.message || "Failed to load";
            });
    }
});

export const { addPickList, updatePickList, removePickList } = pickListSlice.actions;

export default pickListSlice.reducer;