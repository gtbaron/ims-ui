import React, {useEffect, useState} from "react";
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
import {Part} from "@/components/parts/Part";
import {callGetParts} from "@/services/PartsService";
import {ItemPart} from "@/components/items/ItemPart";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {usdFormatter} from "@/utils/FormatUtils";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setParts} from "@/store/slices/PartsSlice";
import {ActionsTableCell} from "@/components/wrappers/actionsTableCell/ActionsTableCell";
import {EditItemPartModal} from "@/components/modals/EditItemPartModal";

type ItemPartsListProps = {
    item: Item;
    itemPartsList: ItemPart[];
    handleItemPartsCostChanged: (costOfParts: number) => void;
    handleAddUpdateItemPart: (itemPart: ItemPart) => void;
}

export const ItemPartsList: React.FC<ItemPartsListProps> = (props: ItemPartsListProps) => {
    const dispatch = useAppDispatch();
    const masterPartsList = useAppSelector((state) => state.parts.list);

    const [itemPartsList, setItemPartsList] = useState<ItemPart[]>([]);
    const [partId, setPartId] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(0);
    const [itemPartEditName, setItemPartEditName] = useState<string>('');
    const [itemPart, setItemPart] = useState<ItemPart | undefined>(undefined);
    const [showEditItemPartModal, setShowEditItemPartModal] = useState<boolean>(false);

    useEffect(() => {
        setItemPartsList(props.itemPartsList);
    }, [props.itemPartsList]);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data: Part[] = await callGetParts();
                dispatch(setParts(data));
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        if (masterPartsList.length === 0) {
            fetchParts();
        }
    }, [dispatch, masterPartsList]);

    const handleAddItemPart = () => {
        if (!itemPartsList || !partId || quantity === 0) return;

        const toAdd: ItemPart = {
            itemId: props.item.id as number,
            partId: partId,
            quantity: quantity
        };

        const updatedItemPartsList = [...itemPartsList, toAdd];
        setItemPartsList(updatedItemPartsList);
        setPartId(undefined);
        setQuantity(0);

        props.handleAddUpdateItemPart(toAdd);
    }

    useEffect(() => {
        const costOfParts = itemPartsList.reduce(
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
    }, [itemPartsList, props, masterPartsList]);

    const getNameFor = (itemPartId: number | undefined): string => {
        if (!itemPartId) return '';
        const namedItemPart = masterPartsList.find(ip => ip.id === itemPartId);
        return namedItemPart ? namedItemPart.name : '';
    }

    const getUnitCostFor = (partId: number | undefined): number => {
        if (!partId) return 0;
        const part = masterPartsList.find(part => part.id === partId);
        return part ? part.bulkPrice / part.bulkQuantity : 0;
    }

    const handleShowEditItemPartModal = (itemPartIdToEdit: number | undefined) => {
        if (!itemPartIdToEdit) return;
        const editItemPart = itemPartsList.find(itemPart => itemPart.id === itemPartIdToEdit);
        if (!editItemPart) return;

        setItemPartEditName(getNameFor(editItemPart.partId));
        setItemPart(editItemPart);
        setShowEditItemPartModal(true)
    }

    const handleEditItemPartResponse = (response: boolean, updatedItemPart: ItemPart) => {
        setShowEditItemPartModal(false);
        if (!response) return;

        setItemPartEditName('');
        setItemPart(undefined);
        props.handleAddUpdateItemPart(updatedItemPart);
    }

    return (
        <div className={'bg-gray-800 rounded-xl space-y-6 text-left p-6 m-2 w-full'}>
            {
                (itemPartsList && itemPartsList.length > 0) && <>
                    <div className={'text-white text-left mb-2'}>
                        <h2>Parts List</h2>
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
                                    {itemPartsList.map((itemPart) => (
                                        <TableRow key={`${itemPart.partId}_${itemPart.quantity}`} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                                            <TableCell>{getNameFor(itemPart.partId)}</TableCell>
                                            <CurrencyTableCell value={getUnitCostFor(itemPart.partId)}/>
                                            <TableCell>{itemPart.quantity}</TableCell>
                                            <TableCell>{usdFormatter.format(itemPart.quantity * getUnitCostFor(itemPart.partId))}</TableCell>
                                            <ActionsTableCell
                                                id={itemPart.id}
                                                displayName={getNameFor(itemPart.id)}
                                                handleEdit={handleShowEditItemPartModal}
                                            />
                                        </TableRow>
                                    ))}
                                    <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                                        <TableCell colSpan={5} ></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </>
            }

            <div className={'text-gray-400 text-left mb-2 flex flex-row justify-between'}>
                <div className={'w-3/5'}>
                    <div className={'mb-1 block'}>
                        <span>Part</span>
                    </div>
                    <Dropdown
                        id={'partsList'}
                        size={'sm'}
                        label={partId === 0 ? 'Select part...' : masterPartsList.find(part => part.id === partId)?.name || 'Select part...'}
                    >
                        <div className={'max-h-60 overflow-y-auto'}>
                            {masterPartsList.map((part) => (
                                <DropdownItem key={part.id} onClick={() => setPartId(part.id)} >{part.name}</DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
                </div>
                <div>
                    <div className={'mb-1 block'}>
                        <span>Quantity</span>
                    </div>
                    <TextInput
                        id='quantity'
                        value={quantity}
                        onChange={(event) => setQuantity(parseFloat(event.target.value))}
                        required
                        sizing={'sm'}
                        type='number'
                        min={0}
                        max={1000}
                        step='any'
                    />
                </div>
                <div className={'flex flex-col justify-end'}>
                    <div className={'mb-1 block float-right vertical-align-middle '}>
                        <Button size={'sm'} className="btn btn-primary" onClick={() => handleAddItemPart()} >Add</Button>
                    </div>
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