import {TableCell} from "flowbite-react";
import React from "react";

type LinkTableCellProps = {
    href: string;
    text: string;
}

export const LinkTableCell: React.FC<LinkTableCellProps> = (props: LinkTableCellProps) => {
    return (
        <TableCell>
            <a href={props.href} target="_blank" rel="noreferrer">
                {props.text}
            </a>
        </TableCell>
    )
}