import React, {useEffect, useState} from "react";
import {ItemsList} from "@/components/items/ItemsList";
import {Button} from "flowbite-react";
import {callCreateItem, callGetItemParts, callGetItems, callUpdateItem} from "@/services/ItemsService";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {addItem, setItemsList, updateItem} from "@/store/slices/ItemsSlice";
import {AddUpdateItemModal} from "@/components/modals/addUpdateItemModal/AddUpdateItemModal";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";
import {Part} from "@/components/parts/Part";

const defaultItem: Item = {
    name: '',
    listPrice: 0,
    itemCategory: ItemCategory.HOME_DECOR,
    itemStatus: ItemStatus.DRAFT
};

export const ItemListPage: React.FC = () => {
    const items: Item[] = useAppSelector((state) => state.items.list);
    const [showAddUpdateItemModal, setShowAddUpdateItemModal] = useState(false);
    const [modalItem, setModalItem] = useState<Item>(defaultItem);
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
        let itemParts: Part[] = await callGetItemParts(itemId);
        itemParts = itemParts ? itemParts : [];
        console.log(itemParts);
    }

    return (
        <div>
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>Items</h1>
                <Button color={'gray'} size={'sm'} onClick={() => handleAdd()}>Add Item</Button>
            </div>
            <ItemsList handleEdit={handleEdit} handleShowPartsList={handleShowPartsList} />
            {showAddUpdateItemModal && <AddUpdateItemModal item={modalItem} showModal={showAddUpdateItemModal} handleResponse={handleAddUpdateItem} />}
        </div>
    )
}