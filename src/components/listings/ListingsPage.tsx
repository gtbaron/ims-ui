import React, {useEffect} from "react";
import {ListingsList} from "@/components/listings/ListingsList";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useNavigate} from "react-router-dom";
import {setSelectedItem} from "@/store/slices/ItemsSlice";
import {Item} from "@/components/items/Item";
import {fetchListings} from "@/store/slices/ListingsSlice";

export const ListingsPage: React.FC = () => {
    const items: Item[] = useAppSelector((state) => state.items.list);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    const handleRowClick = (itemId: number) => {
        const clickedItem = items.find(item => item.id === itemId);
        if (clickedItem) {
            dispatch(setSelectedItem(clickedItem));
            navigate('/item-details');
        }
    }

    return (
        <div>
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>Listings</h1>
            </div>
            <ListingsList handleRowClick={handleRowClick} />
        </div>
    );
}
