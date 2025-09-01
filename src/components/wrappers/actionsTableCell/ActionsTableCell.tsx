import {TableCell} from "flowbite-react";
import React, {useState} from "react";
import {IoOpenOutline, IoPencil, IoTrash} from "react-icons/io5";
import './ActionsTableCell.css'
import {ConfirmDeleteModal} from "@/components/modals/ConfirmDeleteModal";

type LinkTableCellProps = {
    href?: string;
    handleDelete?: (id: number, response: boolean) => void;
    handleEdit?: (id: number | undefined) => void;
    id: number | undefined;
    displayName: string;
    showDelete?: boolean;
}

export const ActionsTableCell: React.FC<LinkTableCellProps> = (props: LinkTableCellProps) => {
    const [showDelete, setShowDelete] = useState(!!props.showDelete);

    const handleDelete = (response: boolean) => {
        setShowDelete(false);
        if (props.handleDelete && props.id) {
            props.handleDelete!(props.id, response);
        }
    }

    return (
        <>
            <TableCell>
                <div className={'actions-table-cell'}>
                    {
                        props.href &&
                            <a href={props.href} target="_blank" rel="noreferrer">
                                <IoOpenOutline className="text-gray-400 hover:text-gray-100" title="Open in new tab"/>
                            </a>
                    }
                    {
                        props.handleEdit &&
                            <IoPencil className="text-gray-400 hover:text-gray-100" title="Edit" onClick={() => props.handleEdit!(props.id)} />
                    }
                    {
                        props.handleDelete &&
                            <IoTrash
                                className="text-red-700 hover:text-red-400"
                                onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDelete(true);
                                    }
                                }
                                title="Delete"
                            />
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