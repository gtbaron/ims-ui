import React, {useEffect, useState} from "react";
import {
    callCreateItem,
    callCreateItemParts, callDeleteItemParts,
    callGetCostOfParts,
    callGetItemParts,
    callUpdateItem, callUpdateItemParts
} from "@/services/ItemsService";
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
    const [itemPartsList, setItemPartsList] = useState<ItemPart[]>([]);
    const [newItemParts, setNewItemParts] = useState<ItemPart[]>([]);
    const [itemPartsToDelete, setItemPartsToDelete] = useState<ItemPart[]>([])
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

    useEffect(() => {
        const fetchItemParts = async (item: Item) => {
            if (!item || !item.id) return;
            try {
                const data: ItemPart[] = await callGetItemParts(item.id);
                setItemPartsList(data);
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchItemParts(item);
    }, [item, setItemPartsList]);

    const updateItemValue = (value: string | number | boolean, key: string) => {
        setItem({...item, [key]: value});
    }

    const handleAddUpdateItem = async () => {
        if (item.id) {
            const toUpdate: Item = {...item, listPrice: item.overrideSuggestedListPrice ? item.listPrice : suggestedListPrice};
            const updatedItem = await callUpdateItem(toUpdate);
            dispatch(updateItem(updatedItem));

            await callCreateItemParts(item.id, newItemParts);
            await callUpdateItemParts(itemPartsList.filter(ip => ip.dirty));
            await callDeleteItemParts(itemPartsToDelete);
        } else {
            const toAdd = {...item, listPrice: item.overrideSuggestedListPrice ? item.listPrice : suggestedListPrice};
            const createdItem = await callCreateItem(toAdd);
            dispatch(addItem(createdItem));

            await callCreateItemParts(createdItem.id, newItemParts);
            await callUpdateItemParts(itemPartsList.filter(ip => ip.dirty));
        }

        navigate('/items');
    }

    const handleItemPartsCostChanged = (updatedCostOfParts: number) => {
        setCostOfParts(updatedCostOfParts);
    }

    const handleSuggestedListPriceChanged = (suggestedListPrice: number) => {
        setSuggestedListPrice(suggestedListPrice);
    }

    const handleAddUpdateItemPart = (itemPart: ItemPart) => {
        if (itemPart.id) {
            itemPart.dirty = true;
            const updatedPartsList = itemPartsList.filter(ip => ip.id !== itemPart.id);
            updatedPartsList.push(itemPart);
            updatedPartsList.sort((a, b) => a.partId - b.partId);
            setItemPartsList(updatedPartsList);
            return;
        } else {
            const newlyAddedPart = newItemParts.filter(ip => ip.partId === itemPart.partId)[0];
            if (!newlyAddedPart) {
                setNewItemParts([...newItemParts, itemPart]);
            } else {
                const updatedNewItemParts = newItemParts.filter(ip => ip.partId !== itemPart.partId);
                updatedNewItemParts.push(itemPart);
                setNewItemParts(updatedNewItemParts);
            }
        }


    }

    const handleItemPartDeleted = (itemPartIdToDelete: number, altId?: number) => {
        if (itemPartIdToDelete !== 0) {
            const itemPartToDelete = itemPartsList.find(ip => ip.id === itemPartIdToDelete);
            if (!itemPartToDelete) return;

            setItemPartsToDelete([...itemPartsToDelete, itemPartToDelete]);
            const updatedPartsList = itemPartsList.filter(ip => ip.id !== itemPartIdToDelete);
            setItemPartsList(updatedPartsList);
        } else {
            setNewItemParts(newItemParts.filter(ip => ip.partId !== altId   ));
        }
    }

    return (
        <div>
            <div className={'m-2'}>
                <h1 className='text-white'>{item.id ? item.name : 'Add Item'}</h1>
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemDescription item={item} handleItemValueChanged={updateItemValue} updateItemValue={updateItemValue} />
                <ItemFinancials
                    item={item}
                    costOfParts={costOfParts}
                    handleSuggestedListPriceChanged={handleSuggestedListPriceChanged}
                />
            </div>
            <div className={'mb-3 flex flex-row gap-3'}>
                <ItemPartsList
                    item={item}
                    itemPartsList={itemPartsList.length > 0 ? itemPartsList : newItemParts}
                    handleItemPartsCostChanged={handleItemPartsCostChanged}
                    handleAddUpdateItemPart={handleAddUpdateItemPart}
                    handleItemPartDeleted={handleItemPartDeleted}
                />
            </div>
            <div className="flex flex-row justify-between m-2">
                <Button color={'gray'} size={'sm'} onClick={() => navigate(-1)}>Cancel</Button>
                <Button color={'green'} size={'sm'} className="btn btn-primary" onClick={handleAddUpdateItem}>Save</Button>
            </div>
        </div>
    )
}