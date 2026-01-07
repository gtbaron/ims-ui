import React from "react";
import {Item} from "@/components/items/Item";
import {Table, TableBody, TableCell, TableRow} from "flowbite-react";
import {formatPercent, usdFormatter} from "@/utils/FormatUtils";
import {useItemFinancials} from "@/store/hooks/useItemFinancials";

type ItemFinancialsProps = {
    item: Item;
    costOfParts: number;
    handleSuggestedListPriceChanged: (askPrice: number) => void;
};

export const ItemFinancials: React.FC<ItemFinancialsProps> = (props: ItemFinancialsProps) => {
    const financials = useItemFinancials(
        {
            item: props.item,
            costOfParts: props.costOfParts,
        },
        props.handleSuggestedListPriceChanged
    );

    return (
        <div className='w-full flex flex-col flex-1 m-2 bg-gray-800 rounded-xl space-y-6 p-6'>
            <div className="text-white text-left mb-3">
                <h2>Financial Data</h2>
            </div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Material Cost:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-red-600'}>{usdFormatter.format(financials.costOfParts)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableBody>
                    <TableRow className={'mb-3'}>
                        <TableCell className={'text-right p-2 w-3/5'}>Suggested List Price:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-yellow-400'}>{usdFormatter.format(financials.suggestedListPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Discount:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-yellow-400'}>{financials.discount}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Discount Amount:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-yellow-400'}>{usdFormatter.format(financials.discountAmount)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Ask Price:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-green-400'}>{usdFormatter.format(financials.askPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Margin:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-green-400'}>{financials.costOfParts ? formatPercent(financials.marginPercent / 100) : '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={'text-right p-2 w-3/5'}>Profit:</TableCell>
                        <TableCell className={'p-2 w-3/5 text-green-400'}>{financials.costOfParts ? usdFormatter.format(financials.profitDollars) : '-'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}