import React, {useMemo} from "react";
import {useAppSelector} from "@/store/hooks";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {ActionsTableCell} from "@/components/wrappers/actionsTableCell/ActionsTableCell";

export const ItemsInventory: React.FC = () => {
    const items = useAppSelector((state) => state.items.list);
    const itemsInventory = useAppSelector((state) => state.itemsInventory.list);

    const inventoryDisplayList = useMemo(() => {
        const itemById = new Map(items.map(item => [item.id, item]));
        return (itemsInventory ?? []).map(itemInventory => ({
            id: itemById.get(itemInventory.itemId)?.id,
            altId: itemInventory.itemId,
            name: itemById.get(itemInventory.itemId)?.name,
            quantity: itemInventory.quantity,
        }));
    }, [items, itemsInventory]);

    return (
        <div className={'max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Quantity</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {inventoryDisplayList.map((itemInventory) => (
                        <TableRow key={itemInventory.id} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                            <TableCell>{itemInventory.name}</TableCell>
                            <TableCell>{itemInventory.quantity}</TableCell>
                            <ActionsTableCell
                                // handleDelete={handleDelete}
                                // handleEdit={props.handleEdit}
                                id={itemInventory.id}
                                altId={itemInventory.altId}
                                displayName={itemInventory.name || 'UNKNOWN'}
                            />
                        </TableRow>
                    ))}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell colSpan={5} ></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}