import React, {useMemo} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Part} from "@/components/parts/Part";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell";
import {SortableTableHeadCell} from "@/components/wrappers/SortableTableHeadCell";
import {callDeletePart} from "@/services/PartsService";
import {removePart} from "@/store/slices/PartsSlice";
import {useSortableTable} from "@/hooks/useSortableTable";

export type PartsListProps = {
    handleEdit: (partId: number | undefined) => void;
};

interface DisplayPart extends Part {
    unitPrice: number;
}

const PartsList: React.FC<PartsListProps> = (props: PartsListProps) => {
    const partsList = useAppSelector((state) => state.parts.list);
    const dispatch = useAppDispatch();

    const displayParts: DisplayPart[] = useMemo(() =>
        partsList.map(part => ({
            ...part,
            unitPrice: part.bulkPrice / part.bulkQuantity
        })),
        [partsList]
    );

    const { sortedData, sortConfig, handleSort } = useSortableTable(displayParts, 'name');

    const handleDelete = async (id: number) => {
        const success = await callDeletePart(id);
        if (success) {
            dispatch(removePart(id))
        }
    }

    return (
        <div className={'max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <SortableTableHeadCell columnKey="name" sortConfig={sortConfig} onSort={handleSort}>
                            Part
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="provider" sortConfig={sortConfig} onSort={handleSort}>
                            Provider
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="bulkPrice" sortConfig={sortConfig} onSort={handleSort}>
                            Bulk Price
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="bulkQuantity" sortConfig={sortConfig} onSort={handleSort}>
                            Quantity
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="unitPrice" sortConfig={sortConfig} onSort={handleSort}>
                            Unit Price
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="quantityOnHand" sortConfig={sortConfig} onSort={handleSort}>
                            On Hand
                        </SortableTableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {sortedData.map((part) => {
                        const textColor = part.quantityOnHand > 0 ? '' : 'text-red-500';
                        return <TableRow key={part.id} className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${textColor}`}>
                            <TableCell>{part.name}</TableCell>
                            <TableCell>{part.provider}</TableCell>
                            <CurrencyTableCell value={part.bulkPrice}/>
                            <TableCell>{part.bulkQuantity}</TableCell>
                            <CurrencyTableCell value={part.unitPrice}/>
                            <TableCell>{part.quantityOnHand}</TableCell>
                            <ActionsTableCell
                                displayName={part.name}
                                actions={[
                                    ...(part.url ? [{ type: 'link' as const, href: part.url }] : []),
                                    { type: 'edit', onEdit: () => props.handleEdit(part.id) },
                                    { type: 'delete', onDelete: () => handleDelete(part.id!) }
                                ]}
                            />
                        </TableRow>
                    })}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell colSpan={7} ></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default PartsList;
