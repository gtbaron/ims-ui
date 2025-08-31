import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {PartType} from "@/components/parts/part/Part";

type PartsListState = {
    partsList: PartType[];
}

const initialState: PartsListState = {
    partsList: []
};

export const partsListSlice = createSlice({
    name: "partsList",
    initialState,
    reducers: {
        setPartsList: (state, action: PayloadAction<PartType[]>) => {
            state.partsList = action.payload;
        },
        addPart: (state, action: PayloadAction<PartType>) => {
            state.partsList.push(action.payload);
        },
        updatePart: (state, action: PayloadAction<PartType>) => {
            const index = state.partsList.findIndex(part => part.id === action.payload.id);
            if (index !== -1) {
                state.partsList[index] = action.payload;
            }
        },
        removePart: (state, action: PayloadAction<number>) => {
            state.partsList = state.partsList.filter(part => part.id !== action.payload);
        }
    },
})

export const { setPartsList, addPart, updatePart, removePart } = partsListSlice.actions;

export default partsListSlice.reducer;