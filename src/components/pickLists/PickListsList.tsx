import React, {useEffect, useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell";
import {SortableTableHeadCell} from "@/components/wrappers/SortableTableHeadCell";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {PickList, PickListStatus} from "@/components/pickLists/PickList";
import {Item} from "@/components/items/Item";
import {callDeletePickList, callPullPickList, callReturnPickList} from "@/services/PickListService";
import {removePickList, updatePickList} from "@/store/slices/PickListSlice";
import {Part} from "@/components/parts/Part";
import {MissingPartsModal} from "@/components/modals/MissingPartsModal";
import {useSortableTable} from "@/hooks/useSortableTable";

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
    const [missingParts, setMissingParts] = useState<DisplayMissingPart[]>([])
    const [showMissingParts, setShowMissingParts] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const displayPickList: DisplayPickList[] = useMemo(() =>
        pickLists.map(pickList => {
            const item = items.find(item => item.id === pickList.itemId);
            return {
                ...pickList,
                name: item ? item.name : ''
            }
        }),
        [items, pickLists]
    );

    const { sortedData, sortConfig, handleSort } = useSortableTable(displayPickList, 'name');

    const handleDelete = async (id: number, response: boolean) => {
        if (response) {
            const success = await callDeletePickList(id);
            if (success) {
                dispatch(removePickList(id))
            }
        }
    }

    const handlePullPickListResponse = async (id: number | undefined, response: boolean) => {
        if (!response || !id) return;
        const existing = await callPullPickList(id);
        dispatch(updatePickList(existing));
    }

    const handleReturnPickListResponse = async (id: number | undefined, response: boolean) => {
        if (!response || !id) return;
        const existing = await callReturnPickList(id);
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
                        <SortableTableHeadCell columnKey="name" sortConfig={sortConfig} onSort={handleSort}>
                            Item
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="quantity" sortConfig={sortConfig} onSort={handleSort}>
                            Quantity
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="pickListStatus" sortConfig={sortConfig} onSort={handleSort}>
                            Status
                        </SortableTableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {sortedData.map((pickList) => {
                        const textColor = pickList.pickListStatus === PickListStatus.INSUFFICIENT_PARTS ? 'text-red-500' : '';
                        const pickListAction = {
                            canHandleAlt: pickList.pickListStatus === PickListStatus.DRAFT || pickList.pickListStatus === PickListStatus.PICKED,
                            handleAlt: pickList.pickListStatus === PickListStatus.DRAFT ? handlePullPickListResponse : handleReturnPickListResponse,
                            altTitle: `Are you sure you want to ${pickList.pickListStatus === PickListStatus.DRAFT ? 'pull' : 'return'} parts for:`,
                            altToolTip: pickList.pickListStatus === PickListStatus.DRAFT ? 'Pull parts from inventory.' : 'Return parts to inventory.',
                        };
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
                                canHandleAlt={pickListAction.canHandleAlt}
                                handleAlt={pickListAction.handleAlt}
                                altTitle={pickListAction.altTitle}
                                altToolTip={pickListAction.altToolTip}
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