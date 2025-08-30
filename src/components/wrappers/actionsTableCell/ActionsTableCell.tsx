import {TableCell} from "flowbite-react";
import React from "react";
import {IoOpenOutline, IoTrash} from "react-icons/io5";
import './ActionsTableCell.css'

type LinkTableCellProps = {
    href: string;
    handleDelete?: () => void;
}

export const ActionsTableCell: React.FC<LinkTableCellProps> = (props: LinkTableCellProps) => {
    return (
        <TableCell>
            <div className={'actions-table-cell'}>
                <a href={props.href} target="_blank" rel="noreferrer">
                    <IoOpenOutline className="text-gray-400 hover:text-gray-100" />
                </a>
                {
                    props.handleDelete &&
                    <>
                        <IoTrash className="text-gray-400 hover:text-gray-100" onClick={props.handleDelete} />
                    </>
                }
            </div>
        </TableCell>
    )
}