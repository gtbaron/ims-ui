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
        clearPartsList: (state) => {
            state.partsList = [];
        },
    },
})

export const { setPartsList, clearPartsList } = partsListSlice.actions;

export default partsListSlice.reducer;