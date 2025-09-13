import React, {useEffect, useState} from "react";
import {Dropdown, DropdownItem, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {Item} from "@/components/items/Item";
import {Part} from "@/components/parts/Part";
import {callGetParts} from "@/services/PartsService";

type ItemPartsListProps = {
    item: Item;
    itemPartsList: Part[];
}

export const ItemPartsList: React.FC<ItemPartsListProps> = (props: ItemPartsListProps) => {
    const [masterPartsList, setMasterPartsList] = useState<Part[]>([]);
    const [partId, setPartId] = useState<number | undefined>(undefined);

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

    const {item, itemPartsList} = props;

    return (
        <div className={'bg-gray-800 rounded-xl space-y-6 text-left p-6 m-2 w-full'}>
            {
                itemPartsList && <div className={'text-white text-left mb-2'}>
                    <h2>Parts List</h2>
                </div>
            }
            {
                itemPartsList && <div className={'overflow-x-auto'}>
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
                            {/*{itemPartsList.map((part) => (*/}
                            {/*    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" >*/}
                            {/*        <TableCell>{part.name}</TableCell>*/}
                            {/*        <CurrencyTableCell value={part.bulkPrice / part.bulkQuantity}/>*/}
                            {/*        <TableCell>{item.itemCategory}</TableCell>*/}
                            {/*        <TableCell>{item.itemStatus}</TableCell>*/}
                            {/*        <ActionsTableCell*/}
                            {/*            handleDelete={handleDelete}*/}
                            {/*            handleEdit={props.handleEdit}*/}
                            {/*            id={item.id}*/}
                            {/*            displayName={item.name}*/}
                            {/*        />*/}
                            {/*    </TableRow>*/}
                            {/*))}*/}
                            <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                                <TableCell colSpan={5} ></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            }

            <div className={'text-white text-left mb-2 flex flex-row justify-between'}>
                <div>
                    <div className={'mb-1 block'}>
                        <span>Part</span>
                    </div>
                    <Dropdown
                        id={'partsList'}
                        size={'sm'}
                        label={partId === 0 ? 'Select part' : masterPartsList.find(part => part.id === partId)?.name || 'Select part'}
                    >
                        <div className={'max-h-60 overflow-y-auto'}>
                            {masterPartsList.map((part) => (
                                <DropdownItem key={part.id} onClick={() => setPartId(part.id)} >{part.name}</DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
                </div>
                {/*<div>*/}
                {/*    <div className={'mb-1 block'}>*/}
                {/*        <span>Status</span>*/}
                {/*    </div>*/}
                {/*    <Dropdown id={'itemStatus'} label={item.itemStatus} size={'sm'}>*/}
                {/*        {Object.values(ItemStatus).map((status) => (*/}
                {/*            <DropdownItem value={item.itemCategory} key={status} onClick={() => handleItemValueChanged(status, 'itemStatus')} >{status}</DropdownItem>*/}
                {/*        ))}*/}
                {/*    </Dropdown>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}