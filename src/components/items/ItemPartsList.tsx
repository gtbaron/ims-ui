import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput
} from "flowbite-react";
import {Item} from "@/components/items/Item";
import {ItemPart} from "@/components/items/ItemPart";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {usdFormatter} from "@/utils/FormatUtils";
import {useAppSelector} from "@/store/hooks";
import {ActionsTableCell} from "@/components/wrappers/ActionsTableCell";
import {EditItemPartModal} from "@/components/modals/EditItemPartModal";
import {callHaveSufficientParts} from "@/services/ItemsService";
import {HiCheckCircle, HiXCircle, HiPlus, HiX} from "react-icons/hi";

type ItemPartsListProps = {
    item: Item;
    itemPartsList: ItemPart[];
    handleItemPartsCostChanged: (costOfParts: number) => void;
    handleAddUpdateItemPart: (itemPart: ItemPart) => void;
    handleItemPartDeleted: (itemPartId: number, altId?:number) => void;
}

interface DisplayItemPart extends ItemPart {
    name: string,
}

type MultiAddRow = {
    id: string;
    partId: number | undefined;
    quantity: number;
    error?: string;
    searchTerm?: string;
}

export const ItemPartsList: React.FC<ItemPartsListProps> = (props: ItemPartsListProps) => {
    const masterPartsList = useAppSelector((state) => state.parts.list);

    const [itemPartsList, setItemPartsList] = useState<DisplayItemPart[]>([]);
    const [multiAddRows, setMultiAddRows] = useState<MultiAddRow[]>([
        { id: crypto.randomUUID(), partId: undefined, quantity: 0 }
    ]);
    const [itemPartEditName, setItemPartEditName] = useState<string>('');
    const [itemPart, setItemPart] = useState<ItemPart | undefined>(undefined);
    const [showEditItemPartModal, setShowEditItemPartModal] = useState<boolean>(false);
    const [canBuild, setCanBuild] = useState<boolean>(false);

    useEffect(() => {
        const displayItemPartsList = props.itemPartsList.map((itemPart: ItemPart) => {
            const part = masterPartsList.find(part => part.id === itemPart.partId);
            return {
                ...itemPart,
                name: part ? part.name : ''
            }
        });
        setItemPartsList(displayItemPartsList.sort((a, b) => a.name.localeCompare(b.name)));
    }, [props.itemPartsList, masterPartsList]);

    useEffect(() => {
        const fetchCanBuild = async (item: Item) => {
            if (!item || !item.id) return;
            try {
                const data: boolean = await callHaveSufficientParts(item.id);
                setCanBuild(data);
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchCanBuild(props.item);
    }, [props.item]);

    const handleAddRow = useCallback(() => {
        setMultiAddRows(prev => [
            ...prev,
            { id: crypto.randomUUID(), partId: undefined, quantity: 0 }
        ]);
    }, []);

    const handleRemoveRow = useCallback((rowId: string) => {
        setMultiAddRows(prev => {
            if (prev.length === 1) return prev;
            return prev.filter(row => row.id !== rowId);
        });
    }, []);

    const handleRowPartChange = useCallback((rowId: string, newPartId: number) => {
        setMultiAddRows(prev => prev.map(row =>
            row.id === rowId ? { ...row, partId: newPartId, error: undefined, searchTerm: '' } : row
        ));
    }, []);

    const handleRowQuantityChange = useCallback((rowId: string, newQuantity: number) => {
        setMultiAddRows(prev => prev.map(row =>
            row.id === rowId ? { ...row, quantity: newQuantity, error: undefined } : row
        ));
    }, []);

    const handleRowSearchChange = useCallback((rowId: string, searchTerm: string) => {
        setMultiAddRows(prev => prev.map(row =>
            row.id === rowId ? { ...row, searchTerm } : row
        ));
    }, []);

    const validateRows = (): boolean => {
        let isValid = true;
        const updatedRows = multiAddRows.map(row => {
            if (!row.partId) {
                isValid = false;
                return { ...row, error: 'Please select a part' };
            }
            if (!row.quantity || row.quantity <= 0) {
                isValid = false;
                return { ...row, error: 'Quantity must be greater than 0' };
            }
            return { ...row, error: undefined };
        });

        setMultiAddRows(updatedRows);
        return isValid;
    };

    const mergeRowsByPart = (rows: MultiAddRow[]): ItemPart[] => {
        const partQuantityMap = new Map<number, number>();

        rows.forEach(row => {
            if (row.partId && row.quantity > 0) {
                const existing = partQuantityMap.get(row.partId) || 0;
                partQuantityMap.set(row.partId, existing + row.quantity);
            }
        });

        return Array.from(partQuantityMap.entries()).map(([partId, quantity]) => ({
            itemId: props.item.id as number,
            partId,
            quantity
        }));
    };

    const handleAddAllParts = () => {
        if (!validateRows()) return;

        const validRows = multiAddRows.filter(
            row => row.partId && row.quantity > 0
        );

        if (validRows.length === 0) return;

        const mergedParts = mergeRowsByPart(validRows);

        mergedParts.forEach(newPart => {
            const existingNewPart = props.itemPartsList.find(
                ip => !ip.id && ip.partId === newPart.partId
            );

            if (existingNewPart) {
                props.handleAddUpdateItemPart({
                    ...existingNewPart,
                    quantity: existingNewPart.quantity + newPart.quantity
                });
            } else {
                props.handleAddUpdateItemPart(newPart);
            }
        });

        setMultiAddRows([
            { id: crypto.randomUUID(), partId: undefined, quantity: 0 }
        ]);
    };

    const updateCostOfParts = useCallback((partListToCompute: ItemPart[]) => {
        const costOfParts = partListToCompute.reduce(
            (total, itemPart) => {
                const part = masterPartsList.find(part => part.id === itemPart.partId);
                if (part) {
                    return total + (part.bulkPrice / part.bulkQuantity) * itemPart.quantity;
                }
                return total;
            },
            0
        )
        props.handleItemPartsCostChanged(costOfParts);
    }, [masterPartsList, props.handleItemPartsCostChanged]);

    useEffect(() => {
        updateCostOfParts(itemPartsList);
    }, [itemPartsList, updateCostOfParts]);

    const getNameFor = useCallback((itemPartId: number | undefined): string => {
        if (!itemPartId) return '';
        const namedItemPart = masterPartsList.find(ip => ip.id === itemPartId);
        return namedItemPart ? namedItemPart.name : '';
    }, [masterPartsList]);

    const getUnitCostFor = useCallback((partId: number | undefined): number => {
        if (!partId) return 0;
        const part = masterPartsList.find(part => part.id === partId);
        return part ? part.bulkPrice / part.bulkQuantity : 0;
    }, [masterPartsList]);

    const handleShowEditItemPartModal = (itemPartIdToEdit: number | undefined, partId?: number) => {
        const editItemPart = itemPartIdToEdit
            ? itemPartsList.find(ip => ip.id === itemPartIdToEdit)
            : itemPartsList.find(ip => ip.partId === partId);

        if (!editItemPart) return;

        setItemPartEditName(getNameFor(editItemPart.partId));
        setItemPart(editItemPart);
        setShowEditItemPartModal(true)
    }

    const handleItemPartDeleted = (itemPartIdToDelete: number, altId?: number) => {
        if (itemPartIdToDelete === 0) {
            const updatedItemPartsList = itemPartsList.filter(ip => ip.partId !== altId);
            setItemPartsList(updatedItemPartsList);
            updateCostOfParts(updatedItemPartsList);
        }
        props.handleItemPartDeleted(itemPartIdToDelete, altId);
    }

    const handleEditItemPartResponse = (response: boolean, updatedItemPart: ItemPart) => {
        setShowEditItemPartModal(false);
        if (!response) return;

        setItemPartEditName('');
        setItemPart(undefined);
        props.handleAddUpdateItemPart(updatedItemPart);
    }

    const haveEnoughParts = useCallback((partId: number, quantity: number) => {
        const part = masterPartsList.find(part => part.id === partId);
        return part && part.quantityOnHand >= quantity;
    }, [masterPartsList]);

    return (
        <div className={'bg-gray-800 rounded-xl space-y-6 text-left p-6 m-2 w-full'}>
            {
                (itemPartsList && itemPartsList.length > 0) && <>
                    <div className={'text-white m-2 flex flex-row items-start'}>
                        <h2>Parts List</h2>
                        { canBuild && <HiCheckCircle className={'text-green-400 text-2xl ml-2'} /> }
                        { !canBuild && <HiXCircle className={'text-red-500 text-2xl ml-2'} /> }
                    </div>
                    <div className={'max-h-60 overflow-y-auto rounded-md'}>
                        <div className={'border border-gray-700 rounded-xl'}>
                            <Table striped>
                                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableHeadCell>Part</TableHeadCell>
                                        <TableHeadCell>Unit Cost</TableHeadCell>
                                        <TableHeadCell>Quantity</TableHeadCell>
                                        <TableHeadCell>Product Cost</TableHeadCell>
                                        <TableHeadCell>Actions</TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y">
                                    {itemPartsList.map((itemPart) => {
                                        const textColor = haveEnoughParts(itemPart.partId, itemPart.quantity) ? '' : 'text-red-500';
                                        return <TableRow key={`${itemPart.partId}_${itemPart.quantity}`} className={`dark:border-gray-700 dark:bg-gray-800 ${textColor}`} >
                                            <TableCell>{getNameFor(itemPart.partId)}</TableCell>
                                            <CurrencyTableCell value={getUnitCostFor(itemPart.partId)}/>
                                            <TableCell>{itemPart.quantity}</TableCell>
                                            <TableCell>{usdFormatter.format(itemPart.quantity * getUnitCostFor(itemPart.partId))}</TableCell>
                                            <ActionsTableCell
                                                displayName={itemPart.name}
                                                actions={[
                                                    { type: 'edit', onEdit: () => handleShowEditItemPartModal(itemPart.id, itemPart.partId) },
                                                    { type: 'delete', onDelete: () => handleItemPartDeleted(itemPart.id || 0, itemPart.partId) }
                                                ]}
                                            />
                                        </TableRow>
                                    })}
                                    <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                                        <TableCell colSpan={5} ></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </>
            }

            <div className={'text-gray-400 text-left mb-2'}>
                <div className={'mb-3'}>
                    <h3 className={'text-white mb-2'}>Add Parts</h3>
                </div>

                <div className={'border border-gray-700 rounded-lg mb-3'}>
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gray-700">
                                <TableHeadCell>Part</TableHeadCell>
                                <TableHeadCell className={'w-32'}>Quantity</TableHeadCell>
                                <TableHeadCell className={'w-24'}>Actions</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {multiAddRows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className={`dark:border-gray-700 dark:bg-gray-800 ${row.error ? 'bg-red-900 bg-opacity-20' : ''}`}
                                >
                                    <TableCell>
                                        <div className="part-dropdown">
                                            <Dropdown
                                                id={`part-${row.id}`}
                                                size={'sm'}
                                                label={
                                                    row.partId
                                                        ? masterPartsList.find(p => p.id === row.partId)?.name || 'Select part...'
                                                        : 'Select part...'
                                                }
                                            >
                                            <div
                                                className={'p-2 border-b border-gray-600 w-64'}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <TextInput
                                                    id={`search-${row.id}`}
                                                    type="text"
                                                    placeholder="Search parts..."
                                                    value={row.searchTerm || ''}
                                                    onChange={(e) => handleRowSearchChange(row.id, e.target.value)}
                                                    sizing={'sm'}
                                                    autoComplete="off"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className={'max-h-96 overflow-y-auto w-64'}>
                                                {(() => {
                                                    const filteredParts = masterPartsList.filter(part =>
                                                        !row.searchTerm ||
                                                        part.name.toLowerCase().includes(row.searchTerm.toLowerCase())
                                                    );
                                                    return filteredParts.length > 0 ? (
                                                        filteredParts.map((part) => (
                                                            <DropdownItem
                                                                key={part.id}
                                                                onClick={() => handleRowPartChange(row.id, part.id!)}
                                                            >
                                                                {part.name}
                                                            </DropdownItem>
                                                        ))
                                                    ) : (
                                                        <div className={'p-2 text-gray-400 text-center w-64'}>
                                                            No parts found
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </Dropdown>
                                        </div>
                                        {row.error && (
                                            <span className={'text-red-400 text-xs mt-1'}>{row.error}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <TextInput
                                            id={`quantity-${row.id}`}
                                            value={row.quantity || ''}
                                            onChange={(e) => handleRowQuantityChange(row.id, parseFloat(e.target.value) || 0)}
                                            sizing={'sm'}
                                            type='number'
                                            min={0}
                                            max={1000}
                                            step='any'
                                            color={row.error ? 'failure' : 'gray'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className={'flex flex-row gap-2'}>
                                            {index === multiAddRows.length - 1 && (
                                                <HiPlus
                                                    className={'text-green-400 hover:text-green-200 cursor-pointer text-xl'}
                                                    onClick={handleAddRow}
                                                    title="Add another row"
                                                />
                                            )}
                                            {multiAddRows.length > 1 && (
                                                <HiX
                                                    className={'text-red-400 hover:text-red-200 cursor-pointer text-xl'}
                                                    onClick={() => handleRemoveRow(row.id)}
                                                    title="Remove row"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className={'flex flex-row justify-end gap-2'}>
                    <Button
                        size={'sm'}
                        color={'green'}
                        onClick={handleAddAllParts}
                    >
                        Add to Parts List
                    </Button>
                </div>
            </div>

            {
                (showEditItemPartModal && itemPart) && <EditItemPartModal
                    itemPart={itemPart}
                    itemPartName={itemPartEditName}
                    showModal={showEditItemPartModal}
                    handleResponse={handleEditItemPartResponse}
                />
            }
        </div>
    )
}