import React, {useEffect, useState} from "react";
import {callCreateItem, callGetCostOfParts, callUpdateItem, callCreateItemParts} from "@/services/ItemsService";
import {addItem, updateItem} from "@/store/slices/ItemsSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {useNavigate} from "react-router-dom";
import {Button} from "flowbite-react";
import {ItemFinancials} from "@/components/items/ItemFinancials";
import {ItemDescription} from "@/components/items/ItemDescription";
import {ItemPartsList} from "@/components/items/ItemPartsList";
import {ItemPart} from "@/components/items/ItemPart";

export const ItemDetailsPage: React.FC = () => {
    const stateItem: Item = useAppSelector((state) => state.items.selectedItem);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [item, setItem] = useState(stateItem);
    const [costOfParts, setCostOfParts] = useState<number>(0);
    const [newItemParts, setNewItemParts] = useState<ItemPart[]>([]);
    const [suggestedListPrice, setSuggestedListPrice] = useState(0);

    useEffect(() => {
        const fetchCostOfParts = async () => {
            if (!item.id) return;
            try {
                const originalCostOfParts: number = await callGetCostOfParts(item.id);
                setCostOfParts(originalCostOfParts);
            } catch (err) {
                console.error('Error fetching cost of parts:', err);
            }
        }
        fetchCostOfParts();
    }, [setCostOfParts, item]);

    const updateItemValue = (value: string | number, key: string) => {
        setItem({...item, [key]: value});
    }

    const handleAddUpdateItem = async () => {
        if (item.id) {
            const toUpdate: Item = {...item, listPrice: item.listPrice === 0 ? suggestedListPrice : item.listPrice};
            const updatedItem = await callUpdateItem(toUpdate);
            dispatch(updateItem(updatedItem));

            await callCreateItemParts(item.id, newItemParts);
        } else {
            const createdItem = await callCreateItem(item);
            dispatch(addItem(createdItem));
        }
        navigate('/items');
    }

    const handleItemPartsCostChanged = (updatedCostOfParts: number) => {
        setCostOfParts(updatedCostOfParts);
    }

    const handleSuggestedListPriceChanged = (suggestedListPrice: number) => {
        setSuggestedListPrice(suggestedListPrice);
    }

    const handleAddItemPart = (itemPart: ItemPart) => {
        setNewItemParts([...newItemParts, itemPart]);
    }

    return (
        <div>
            <div className={'m-2'}>
                <h1 className='text-white'>{item.id ? item.name : 'Add Item'}</h1>
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemDescription item={item} handleItemValueChanged={updateItemValue} />
                <ItemFinancials item={item} costOfParts={costOfParts} handleSuggestedListPriceChanged={handleSuggestedListPriceChanged} />
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemPartsList item={item} handleItemPartsCostChanged={handleItemPartsCostChanged} handleItemPartAdded={handleAddItemPart} />
            </div>
            <div className="flex flex-row justify-between m-2">
                <Button color={'gray'} size={'sm'} onClick={() => navigate(-1)}>Cancel</Button>
                <Button color={'green'} size={'sm'} className="btn btn-primary" onClick={handleAddUpdateItem}>Save</Button>
            </div>
        </div>
    )
}