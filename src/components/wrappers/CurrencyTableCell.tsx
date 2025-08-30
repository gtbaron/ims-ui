import {usdFormatter} from "@/utils/FormatUtils";
import {TableCell} from "flowbite-react";
import React from "react";

type CurrencyTableCellProps = {
    value: number;
}

export const CurrencyTableCell: React.FC<CurrencyTableCellProps> = (props: CurrencyTableCellProps) => {
    return (
        <TableCell>{usdFormatter.format(Math.floor(props.value * 100)/100)}</TableCell>
    )
}