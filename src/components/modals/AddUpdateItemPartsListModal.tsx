import React, {useState} from "react";
import {ItemPart} from "@/components/items/ItemPart";
import {useAppSelector} from "@/store/hooks";
import {Part} from "@/components/parts/Part";
import {Modal, ModalBody, ModalHeader, Table, TableBody, TableHead, TableHeadCell, TableRow} from "flowbite-react";

type AddUpdateItemPartsListProps = {
    itemId: number;
    itemParts: ItemPart[];
    displayName: string;
    showModal?: boolean;
    handleResponse: (response: boolean, itemId: number, itemParts: ItemPart[]) => void;
};

export const AddUpdateItemPartsListModal: React.FC<AddUpdateItemPartsListProps> = (props: AddUpdateItemPartsListProps) => {
    const parts: Part[] = useAppSelector((state) => state.parts.list);
    const [partsList, setItemPartsList] = useState<ItemPart[]>([]);

    const handleCloseModal = (response: boolean) => {
        props.handleResponse(response, props.itemId, partsList);
    }

    return (
        props.itemParts && <Modal show={props.showModal} size="3xl" onClose={() => handleCloseModal(false)} popup >
            <ModalHeader>
                {props.displayName}
            </ModalHeader>
            <ModalBody>
                <div className={'space-y-8'}>
                    <Table striped>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Part</TableHeadCell>
                                <TableHeadCell>Unit Const</TableHeadCell>
                                <TableHeadCell>Quantity</TableHeadCell>
                                <TableHeadCell>Product Cost</TableHeadCell>
                                <TableHeadCell>Actions</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">

                        </TableBody>
                    </Table>
                </div>
            </ModalBody>
        </Modal>
    )
}