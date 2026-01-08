import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ItemListing} from "@/components/listings/ItemListing";
import {callGetListings} from "@/services/ListingsService";
import {LoadingStatus} from "@/store/LoadingStatus";

type ListingsState = {
    list: ItemListing[];
    status: string;
    error?: string;
};

export const fetchListings = createAsyncThunk("listings", async () => {
    const listings = await callGetListings();
    return listings.sort((a, b) => a.name.localeCompare(b.name));
});

const initialState: ListingsState = {
    list: [],
    status: '',
};

export const listingsSlice = createSlice({
    name: "listings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => {
                state.status = LoadingStatus.LOADING;
            })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.status = LoadingStatus.SUCCEEDED;
                state.list = action.payload;
            })
            .addCase(fetchListings.rejected, (state, action) => {
                state.status = LoadingStatus.FAILED;
                state.error = action.error.message || "Failed to load";
            });
    },
});

export default listingsSlice.reducer;
