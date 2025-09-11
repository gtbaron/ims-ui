import React, {useEffect} from "react";
import {ItemsList} from "@/components/items/ItemsList";
import {Button} from "flowbite-react";
import {callGetItems} from "@/services/ItemsService";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {setItemsList, setSelectedItem} from "@/store/slices/ItemsSlice";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";
import {useNavigate} from "react-router-dom";

const defaultItem: Item = {
    name: '',
    listPrice: 0,
    itemCategory: ItemCategory.HOME_DECOR,
    itemStatus: ItemStatus.DRAFT
};

export const ItemListPage: React.FC = () => {
    const items: Item[] = useAppSelector((state) => state.items.list);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data: Item[] = await callGetItems();
                dispatch(setItemsList(data));
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchItems();
    }, [dispatch]);

    const handleEdit = (itemId: number | undefined) => {
        if (!itemId) return;

        const clickedItem = items.find(item => item.id === itemId);
        if (clickedItem) {
            dispatch(setSelectedItem(clickedItem));
            navigate('/item-details');
        }
    }

    const handleAdd = () => {
        dispatch(setSelectedItem(defaultItem));
        navigate('/item-details');
    }

    return (
        <div>
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>Items</h1>
                <Button color={'gray'} size={'sm'} onClick={handleAdd}>Add Item</Button>
            </div>
            <ItemsList handleEdit={handleEdit} />
        </div>
    )
}