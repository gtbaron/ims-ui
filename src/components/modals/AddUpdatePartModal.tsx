import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import React, {useRef, useState} from "react";
import {Part} from "@/components/parts/Part";

type AddUpdatePartModalProps = {
    part: Part;
    showModal?: boolean;
    handleResponse: (response: boolean, part: Part) => void;
}

export const AddUpdatePartModal: React.FC<AddUpdatePartModalProps> = (props: AddUpdatePartModalProps) => {
    const [part, setPart] = useState(props.part);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleCloseModal = (response: boolean) => {
        props.handleResponse(response, part);
    }

    const updatePartValue = (value: string, key: string) => {
        setPart({...part, [key]: value});
    }

    return (
        part && <Modal show={!!props.showModal} size="md" onClose={() => handleCloseModal(false)} popup initialFocus={nameInputRef}>
            <ModalHeader>
                {part.id ? 'Update' : 'Add'} part
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name">Name</Label>
                        </div>
                        <TextInput
                            id="name"
                            value={part.name}
                            onChange={(event) => updatePartValue(event.target.value, 'name')}
                            required
                            ref={nameInputRef}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="provider">Provider</Label>
                        </div>
                        <TextInput
                            id="provider"
                            value={part.provider}
                            onChange={(event) => updatePartValue(event.target.value, 'provider')}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="url">URL</Label>
                        </div>
                        <TextInput
                            id="url"
                            value={part.url}
                            onChange={(event) => updatePartValue(event.target.value, 'url')}
                            required
                        />
                    </div>
                    <div className={'flex flex-row justify-between'}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="bulkPrice">Bulk Price</Label>
                            </div>
                            <TextInput
                                id="bulkPrice"
                                value={part.bulkPrice}
                                onChange={(event) => updatePartValue(event.target.value, 'bulkPrice')}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="bulkQuantity">Bulk Quantity</Label>
                            </div>
                            <TextInput
                                id="bulkQuantity"
                                value={part.bulkQuantity}
                                onChange={(event) => updatePartValue(event.target.value, 'bulkQuantity')}
                                required
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-between">
                        <Button color="gray" onClick={() => handleCloseModal(false)}>Cancel</Button>
                        <Button color={'green'}  onClick={() => handleCloseModal(true)}>{part.id ? 'Update' : 'Add'}</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

