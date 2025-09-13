import React, {useEffect, useRef} from "react";
import {Item} from "@/components/items/Item";
import {Dropdown, DropdownItem, Label, TextInput} from "flowbite-react";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";

type ItemDescriptionProps = {
    item: Item;
    handleItemValueChanged: (value: string, key: string) => void;
}

export const ItemDescription: React.FC<ItemDescriptionProps> = (props: ItemDescriptionProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    const {item, handleItemValueChanged} = props;
    return (
        <div className={'text-left w-1/2 m-2 bg-gray-800 rounded-xl space-y-6 p-6'}>
            <div className="text-white text-left mb-3">
                <h2>Item Description</h2>
            </div>
            <div>
                <div className="mb-1 block">
                    <Label htmlFor="name">Name</Label>
                </div>
                <TextInput
                    id="name"
                    value={item.name}
                    onChange={(event) => handleItemValueChanged(event.target.value, 'name')}
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
                        onChange={(event) => handleItemValueChanged(event.target.value, 'listPrice')}
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
                            <DropdownItem value={item.itemCategory} key={category} onClick={() => handleItemValueChanged(category, 'itemCategory')} >{category}</DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div>
                    <div className="mb-1 block">
                        <Label htmlFor="itemStatus">Status</Label>
                    </div>
                    <Dropdown id={'itemStatus'} label={item.itemStatus} size={'sm'}>
                        {Object.values(ItemStatus).map((status) => (
                            <DropdownItem value={item.itemCategory} key={status} onClick={() => handleItemValueChanged(status, 'itemStatus')} >{status}</DropdownItem>
                        ))}
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}