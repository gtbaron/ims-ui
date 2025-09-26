import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {ActionsTableCell} from "@/components/wrappers/actionsTableCell/ActionsTableCell";
import {removeItem} from "@/store/slices/ItemsSlice";
import {callDeleteItem} from "@/services/ItemsService";

export type ItemsListProps = {
    handleEdit: (partId: number | undefined) => void;
}

export const ItemsList: React.FC<ItemsListProps> = (props: ItemsListProps) => {
    const itemsList: Item[] = useAppSelector((state) => state.items.list);
    const dispatch = useAppDispatch();

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
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Category</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>List Price</TableHeadCell>
                        <TableHeadCell>On Hand</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {itemsList.map((item) => (
                        <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.itemCategory}</TableCell>
                            <TableCell>{item.itemStatus}</TableCell>
                            <CurrencyTableCell value={item.listPrice}/>
                            <TableCell>{item.quantityOnHand}</TableCell>
                            <ActionsTableCell
                                handleDelete={handleDelete}
                                handleEdit={props.handleEdit}
                                id={item.id}
                                displayName={item.name}
                            />
                        </TableRow>
                    ))}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell colSpan={6} ></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}