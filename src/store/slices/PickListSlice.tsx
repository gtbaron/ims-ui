import { createEntitySlice } from '../createEntitySlice';
import { callGetPickLists } from '@/services/PickListService';
import { PickList } from '@/components/pickLists/PickList';

const { slice, fetchThunk, actions, reducer } = createEntitySlice<PickList>({
    name: 'pickLists',
    fetchFn: callGetPickLists
});

export const fetchPickLists = fetchThunk;
export const pickListSlice = slice;
export const { add: addPickList, update: updatePickList, remove: removePickList } = actions;

export default reducer;