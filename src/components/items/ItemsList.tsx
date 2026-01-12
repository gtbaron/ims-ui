import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell";
import {SortableTableHeadCell} from "@/components/wrappers/SortableTableHeadCell";
import {removeItem} from "@/store/slices/ItemsSlice";
import {callDeleteItem} from "@/services/ItemsService";
import {useSortableTable} from "@/hooks/useSortableTable";

export type ItemsListProps = {
    handleEdit: (partId: number | undefined) => void;
}

export const ItemsList: React.FC<ItemsListProps> = (props: ItemsListProps) => {
    const itemsList: Item[] = useAppSelector((state) => state.items.list);
    const dispatch = useAppDispatch();
    const { sortedData, sortConfig, handleSort } = useSortableTable(itemsList, 'name');

    const handleDelete = async (id: number, response: boolean) => {
        if (response) {
            const success = await callDeleteItem(id);
            if (success) {
                dispatch(removeItem(id))
            }
        }
    }

    return (
        <div className={'max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                        <SortableTableHeadCell columnKey="name" sortConfig={sortConfig} onSort={handleSort}>
                            Name
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="itemCategory" sortConfig={sortConfig} onSort={handleSort}>
                            Category
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="itemStatus" sortConfig={sortConfig} onSort={handleSort}>
                            Status
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="listPrice" sortConfig={sortConfig} onSort={handleSort}>
                            List Price
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="quantityOnHand" sortConfig={sortConfig} onSort={handleSort}>
                            On Hand
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="desiredQuantity" sortConfig={sortConfig} onSort={handleSort}>
                            Desired Quantity
                        </SortableTableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {sortedData.map((item) => {
                        const textColor = item.quantityOnHand < item.desiredQuantity ? (item.quantityOnHand > item.desiredQuantity / 2 ? 'text-yellow-400' : 'text-red-500') : '';
                        return <TableRow key={item.id} className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${textColor}`}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.itemCategory}</TableCell>
                            <TableCell>{item.itemStatus}</TableCell>
                            <CurrencyTableCell value={item.listPrice}/>
                            <TableCell>{item.quantityOnHand}</TableCell>
                            <TableCell>{item.desiredQuantity}</TableCell>
                            <ActionsTableCell
                                handleDelete={handleDelete}
                                canEdit={true}
                                handleEdit={props.handleEdit}
                                id={item.id}
                                displayName={item.name}
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
