import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {PickList, PickListStatus} from "@/components/pickLists/PickList";
import {Item} from "@/components/items/Item";
import {callDeletePickList, callPullPickList} from "@/services/PickListService";
import {removePickList, updatePickList} from "@/store/slices/PickListSlice";
import {Part} from "@/components/parts/Part";
import {MissingPartsModal} from "@/components/modals/MissingPartsModal";

type DisplayPickList = PickList & {
    name: string,
}

export type DisplayMissingPart = {
    name: string,
    quantityOnHand: number,
}

type PickListsListProps = {
    handleEdit: (partId: number | undefined) => void;
}

export const PickListsList: React.FC<PickListsListProps> = (props: PickListsListProps) => {
    const pickLists: PickList[] = useAppSelector((state) => state.pickLists.list);
    const items: Item[] = useAppSelector((state) => state.items.list);
    const parts: Part[] = useAppSelector((state) => state.parts.list);
    const [displayPickList, setDisplayPickList] = useState<DisplayPickList[]>([]);
    const [missingParts, setMissingParts] = useState<DisplayMissingPart[]>([])
    const [showMissingParts, setShowMissingParts] = useState<boolean>(false);
    const dispatch = useAppDispatch();

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

    const handleDelete = async (id: number, response: boolean) => {
        if (response) {
            const success = await callDeletePickList(id);
            if (success) {
                dispatch(removePickList(id))
            }
        }
    }

    const handlePickListPullResponse = async (id: number | undefined, response: boolean) => {
        if (!response || !id) return;
        const existing = await callPullPickList(id);
        dispatch(updatePickList(existing));
    }

    const handleShowMissingParts = (id: number) => {
        const toShow: PickList = pickLists.filter(pickList => pickList.id === id)[0];
        if (!toShow) return;

        const missingItemParts: DisplayMissingPart[] = toShow.missingParts.map(id => {
            const part: Part = parts.filter(p => p.id === id)[0];
            return {
                name: part.name,
                quantityOnHand: part.quantityOnHand,
            }
        });
        setMissingParts(missingItemParts);
        setShowMissingParts(true);
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
                        const textColor = pickList.pickListStatus === PickListStatus.INSUFFICIENT_PARTS ? 'text-red-500' : '';
                        return <TableRow key={pickList.id} className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${textColor}`}>
                            <TableCell>{pickList.name}</TableCell>
                            <TableCell>{pickList.quantity}</TableCell>
                            <TableCell className={`${ pickList.pickListStatus === PickListStatus.INSUFFICIENT_PARTS ? 'cursor-pointer' : ''}`}
                                onClick={() => {
                                    if (pickList.pickListStatus === PickListStatus.INSUFFICIENT_PARTS) {
                                        handleShowMissingParts(pickList.id || 0);
                                    }
                                }}
                            >
                                {pickList.pickListStatus}
                            </TableCell>
                            <ActionsTableCell
                                handleDelete={handleDelete}
                                canEdit={pickList.pickListStatus !== PickListStatus.PICKED}
                                handleEdit={props.handleEdit}
                                id={pickList.id}
                                displayName={`${pickList.quantity} ${pickList.name}${pickList.quantity === 1 ? '' : 's'}`}
                                handleAlt={handlePickListPullResponse}
                                canHandleAlt={pickList.pickListStatus === PickListStatus.DRAFT}
                                handleAltMessage={'Pull parts from inventory'}
                                altTitle={'Are you sure you want to pull parts for:'}
                            />
                        </TableRow>
                    })}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell colSpan={7} ></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {
                showMissingParts && <MissingPartsModal missingParts={missingParts} showDialog={showMissingParts} handleClose={() => setShowMissingParts(false)} />
            }
        </div>
    )
}