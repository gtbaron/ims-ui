import React, {useEffect, useState} from "react";
import {Item} from "@/components/items/Item";
import {Table, TableBody, TableCell, TableRow} from "flowbite-react";
import {callGetCostOfParts} from "@/services/ItemsService";
import {formatPercent, usdFormatter} from "@/utils/FormatUtils";

type ItemFinancialsProps = {
    item: Item;
};

export const ItemFinancials: React.FC<ItemFinancialsProps> = (props: ItemFinancialsProps) => {

    const [costOfParts, setCostOfParts] = useState(0);
    const [suggestedListPrice, setSuggestedListPrice] = useState(0);
    const [discount] = useState(25);
    const [askPrice, setAskPrice] = useState(0);

    useEffect(() => {
        const fetchCostOfParts = async () => {
            if (!props.item.id) return;

            try {
                const costOfParts: number = await callGetCostOfParts(props.item.id);
                setCostOfParts(costOfParts);
                const price = props.item.listPrice === 0 ? costOfParts / .3 : props.item.listPrice;
                setSuggestedListPrice(price);
                setAskPrice(suggestedListPrice * (1 - (discount / 100)));
            } catch (err) {
                console.error('Error fetching cost of parts:', err);
            }
        };

        fetchCostOfParts();
    }, [props.item, setCostOfParts, suggestedListPrice, setSuggestedListPrice, setAskPrice, discount]);

    return (
        <div className='w-full flex flex-col flex-1 m-2 bg-gray-800 rounded-xl space-y-6 p-6'>
            <div className="text-white text-left mb-3">
                <h2>Financial Data</h2>
            </div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Material Cost:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-red-600'}>{usdFormatter.format(costOfParts)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableBody>
                    <TableRow className={'mb-3'}>
                        <TableCell className={'text-right p-2 w-3/5'}>Suggested List Price:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-yellow-400'}>{usdFormatter.format(suggestedListPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Discount:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-yellow-400'}>{discount}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Discount Amount:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-yellow-400'}>{usdFormatter.format(suggestedListPrice * (discount / 100))}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Ask Price:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-green-400'}>{usdFormatter.format(askPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Margin:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-green-400'}>{formatPercent(((askPrice - costOfParts) / costOfParts))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Profit:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-green-400'}>{usdFormatter.format(askPrice - costOfParts)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}