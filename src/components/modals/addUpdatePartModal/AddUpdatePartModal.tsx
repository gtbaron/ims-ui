import {Button, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import {useState} from "react";
import {PartType} from "@/components/parts/part/Part";
import './AddUpdatePartModal.css'
import {usdFormatter} from "@/utils/FormatUtils";

type AddUpdatePartModalProps = {
    part: PartType;
    showModal?: boolean;
    handleResponse: (response: boolean, part: PartType) => void;
}

export const AddUpdatePartModal = (props: AddUpdatePartModalProps) => {
    const [part, setPart] = useState(props.part);

    const handleCloseModal = (response: boolean) => {
        props.handleResponse(response, part);
    }

    const updatePartValue = (value: string, key: string) => {
        setPart({...part, [key]: value});
    }

    return (
        part && <Modal show={!!props.showModal} size="md" onClose={() => handleCloseModal(false)} popup>
            <ModalHeader />
            <ModalBody>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{part.id ? 'Update' : 'Add'} part</h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name">Name</Label>
                        </div>
                        <TextInput
                            id="name"
                            value={part.name}
                            onChange={(event) => updatePartValue(event.target.value, 'name')}
                            required
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
                    <div className={'side-by-side'}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="bulkPrice">Bulk Price</Label>
                            </div>
                            <TextInput
                                id="bulkPrice"
                                value={usdFormatter.format(part.bulkPrice)}
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
                    <div className="w-full flex justify-end">
                        <Button onClick={() => handleCloseModal(true)}>{part.id ? 'Update' : 'Add'}</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

