import React, {useRef, useState} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import {ItemPart} from "@/components/items/ItemPart";

type EditItemPartModalProps = {
    itemPart: ItemPart;
    itemPartName: string;
    showModal: boolean;
    handleResponse: (response: boolean, itemPart: ItemPart) => void;
}

export const EditItemPartModal: React.FC<EditItemPartModalProps> = (props: EditItemPartModalProps) => {
    const [quantity, setQuantity] = useState<string>(props.itemPart.quantity.toString());
    const quantityInputRef = useRef<HTMLInputElement>(null);

    const handleCloseModal = (response: boolean) => {
        const parsedQuantity = parseFloat(quantity);
        const finalQuantity = isNaN(parsedQuantity) ? props.itemPart.quantity : parsedQuantity;
        props.handleResponse(response, {...props.itemPart, quantity: finalQuantity});
    }

    return (
        <Modal show={props.showModal} size="md" onClose={() => handleCloseModal(false)} popup initialFocus={quantityInputRef}>
            <ModalHeader className={'m-3'}>
                {props.itemPartName}
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="quantity">Quantity</Label>
                        </div>
                        <TextInput
                            id="quantity"
                            type="number"
                            step="any"
                            inputMode="decimal"
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            required
                            ref={quantityInputRef}
                        />
                    </div>
                    <div className="w-full flex justify-between">
                        <Button color={'gray'} onClick={() => handleCloseModal(false)}>Cancel</Button>
                        <Button onClick={() => handleCloseModal(true)}>Update</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}