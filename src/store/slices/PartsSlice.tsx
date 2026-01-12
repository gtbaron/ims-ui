import { createEntitySlice } from '../createEntitySlice';
import { Part } from '@/components/parts/Part';
import { callGetParts } from '@/services/PartsService';

const { slice, fetchThunk, actions, reducer } = createEntitySlice<Part>({
    name: 'parts',
    fetchFn: callGetParts,
    sortFn: (a, b) => a.name.localeCompare(b.name)
});

export const fetchParts = fetchThunk;
export const partsSlice = slice;
export const { add: addPart, update: updatePart, remove: removePart } = actions;

export default reducer;