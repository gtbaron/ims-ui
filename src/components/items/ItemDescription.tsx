import React, {useEffect, useRef} from "react";
import {Item} from "@/components/items/Item";
import {Checkbox, Dropdown, DropdownItem, Label, TextInput} from "flowbite-react";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";

type ItemDescriptionProps = {
    item: Item;
    handleItemValueChanged: (value: string, key: string) => void;
    updateItemValue: (value: string | number | boolean, key: string) => void;
}

export const ItemDescription: React.FC<ItemDescriptionProps> = (props: ItemDescriptionProps) => {
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    const handleOverrideSuggestedListPriceChanged = (override: boolean) => {
        props.updateItemValue(override, 'overrideSuggestedListPrice');
    }

    const {item, handleItemValueChanged} = props;
    return (
        <div className={'text-left w-1/2 m-2 bg-gray-800 text-gray-400 rounded-xl space-y-6 p-6'}>
            <div className="text-white text-left mb-3">
                <h2>Item Description</h2>
            </div>
            <div>
                <div className={'mb-1 block'}>
                    <span>Name</span>
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
                    <div className={'mb-1 block'}>
                        <span>List Price</span>
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
                    <div className={'mb-1 block'}>
                        <span>Category</span>
                    </div>
                    <Dropdown id={'itemCategory'} label={item.itemCategory} size={'sm'}>
                        {Object.values(ItemCategory).map((category) => (
                            <DropdownItem value={item.itemCategory} key={category} onClick={() => handleItemValueChanged(category, 'itemCategory')} >{category}</DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div>
                    <div className="mb-1 block">
                        <span>Status</span>
                    </div>
                    <Dropdown id={'itemStatus'} label={item.itemStatus} size={'sm'}>
                        {Object.values(ItemStatus).map((status) => (
                            <DropdownItem value={item.itemCategory} key={status} onClick={() => handleItemValueChanged(status, 'itemStatus')} >{status}</DropdownItem>
                        ))}
                    </Dropdown>
                </div>
            </div>
            <div className="flex items-start gap-2">
                <Checkbox
                    id="priceOverride"
                    checked={props.item.overrideSuggestedListPrice}
                    onChange={(e) => handleOverrideSuggestedListPriceChanged(e.target.checked)}
                />
                <Label className={'dark:text-gray-400'} htmlFor="priceOverride">Override suggested list price</Label>
            </div>
        </div>
    )
}