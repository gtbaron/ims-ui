import React, {useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Tooltip} from "flowbite-react";
import {IoClipboardOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoArchiveOutline, IoArrowUndoOutline} from "react-icons/io5";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell";
import {SortableTableHeadCell} from "@/components/wrappers/SortableTableHeadCell";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {PickList, PickListStatus} from "@/components/pickLists/PickList";
import {Item} from "@/components/items/Item";
import {callDeletePickList, callPullPickList, callReturnPickList, callCompletePickList, callCancelPickList, callArchivePickList} from "@/services/PickListService";
import {callGetItemParts} from "@/services/ItemsService";
import {removePickList, updatePickList} from "@/store/slices/PickListSlice";
import {Part} from "@/components/parts/Part";
import {MissingPartsModal} from "@/components/modals/MissingPartsModal";
import {useSortableTable} from "@/hooks/useSortableTable";

type DisplayPickList = PickList & {
    name: string,
}

export type DisplayMissingPart = {
    name: string,
    quantityRequired: number,
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

    const handleDelete = async (id: number) => {
        const success = await callDeletePickList(id);
        if (success) {
            dispatch(removePickList(id))
        }
    }

    const handlePullPickList = async (id: number) => {
        const existing = await callPullPickList(id);
        dispatch(updatePickList(existing));
    }

    const handleReturnPickList = async (id: number) => {
        const existing = await callReturnPickList(id);
        dispatch(updatePickList(existing));
    }

    const handleCompletePickList = async (id: number) => {
        const existing = await callCompletePickList(id);
        dispatch(updatePickList(existing));
    }

    const handleCancelPickList = async (id: number) => {
        const existing = await callCancelPickList(id);
        dispatch(updatePickList(existing));
    }

    const handleArchivePickList = async (id: number) => {
        const existing = await callArchivePickList(id);
        dispatch(removePickList(id));
    }

    const handleShowMissingParts = async (id: number) => {
        const toShow: PickList = pickLists.filter(pickList => pickList.id === id)[0];
        if (!toShow || !toShow.itemId) return;

        const itemParts = await callGetItemParts(toShow.itemId);

        const missingItemParts: DisplayMissingPart[] = toShow.missingParts
            .map(partId => {
                const part = parts.find(p => p.id === partId);
                const itemPart = itemParts.find(ip => ip.partId === partId);
                return part && itemPart ? { part, itemPart } : undefined;
            })
            .filter((data): data is { part: Part; itemPart: { quantity: number } } => data !== undefined)
            .map(({ part, itemPart }) => ({
                name: part.name,
                quantityRequired: itemPart.quantity * toShow.quantity,
                quantityOnHand: part.quantityOnHand,
            }));
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
                        <TableHeadCell className="text-center">Actions</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {sortedData.map((pickList) => {
                        const status = pickList.pickListStatus;
                        const displayName = `${pickList.quantity} ${pickList.name}${pickList.quantity === 1 ? '' : 's'}`;

                        // Status flags
                        const isReadyToPick = status === PickListStatus.READY_TO_PICK;
                        const isInBuild = status === PickListStatus.IN_BUILD;
                        const isCompleted = status === PickListStatus.COMPLETED;
                        const isCancelled = status === PickListStatus.CANCELLED;
                        const isArchived = status === PickListStatus.ARCHIVED;
                        const isInsufficientParts = status === PickListStatus.INSUFFICIENT_PARTS;
                        const isDraft = status === PickListStatus.DRAFT;

                        // Action availability
                        const canPull = isReadyToPick;
                        const canReturn = isInBuild;
                        const canComplete = isInBuild;
                        const canCancel = isDraft || isInsufficientParts || isReadyToPick || isInBuild;
                        const canArchive = isCompleted || isCancelled;
                        const canEdit = isDraft || isInsufficientParts || isReadyToPick;
                        const canDelete = isDraft || isInsufficientParts || isReadyToPick;

                        // Status color styling
                        const getStatusColor = () => {
                            if (isInsufficientParts) return 'text-red-500';
                            if (isReadyToPick) return 'text-green-500';
                            if (isInBuild) return 'text-blue-500';
                            if (isCompleted) return 'text-gray-400';
                            if (isCancelled) return 'text-gray-400 line-through';
                            if (isArchived) return 'text-gray-500';
                            return '';
                        };

                        return <TableRow key={pickList.id} className={`bg-white dark:border-gray-700 dark:bg-gray-800`}>
                            <TableCell>{pickList.name}</TableCell>
                            <TableCell>{pickList.quantity}</TableCell>
                            <TableCell className={`${getStatusColor()} ${isInsufficientParts ? 'cursor-pointer' : ''}`}
                                onClick={() => {
                                    if (isInsufficientParts) {
                                        handleShowMissingParts(pickList.id || 0);
                                    }
                                }}
                            >
                                {isInsufficientParts ? (
                                    <Tooltip content="Click to see insufficient parts">
                                        <span>{pickList.pickListStatus}</span>
                                    </Tooltip>
                                ) : (
                                    pickList.pickListStatus
                                )}
                            </TableCell>
                            <ActionsTableCell
                                displayName={displayName}
                                actions={[
                                    {
                                        type: 'custom',
                                        icon: <IoClipboardOutline  />,
                                        disabled: !canPull,
                                        tooltip: 'Pull parts from inventory',
                                        onAction: () => {
                                            if (!pickList.id) return;
                                            handlePullPickList(pickList.id);
                                        },
                                        confirmTitle: 'Are you sure you want to pull parts for:'
                                    },
                                    {
                                        type: 'custom',
                                        icon: <IoArrowUndoOutline  />,
                                        disabled: !canReturn,
                                        tooltip: 'Return parts to inventory',
                                        onAction: () => {
                                            if (!pickList.id) return;
                                            handleReturnPickList(pickList.id);
                                        },
                                        confirmTitle: 'Are you sure you want to return parts for:'
                                    },
                                    {
                                        type: 'custom',
                                        icon: <IoCheckmarkCircleOutline  />,
                                        disabled: !canComplete,
                                        tooltip: 'Mark build as complete',
                                        onAction: () => {
                                            if (!pickList.id) return;
                                            handleCompletePickList(pickList.id);
                                        },
                                        confirmTitle: 'Are you sure you want to complete:'
                                    },
                                    {
                                        type: 'custom',
                                        icon: <IoCloseCircleOutline  />,
                                        disabled: !canCancel,
                                        tooltip: 'Cancel pick list',
                                        onAction: () => {
                                            if (!pickList.id) return;
                                            handleCancelPickList(pickList.id);
                                        },
                                        confirmTitle: 'Are you sure you want to cancel:'
                                    },
                                    {
                                        type: 'custom',
                                        icon: <IoArchiveOutline  />,
                                        disabled: !canArchive,
                                        tooltip: 'Archive pick list',
                                        onAction: () => {
                                            if (!pickList.id) return;
                                            handleArchivePickList(pickList.id);
                                        },
                                        confirmTitle: 'Are you sure you want to archive:'
                                    },
                                    {
                                        type: 'edit',
                                        disabled: !canEdit,
                                        tooltip: 'Edit pick list',
                                        onEdit: () => props.handleEdit(pickList.id)
                                    },
                                    {
                                        type: 'delete',
                                        disabled: !canDelete,
                                        onDelete: () => {
                                            if (!pickList.id) return;
                                            handleDelete(pickList.id);
                                        }
                                    }
                                ]}
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