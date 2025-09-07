import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Item} from "@/components/items/Item";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {ActionsTableCell} from "@/components/wrappers/actionsTableCell/ActionsTableCell";
import {removeItem} from "@/store/slices/ItemsSlice";
import {callDeleteItem} from "@/services/ItemsService";
import {IoListOutline} from "react-icons/io5";

export type ItemsListProps = {
    handleEdit: (partId: number | undefined) => void;
    handleShowPartsList: (partId: number) => Promise<void>;
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
        <div className="overflow-x-auto">
            <Table striped>
                <TableHead>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>List Price</TableHeadCell>
                        <TableHeadCell>Category</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>Parts List</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {itemsList.map((item) => (
                        <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                            <TableCell>{item.name}</TableCell>
                            <CurrencyTableCell value={item.listPrice}/>
                            <TableCell>{item.itemCategory}</TableCell>
                            <TableCell>{item.itemStatus}</TableCell>
                            <TableCell className={'flex flex-row justify-around text-xl'}>
                                <IoListOutline className="text-gray-400 hover:text-gray-100"
                                    title="Update Parts List"
                                    onClick={() => {
                                        if (item.id) props.handleShowPartsList(item.id)
                                    }}
                                />
                            </TableCell>
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