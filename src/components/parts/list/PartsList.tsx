import React from "react";
import {Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import { useAppSelector } from "@/store/hooks";
import { CurrencyTableCell } from "@/components/wrappers/CurrencyTableCell";
import {LinkTableCell} from "@/components/wrappers/LinkTableCell";

const PartsList: React.FC = () => {
    const parts = useAppSelector((state) => state.partsList.partsList);

    return parts.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table striped>
                        <TableHead>
                            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableHeadCell>Part</TableHeadCell>
                                <TableHeadCell>Provider</TableHeadCell>
                                <TableHeadCell>Bulk Price</TableHeadCell>
                                <TableHeadCell>Quantity</TableHeadCell>
                                <TableHeadCell>Unit Price</TableHeadCell>
                                <TableHeadCell>URL</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y">
                            {parts.map((part) => (
                                <TableRow key={part.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>{part.name}</TableCell>
                                    <TableCell>{part.provider}</TableCell>
                                    <CurrencyTableCell value={part.bulkPrice}/>
                                    <TableCell>{part.bulkQuantity}</TableCell>
                                    <CurrencyTableCell value={part.bulkPrice / part.bulkQuantity}/>
                                    <LinkTableCell href={part.url} text="View"/>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
        )
        : (
            <Spinner color="success" />
        )
}

export default PartsList;
