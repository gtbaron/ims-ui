import React, {useEffect, useState} from "react";
import {ItemsList} from "@/components/items/ItemsList";
import {Button} from "flowbite-react";
import {callCreateItem, callGetItemParts, callGetItems, callUpdateItem} from "@/services/ItemsService";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {addItem, setItemsList, updateItem} from "@/store/slices/ItemsSlice";
import {AddUpdateItemModal} from "@/components/modals/AddUpdateItemModal";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";
import {ItemPart} from "@/components/items/ItemPart";
import {AddUpdateItemPartsListModal} from "@/components/modals/AddUpdateItemPartsListModal";

const defaultItem: Item = {
    name: '',
    listPrice: 0,
    itemCategory: ItemCategory.HOME_DECOR,
    itemStatus: ItemStatus.DRAFT
};

export const ItemListPage: React.FC = () => {
    const items: Item[] = useAppSelector((state) => state.items.list);
    const [showPartsListModal, setShowPartsListModal] = useState(false);
    const [showAddUpdateItemModal, setShowAddUpdateItemModal] = useState(false);
    const [modalItem, setModalItem] = useState<Item>(defaultItem);
    const [partsListItemId, setPartsListItemId] = useState<number>(0);
    const [itemPartsList, setItemPartsList] = useState<ItemPart[]>([]);
    const [displayName, setDisplayName] = useState('');

    const dispatch = useAppDispatch();


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
            setModalItem(clickedItem);
            setShowAddUpdateItemModal(true);
        }
    }

    const handleAdd = () => {
        setModalItem(defaultItem);
        setShowAddUpdateItemModal(true);
    }

    const handleAddUpdateItem = async (submit: boolean, item: Item) => {
        setShowAddUpdateItemModal(false);
        if (submit) {
            if (item.id) {
                const updatedItem = await callUpdateItem(item);
                dispatch(updateItem(updatedItem));
            } else {
                const createdItem = await callCreateItem(item);
                dispatch(addItem(createdItem));
            }
        }
    }

    const handleShowPartsList = async (itemId: number) => {
        const clickedItem = items.find(item => item.id === itemId);
        if (!clickedItem) return;

        let itemParts: ItemPart[] = await callGetItemParts(itemId);
        itemParts = itemParts ? itemParts : [];
        setItemPartsList(itemParts);
        setPartsListItemId(itemId);
        setShowPartsListModal(true);
        setDisplayName(clickedItem.name);
    }

    const handleAddUpdatePartsList = (response: boolean, itemId: number, itemParts: ItemPart[]) => {
        console.log('handleAddUpdatePartsList', response, itemId, itemParts);
        setShowPartsListModal(false);
        if (!response) return;

    }

    return (
        <div>
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>Items</h1>
                <Button color={'gray'} size={'sm'} onClick={() => handleAdd()}>Add Item</Button>
            </div>
            <ItemsList handleEdit={handleEdit} handleShowPartsList={handleShowPartsList} />
            {showAddUpdateItemModal && <AddUpdateItemModal item={modalItem} showModal={showAddUpdateItemModal} handleResponse={handleAddUpdateItem} />}
            {showPartsListModal && <AddUpdateItemPartsListModal showModal={showPartsListModal} itemId={partsListItemId} displayName={displayName} itemParts={itemPartsList} handleResponse={handleAddUpdatePartsList} />}
        </div>
    )
}