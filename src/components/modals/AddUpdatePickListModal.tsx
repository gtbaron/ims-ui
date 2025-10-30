import {Button, Dropdown, DropdownItem, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import React, {useRef, useState} from "react";
import {PickList} from "@/components/pickLists/PickList";
import {useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";

type AddUpdatePickListModalProps = {
    pickList: PickList;
    showModal?: boolean;
    handleResponse: (response: boolean, pickList: PickList) => void;
}

export const AddUpdatePickListModal: React.FC<AddUpdatePickListModalProps> = (props: AddUpdatePickListModalProps) => {
    const items: Item[] = useAppSelector((state) => state.items.list);
    const [pickList, setPickList] = useState(props.pickList);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleCloseModal = (response: boolean) => {
        props.handleResponse(response, pickList);
    }

    const setItemId = (itemId: number | undefined) => {
        if (!itemId) return;
        setPickList({...pickList, itemId: itemId});
    }

    const setQuantity = (quantity: number) => {
        setPickList({...pickList, quantity: quantity});
    }

    return (
        <Modal show={!!props.showModal} size="md" onClose={() => handleCloseModal(false)} popup initialFocus={nameInputRef}>
            <ModalHeader>
                {pickList.id ? 'Update' : 'Add'} pick list
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6 text-white">
                    <div className={'w-full'}>
                        <div className={'mb-1 block'}>
                            <span>Part</span>
                        </div>
                        <Dropdown
                            id={'itemsList'}
                            size={'sm'}
                            label={!pickList.itemId || pickList.itemId === 0 ? 'Select item...' : items.find(item => item.id === pickList.itemId)?.name || 'Select item...'}
                        >
                            <div className={'max-h-60 overflow-y-auto'}>
                                {items.map((item) => (
                                    <DropdownItem key={item.id} onClick={() => setItemId(item.id)} >{item.name}</DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    </div>
                    <div>
                        <div className={'mb-1 block'}>
                            <span>Quantity</span>
                        </div>
                        <TextInput
                            id='quantity'
                            value={pickList.quantity}
                            onChange={(event) => setQuantity(parseFloat(event.target.value))}
                            required
                            sizing={'sm'}
                            type='number'
                            min={0}
                            max={1000}
                            step='any'
                        />
                    </div>
                    <div className="w-full flex justify-between">
                        <Button color="gray" onClick={() => handleCloseModal(false)}>Cancel</Button>
                        <Button color={'green'}  onClick={() => handleCloseModal(true)}>{pickList.id ? 'Update' : 'Add'}</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}