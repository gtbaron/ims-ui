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
import {callGetItemParts} from "@/services/ItemsService";
import {ItemPart} from "@/components/items/ItemPart";
import {CurrencyTableCell} from "@/components/wrappers/CurrencyTableCell";
import {usdFormatter} from "@/utils/FormatUtils";

type ItemPartsListProps = {
    item: Item;
    handleItemPartsCostChanged: (costOfParts: number) => void;
    handleItemPartAdded: (itemPart: ItemPart) => void;
}

export const ItemPartsList: React.FC<ItemPartsListProps> = (props: ItemPartsListProps) => {
    const [masterPartsList, setMasterPartsList] = useState<Part[]>([]);
    const [itemPartsList, setItemPartsList] = useState<ItemPart[]>([])
    const [partId, setPartId] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data: Part[] = await callGetParts();
                setMasterPartsList(data);
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchParts();
    }, [setMasterPartsList]);

    useEffect(() => {
        const fetchItemParts = async (item: Item) => {
            if (!item || !item.id) return;
            try {
                const data: ItemPart[] = await callGetItemParts(item.id);
                setItemPartsList(data);
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchItemParts(props.item);
    }, [props.item, setItemPartsList]);

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

        props.handleItemPartAdded(toAdd);
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

    const getNameFor = (partId: number | undefined): string => {
        if (!partId) return '';
        const part = masterPartsList.find(part => part.id === partId);
        return part ? part.name : '';
    }

    const getUnitCostFor = (partId: number | undefined): number => {
        if (!partId) return 0;
        const part = masterPartsList.find(part => part.id === partId);
        return part ? part.bulkPrice / part.bulkQuantity : 0;
    }

    return (
        <div className={'bg-gray-800 rounded-xl space-y-6 text-left p-6 m-2 w-full'}>
            {
                (itemPartsList && itemPartsList.length > 0) && <>
                    <div className={'text-white text-left mb-2'}>
                        <h2>Parts List</h2>
                    </div>
                    <div className={'overflow-x-auto border border-gray-700 rounded-xl'}>
                        <Table striped>
                            <TableHead>
                                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableHeadCell>Part</TableHeadCell>
                                    <TableHeadCell>Unit Cost</TableHeadCell>
                                    <TableHeadCell>Quantity</TableHeadCell>
                                    <TableHeadCell>Product Cost</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y">
                                {itemPartsList.map((itemPart) => (
                                    <TableRow key={`${itemPart.partId}_${itemPart.quantity}`} className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                                        <TableCell>{getNameFor(itemPart.partId)}</TableCell>
                                        <CurrencyTableCell value={getUnitCostFor(itemPart.partId)}/>
                                        <TableCell>{itemPart.quantity}</TableCell>
                                        <TableCell>{usdFormatter.format(itemPart.quantity * getUnitCostFor(itemPart.partId))}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                                    <TableCell colSpan={5} ></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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
        </div>
    )
}