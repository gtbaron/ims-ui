import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {ActionsTableCell} from "@/components/wrappers/actionsTableCell/ActionsTableCell";
import {callDeletePart} from "@/services/PartsService";
import {removePart} from "@/store/slices/partsListSlice";
import {IoAdd} from "react-icons/io5";

export type PartsListProps = {
    handleEdit: (partId: number | undefined) => void;
    handleAdd: () => void;

};

const   PartsList: React.FC<PartsListProps> = (props: PartsListProps) => {
    const parts = useAppSelector((state) => state.partsList.partsList);
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
        <div className="overflow-x-auto">
            <Table striped>
                <TableHead>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableHeadCell>Part</TableHeadCell>
                        <TableHeadCell>Provider</TableHeadCell>
                        <TableHeadCell>Bulk Price</TableHeadCell>
                        <TableHeadCell>Quantity</TableHeadCell>
                        <TableHeadCell>Unit Price</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {parts.map((part) => (
                        <TableRow key={part.id} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                            <TableCell>{part.name}</TableCell>
                            <TableCell>{part.provider}</TableCell>
                            <CurrencyTableCell value={part.bulkPrice}/>
                            <TableCell>{part.bulkQuantity}</TableCell>
                            <CurrencyTableCell value={part.bulkPrice / part.bulkQuantity}/>
                            <ActionsTableCell
                                href={part.url}
                                handleDelete={handleDelete}
                                handleEdit={props.handleEdit}
                                id={part.id}
                                displayName={part.name} />
                        </TableRow>
                    ))}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell title="Add part" colSpan={6} className="cursor-pointer" onClick={() => props.handleAdd()}>
                            <IoAdd className="float-right text-white text-2xl" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default PartsList;
