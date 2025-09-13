import React, {useEffect, useRef, useState} from "react";
import {callCreateItem, callUpdateItem} from "@/services/ItemsService";
import {addItem, updateItem} from "@/store/slices/ItemsSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {useNavigate} from "react-router-dom";
import {Button, Dropdown, DropdownItem, Label, TextInput} from "flowbite-react";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";

export const ItemDetailsPage: React.FC = () => {
    const stateItem: Item = useAppSelector((state) => state.items.selectedItem);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [item, setItem] = useState(stateItem);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    const updateItemValue = (value: string, key: string) => {
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
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>{item.id ? item.name : 'Add Item'}</h1>
            </div>
            <div className={'mb-3 flex flex-row justify-between'}>
                <div className="bg-gray-800 rounded-xl space-y-6 text-left w-1/2 p-6 mr-3">
                    <div>
                        <div className="mb-1 block">
                            <Label htmlFor="name">Name</Label>
                        </div>
                        <TextInput
                            id="name"
                            value={item.name}
                            onChange={(event) => updateItemValue(event.target.value, 'name')}
                            required
                            ref={nameInputRef}
                            sizing={'sm'}
                        />
                    </div>
                    <div className={'flex flex-row justify-between'}>
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="listPrice">List Price</Label>
                            </div>
                            <TextInput
                                id="listPrice"
                                value={item.listPrice}
                                onChange={(event) => updateItemValue(event.target.value, 'listPrice')}
                                required
                                sizing={'sm'}
                            />
                        </div>
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="itemCategory">Category</Label>
                            </div>
                            <Dropdown id={'itemCategory'} label={item.itemCategory} size={'sm'}>
                                {Object.values(ItemCategory).map((category) => (
                                    <DropdownItem value={item.itemCategory} key={category} onClick={() => updateItemValue(category, 'itemCategory')} >{category}</DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                        <div>
                            <div className="mb-1 block">
                                <Label htmlFor="itemStatus">Status</Label>
                            </div>
                            <Dropdown id={'itemStatus'} label={item.itemStatus} size={'sm'}>
                                {Object.values(ItemStatus).map((status) => (
                                    <DropdownItem value={item.itemCategory} key={status} onClick={() => updateItemValue(status, 'itemStatus')} >{status}</DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>

                </div>
                <div className="bg-gray-800 rounded-xl space-y-6 text-left w-1/2 p-6">
                    <div>
                        <div className="mb-1 block">
                            <Label htmlFor="description">Description</Label>
                        </div>
                    </div>
                </div>
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