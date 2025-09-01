import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Part} from "@/components/parts/Part";

type PartsState = {
    list: Part[];
}

const initialState: PartsState = {
    list: []
};

export const partsSlice = createSlice({
    name: "parts",
    initialState,
    reducers: {
        setParts: (state, action: PayloadAction<Part[]>) => {
            state.list = action.payload;
        },
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
})

export const { setParts, addPart, updatePart, removePart } = partsSlice.actions;

export default partsSlice.reducer;