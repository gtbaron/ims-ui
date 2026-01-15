import React from "react";
import {DisplayMissingPart} from "@/components/pickLists/PickListsList";
import {
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow
} from "flowbite-react";

export type MissingPartsModalProps = {
    missingParts: DisplayMissingPart[];
    showDialog: boolean;
    handleClose: () => void;
}

export const MissingPartsModal: React.FC<MissingPartsModalProps> = (props: MissingPartsModalProps) => {
    return (
        <Modal show={props.showDialog} size="xl" onClose={() => props.handleClose()} popup>
            <ModalHeader>Insufficient Parts</ModalHeader>
            <ModalBody>
                <div className="text-center">
                    <Table striped>
                        <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableHeadCell>Item</TableHeadCell>
                                <TableHeadCell>Required</TableHeadCell>
                                <TableHeadCell>On Hand</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {props.missingParts.map((part) => {
                                return <TableRow key={part.name} className={`bg-white dark:border-gray-700 dark:bg-gray-800`}>
                                    <TableCell>{part.name}</TableCell>
                                    <TableCell className={'text-center'}>{part.quantityRequired}</TableCell>
                                    <TableCell className={'text-center'}>{part.quantityOnHand}</TableCell>
                                </TableRow>
                            })}
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell colSpan={7} ></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </ModalBody>
        </Modal>
    )
}