import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {useAppSelector} from "@/store/hooks";
import {ItemListing} from "@/components/listings/ItemListing";
import {calculateItemFinancials} from "@/utils/FinancialCalculations";
import {formatPercent, usdFormatter} from "@/utils/FormatUtils";

export type ListingsListProps = {
    handleRowClick: (itemId: number) => void;
}

export const ListingsList: React.FC<ListingsListProps> = (props: ListingsListProps) => {
    const listings: ItemListing[] = useAppSelector((state) => state.listings.list);
    const discount = useAppSelector((state) => state.shop.discount);

    return (
        <div className={'max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Ask Price</TableHeadCell>
                        <TableHeadCell>Margin</TableHeadCell>
                        <TableHeadCell>Profit</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {listings.map((listing) => {
                        const financials = calculateItemFinancials({
                            costOfParts: listing.costOfParts,
                            discount: discount,
                            listPrice: listing.listPrice,
                            overrideSuggestedListPrice: listing.overrideSuggestedListPrice,
                        });

                        return (
                            <TableRow
                                key={listing.itemId}
                                className={'bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-gray-700'}
                                onClick={() => props.handleRowClick(listing.itemId)}
                            >
                                <TableCell>{listing.name}</TableCell>
                                <TableCell>{usdFormatter.format(financials.askPrice)}</TableCell>
                                <TableCell>
                                    {listing.costOfParts > 0
                                        ? formatPercent(financials.marginPercent / 100)
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    {listing.costOfParts > 0
                                        ? usdFormatter.format(financials.profitDollars)
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
