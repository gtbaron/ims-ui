import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Part} from "@/components/parts/Part";
import {callGetParts} from "@/services/PartsService";
import {LoadingStatus} from "@/store/LoadingStatus";

type PartsState = {
    list: Part[];
    status: string;
    error?: string;
}

export const fetchParts = createAsyncThunk("parts", async () => {
    return await callGetParts();
});

const initialState: PartsState = {
    list: [],
    status: '',
};

export const partsSlice = createSlice({
    name: "parts",
    initialState,
    reducers: {
        addPart: (state, action: PayloadAction<Part>) => {
            state.list.push(action.payload);
        },
        updatePart: (state, action: PayloadAction<Part>) => {
            const index = state.list.findIndex(part => part.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        removePart: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(part => part.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchParts.pending, (state) => {
                state.status = LoadingStatus.LOADING;
            })
            .addCase(fetchParts.fulfilled, (state, action) => {
                state.status = LoadingStatus.SUCCEEDED;
                state.list = action.payload;
            })
            .addCase(fetchParts.rejected, (state, action) => {
                state.status = LoadingStatus.FAILED;
                state.error = action.error.message || "Failed to load";
            });
    },
})

export const { addPart, updatePart, removePart } = partsSlice.actions;

export default partsSlice.reducer;