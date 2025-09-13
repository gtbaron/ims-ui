import React, {useEffect, useRef, useState} from "react";
import {callCreateItem, callUpdateItem} from "@/services/ItemsService";
import {addItem, updateItem} from "@/store/slices/ItemsSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {useNavigate} from "react-router-dom";
import {Button} from "flowbite-react";
import {ItemFinancials} from "@/components/items/ItemFinancials";
import {ItemDescription} from "@/components/items/ItemDescription";

export const ItemDetailsPage: React.FC = () => {
    const stateItem: Item = useAppSelector((state) => state.items.selectedItem);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [item, setItem] = useState(stateItem);

    const updateItemValue = (value: string | number, key: string) => {
        setItem({...item, [key]: value});
    }

    const handleAddUpdateItem = async () => {
        if (item.id) {
            const updatedItem = await callUpdateItem(item);
            dispatch(updateItem(updatedItem));
        } else {
            const createdItem = await callCreateItem(item);
            dispatch(addItem(createdItem));
        }
        navigate('/items');
    }

    return (
        <div>
            <div>
                <h1 className='text-white'>{item.id ? item.name : 'Add Item'}</h1>
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemDescription item={item} handleItemValueChanged={updateItemValue} />
                <ItemFinancials item={item} />
            </div>
            <div className={'bg-gray-800 rounded-xl space-y-6 text-left p-6 mb-3 w-full'}>
                Parts List
            </div>
            <div className="flex flex-row justify-between">
                <Button color={'gray'} size={'sm'} onClick={() => navigate(-1)}>Cancel</Button>
                <Button color={'green'} size={'sm'} className="btn btn-primary" onClick={handleAddUpdateItem}>Save</Button>
            </div>
        </div>
    )
}