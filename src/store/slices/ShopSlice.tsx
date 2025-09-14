import {createSlice} from "@reduxjs/toolkit";

type ShopState = {
    discount: number;
};

const initialState: ShopState = {
    discount: 30,
};

export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        setDiscount: (state, action) => {
            state.discount = action.payload;
        }
    }
});

export const { setDiscount } = shopSlice.actions;

export default shopSlice.reducer;