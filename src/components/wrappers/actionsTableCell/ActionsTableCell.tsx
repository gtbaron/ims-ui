import {TableCell} from "flowbite-react";
import React, {useState} from "react";
import {IoOpenOutline, IoPencil, IoTrash} from "react-icons/io5";
import './ActionsTableCell.css'
import {ConfirmDeleteModal} from "@/components/modals/ConfirmDeleteModal";

type ActionsTableCellProps = {
    href?: string;
    handleDelete?: (id: number, response: boolean, altId?: number) => void;
    handleEdit?: (id: number | undefined, altId?: number) => void;
    id: number | undefined;
    altId?: number;
    displayName: string;
    showDelete?: boolean;
}

export const ActionsTableCell: React.FC<ActionsTableCellProps> = (props: ActionsTableCellProps) => {
    const [showDelete, setShowDelete] = useState(!!props.showDelete);

    const handleDelete = (response: boolean) => {
        setShowDelete(false);
        if (props.handleDelete) {
            props.handleDelete!(props.id ? props.id : 0, response, props.altId);
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
                            <IoPencil className="text-gray-400 hover:text-gray-100" title="Edit" onClick={() => props.handleEdit!(props.id, props.altId)} />
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