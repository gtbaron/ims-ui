import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {ActionsTableCell} from "@/components/wrappers/actionsTableCell/ActionsTableCell";
import {callDeletePart} from "@/services/PartsService";
import {removePart} from "@/store/slices/PartsSlice";

export type PartsListProps = {
    handleEdit: (partId: number | undefined) => void;
};

const   PartsList: React.FC<PartsListProps> = (props: PartsListProps) => {
    const partsList = useAppSelector((state) => state.parts.list);
    const dispatch = useAppDispatch();

    const handleDelete = async (id: number, response: boolean) => {
        if (response) {
            const success = await callDeletePart(id);
            if (success) {
                dispatch(removePart(id))
            }
        }
    }

    return (
        <div className={'max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableHeadCell>Part</TableHeadCell>
                        <TableHeadCell>Provider</TableHeadCell>
                        <TableHeadCell>Bulk Price</TableHeadCell>
                        <TableHeadCell>Quantity</TableHeadCell>
                        <TableHeadCell>Unit Price</TableHeadCell>
                        <TableHeadCell>On Hand</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {partsList.map((part) => (
                        <TableRow key={part.id} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                            <TableCell>{part.name}</TableCell>
                            <TableCell>{part.provider}</TableCell>
                            <CurrencyTableCell value={part.bulkPrice}/>
                            <TableCell>{part.bulkQuantity}</TableCell>
                            <CurrencyTableCell value={part.bulkPrice / part.bulkQuantity}/>
                            <TableCell>{part.quantityOnHand}</TableCell>
                            <ActionsTableCell
                                href={part.url}
                                handleDelete={handleDelete}
                                handleEdit={props.handleEdit}
                                id={part.id}
                                displayName={part.name} />
                        </TableRow>
                    ))}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell colSpan={7} ></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default PartsList;
