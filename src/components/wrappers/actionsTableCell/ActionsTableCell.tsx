import {TableCell} from "flowbite-react";
import React, {useState} from "react";
import {IoOpenOutline, IoTrash} from "react-icons/io5";
import './ActionsTableCell.css'
import {ConfirmDeleteModal} from "@/components/modals/ConfirmDeleteModal";

type LinkTableCellProps = {
    href: string;
    handleDelete?: (id: number, response: boolean) => void;
    id: number;
    displayName: string;
    showDelete?: boolean;
}

export const ActionsTableCell: React.FC<LinkTableCellProps> = (props: LinkTableCellProps) => {
    const [showDelete, setShowDelete] = useState(!!props.showDelete);

    const handleDelete = (response: boolean) => {
        setShowDelete(false);
        if (props.handleDelete) {
            props.handleDelete!(props.id, response);
        }
    }

    return (
        <>
            <TableCell>
                <div className={'actions-table-cell'}>
                    <a href={props.href} target="_blank" rel="noreferrer">
                        <IoOpenOutline className="text-gray-400 hover:text-gray-100" />
                    </a>
                    {
                        props.handleDelete &&
                        <>
                            <IoTrash className="text-gray-400 hover:text-gray-100" onClick={() => setShowDelete(true)} />
                        </>
                    }
                </div>
            </TableCell>
            {
                showDelete && <ConfirmDeleteModal
                    open={showDelete}
                    handleDelete={handleDelete}
                    displayName={props.displayName}
                />
            }
        </>
    )
}