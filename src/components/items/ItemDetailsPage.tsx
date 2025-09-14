import React, {useState} from "react";
import {callCreateItem, callUpdateItem} from "@/services/ItemsService";
import {addItem, updateItem} from "@/store/slices/ItemsSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {useNavigate} from "react-router-dom";
import {Button} from "flowbite-react";
import {ItemFinancials} from "@/components/items/ItemFinancials";
import {ItemDescription} from "@/components/items/ItemDescription";
import {ItemPartsList} from "@/components/items/ItemPartsList";

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
            <div className={'m-2'}>
                <h1 className='text-white'>{item.id ? item.name : 'Add Item'}</h1>
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemDescription item={item} handleItemValueChanged={updateItemValue} />
                <ItemFinancials item={item} />
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemPartsList item={item} />
            </div>
            <div className="flex flex-row justify-between m-2">
                <Button color={'gray'} size={'sm'} onClick={() => navigate(-1)}>Cancel</Button>
                <Button color={'green'} size={'sm'} className="btn btn-primary" onClick={handleAddUpdateItem}>Save</Button>
            </div>
        </div>
    )
}