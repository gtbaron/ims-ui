import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';
import { LoadingStatus } from './LoadingStatus';

interface EntityState<T> {
    list: T[];
    status: string;
    error?: string;
}

interface CreateEntitySliceOptions<T> {
    name: string;
    fetchFn: () => Promise<T[]>;
    sortFn?: (a: T, b: T) => number;
}

export function createEntitySlice<T extends { id?: number }>({
    name,
    fetchFn,
    sortFn
}: CreateEntitySliceOptions<T>) {
    const fetchThunk = createAsyncThunk(`${name}/fetch`, async () => {
        const data = await fetchFn();
        return sortFn ? data.sort(sortFn) : data;
    });

    const initialState: EntityState<T> = {
        list: [],
        status: '',
        error: undefined
    };

    const slice = createSlice({
        name,
        initialState,
        reducers: {
            add: (state, action: PayloadAction<T>) => {
                state.list.push(action.payload as Draft<T>);
            },
            update: (state, action: PayloadAction<T>) => {
                const index = state.list.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload as Draft<T>;
                }
            },
            remove: (state, action: PayloadAction<number>) => {
                state.list = state.list.filter(item => item.id !== action.payload);
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchThunk.pending, (state) => {
                    state.status = LoadingStatus.LOADING;
                })
                .addCase(fetchThunk.fulfilled, (state, action) => {
                    state.status = LoadingStatus.SUCCEEDED;
                    state.list = action.payload as Draft<T>[];
                })
                .addCase(fetchThunk.rejected, (state, action) => {
                    state.status = LoadingStatus.FAILED;
                    state.error = action.error.message || "Failed to load";
                });
        }
    });

    return {
        slice,
        fetchThunk,
        actions: slice.actions,
        reducer: slice.reducer
    };
}
