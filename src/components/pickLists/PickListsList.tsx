import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell/ActionsTableCell";
import {useAppSelector} from "@/store/hooks";
import {PickList} from "@/components/pickLists/PickList";
import {Item} from "@/components/items/Item";

type DisplayPickList = PickList & {
    name: string,
}

export const PickListsList: React.FC = () => {
    const pickLists: PickList[] = useAppSelector((state) => state.pickLists.list);
    const items: Item[] = useAppSelector((state) => state.items.list);
    const [displayPickList, setDisplayPickList] = useState<DisplayPickList[]>([]);

    useEffect(() => {
        const displayList = pickLists.map(pickList => {
            const item = items.filter(item => item.id === pickList.itemId)[0];
            return {
                ...pickList,
                name: item ? item.name : ''
            }
        });
        setDisplayPickList(displayList);
    }, [items, pickLists]);

    const handlePickListPullResponse = (id: number | undefined, response: boolean) => {

    }

    return (
        <div className={'text-white max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableHeadCell>Item</TableHeadCell>
                        <TableHeadCell>Quantity</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {displayPickList.map((pickList) => {
                        return <TableRow key={pickList.id} className={`bg-white dark:border-gray-700 dark:bg-gray-800`}>
                            <TableCell>{pickList.name}</TableCell>
                            <TableCell>{pickList.quantity}</TableCell>
                            <TableCell>{pickList.pickListStatus}</TableCell>
                            <ActionsTableCell
                                // handleDelete={handleDelete}
                                // handleEdit={props.handleEdit}
                                id={pickList.id}
                                displayName={pickList.name}
                                handleAlt={handlePickListPullResponse}
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