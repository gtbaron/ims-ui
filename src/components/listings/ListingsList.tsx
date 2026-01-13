import React, {useMemo} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "flowbite-react";
import {useAppSelector} from "@/store/hooks";
import {ItemListing} from "@/components/listings/ItemListing";
import {calculateItemFinancials} from "@/utils/FinancialCalculations";
import {formatPercent, usdFormatter} from "@/utils/FormatUtils";
import {SortableTableHeadCell} from "@/components/wrappers/SortableTableHeadCell";
import {useSortableTable} from "@/hooks/useSortableTable";

interface DisplayListing extends ItemListing {
    askPrice: number;
    marginPercent: number;
    profitDollars: number;
}

export type ListingsListProps = {
    handleRowClick: (itemId: number) => void;
}

export const ListingsList: React.FC<ListingsListProps> = (props: ListingsListProps) => {
    const listings: ItemListing[] = useAppSelector((state) => state.listings.list);
    const discount = useAppSelector((state) => state.shop.discount);

    const displayListings: DisplayListing[] = useMemo(() =>
        listings.map(listing => {
            const financials = calculateItemFinancials({
                costOfParts: listing.costOfParts,
                discount: discount,
                listPrice: listing.listPrice,
                overrideSuggestedListPrice: listing.overrideSuggestedListPrice,
            });
            return {
                ...listing,
                askPrice: financials.askPrice,
                marginPercent: financials.marginPercent,
                profitDollars: financials.profitDollars,
            };
        }),
        [listings, discount]
    );

    const { sortedData, sortConfig, handleSort } = useSortableTable(displayListings, 'name');

    return (
        <div className={'max-h-screen overflow-y-auto rounded-md'}>
            <Table striped>
                <TableHead className={'sticky top-0 bg-gray-800 z-10'}>
                    <TableRow className={'bg-white dark:border-gray-700 dark:bg-gray-800'}>
                        <SortableTableHeadCell columnKey="name" sortConfig={sortConfig} onSort={handleSort}>
                            Name
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="askPrice" sortConfig={sortConfig} onSort={handleSort}>
                            Ask Price
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="marginPercent" sortConfig={sortConfig} onSort={handleSort}>
                            Margin
                        </SortableTableHeadCell>
                        <SortableTableHeadCell columnKey="profitDollars" sortConfig={sortConfig} onSort={handleSort}>
                            Profit
                        </SortableTableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                    {sortedData.map((listing) => {
                        const textColor = listing.costOfParts > 0 && listing.marginPercent < 130
                            ? (listing.marginPercent < 120 ? 'text-red-500' : 'text-yellow-400')
                            : '';

                        return (
                            <TableRow
                                key={listing.itemId}
                                className={`bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-gray-700 ${textColor}`}
                                onClick={() => props.handleRowClick(listing.itemId)}
                            >
                                <TableCell>{listing.name}</TableCell>
                                <TableCell>{usdFormatter.format(listing.askPrice)}</TableCell>
                                <TableCell>
                                    {listing.costOfParts > 0
                                        ? formatPercent(listing.marginPercent / 100)
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    {listing.costOfParts > 0
                                        ? usdFormatter.format(listing.profitDollars)
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
