import {Item} from "@/components/items/Item";
import {useRef, useState} from "react";
import {Button, Dropdown, DropdownItem, Label, Modal, ModalBody, ModalHeader, TextInput} from "flowbite-react";
import {ItemCategory} from "@/components/items/ItemCategory";
import {ItemStatus} from "@/components/items/ItemStatus";

type AddUpdateItemModalProps = {
    item: Item;
    showModal?: boolean;
    handleResponse: (response: boolean, item: Item) => void;
}

export const AddUpdateItemModal: React.FC<AddUpdateItemModalProps> = (props: AddUpdateItemModalProps) => {
    const [item, setItem] = useState(props.item);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleCloseModal = (response: boolean) => {
        props.handleResponse(response, item);
    }

    const updateItemValue = (value: string, key: string) => {
        setItem({...item, [key]: value});
    }

    return (
        item && <Modal show={!!props.showModal} size="md" onClose={() => handleCloseModal(false)} popup initialFocus={nameInputRef}>
            <ModalHeader />
            <ModalBody>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{item.id ? 'Update' : 'Add'} item</h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="name">Name</Label>
                        </div>
                        <TextInput
                            id="name"
                            value={item.name}
                            onChange={(event) => updateItemValue(event.target.value, 'name')}
                            required
                            ref={nameInputRef}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="listPrice">List Price</Label>
                        </div>
                        <TextInput
                            id="listPrice"
                            value={item.listPrice}
                            onChange={(event) => updateItemValue(event.target.value, 'listPrice')}
                            required
                        />
                    </div>
                    {/*<div>*/}
                    {/*    <div className="mb-2 block">*/}
                    {/*        <Label htmlFor="url">URL</Label>*/}
                    {/*    </div>*/}
                    {/*    <TextInput*/}
                    {/*        id="url"*/}
                    {/*        value={part.url}*/}
                    {/*        onChange={(event) => updatePartValue(event.target.value, 'url')}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className={'side-by-side'}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="itemCategory">Category</Label>
                            </div>
                            <Dropdown id={'itemCategory'} label={item.itemCategory} size={'sm'}>
                                {Object.values(ItemCategory).map((category) => (
                                    <DropdownItem value={item.itemCategory} key={category} onClick={() => updateItemValue(category, 'itemCategory')} >{category}</DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="itemStatus">Status</Label>
                            </div>
                            <Dropdown id={'itemStatus'} label={item.itemStatus} size={'sm'}>
                                {Object.values(ItemStatus).map((status) => (
                                    <DropdownItem value={item.itemCategory} key={status} onClick={() => updateItemValue(status, 'itemStatus')} >{status}</DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                        {/*<div>*/}
                        {/*    <div className="mb-2 block">*/}
                        {/*        <Label htmlFor="bulkQuantity">Bulk Quantity</Label>*/}
                        {/*    </div>*/}
                        {/*    <TextInput*/}
                        {/*        id="bulkQuantity"*/}
                        {/*        value={part.bulkQuantity}*/}
                        {/*        onChange={(event) => updatePartValue(event.target.value, 'bulkQuantity')}*/}
                        {/*        required*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                    <div className="w-full flex justify-between">
                        <Button color="gray" onClick={() => handleCloseModal(false)}>Cancel</Button>
                        <Button onClick={() => handleCloseModal(true)}>{item.id ? 'Update' : 'Add'}</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}