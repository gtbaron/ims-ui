import {TableCell} from "flowbite-react";
import React, {useState} from "react";
import {IoClipboardOutline, IoOpenOutline, IoPencil, IoTrash} from "react-icons/io5";
import {ConfirmModal} from "@/components/modals/ConfirmModal";

type ActionsTableCellProps = {
    href?: string;
    handleDelete?: (id: number, response: boolean, altId?: number) => void;
    canEdit?: boolean;
    handleEdit?: (id: number | undefined, altId?: number) => void;
    id: number | undefined;
    altId?: number;
    displayName: string;
    showDelete?: boolean;
    handleAlt?: (id: number | undefined, response: boolean) => void;
    canHandleAlt?: boolean;
    altTitle?: string;
    altToolTip?: string;
    showAlt?: boolean;
}

export const ActionsTableCell: React.FC<ActionsTableCellProps> = (props: ActionsTableCellProps) => {
    const [showAlt, setShowAlt] = useState(!!props.showAlt)
    const [showDelete, setShowDelete] = useState(!!props.showDelete);

    const handleAlt = (response: boolean) => {
        setShowAlt(false);
        if (props.handleAlt) {
            props.handleAlt!(props.id, response);
        }
    }

    const handleDelete = (response: boolean) => {
        setShowDelete(false);
        if (props.handleDelete) {
            props.handleDelete!(props.id ? props.id : 0, response, props.altId);
        }
    }

    return (
        <>
            <TableCell>
                <div className={'flex flex-row justify-start gap-2'}>
                    {
                        props.href &&
                            <a href={props.href} target="_blank" rel="noreferrer">
                                <IoOpenOutline className={'text-gray-400 hover:text-gray-100 cursor-pointer'} title="Open in new tab"/>
                            </a>
                    }
                    {
                        props.handleAlt &&
                            <IoClipboardOutline className={`text-gray-400 ${props.canHandleAlt ? 'cursor-pointer hover:text-gray-100' : ''}`}
                                title={`${props.altToolTip ? props.altToolTip : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (props.canHandleAlt) {
                                        setShowAlt(true);
                                    }
                                }}
                            />
                    }
                    {
                        props.handleEdit &&
                            <IoPencil className={`text-gray-400 ${props.canEdit ? 'hover:text-gray-100 cursor-pointer' : ''}`}
                                title="Edit"
                                onClick={() => {
                                    if (props.canEdit) {
                                        props.handleEdit!(props.id, props.altId)
                                    }
                                }}
                            />
                    }
                    {
                        props.handleDelete &&
                            <IoTrash
                                className={'text-red-700 hover:text-red-400 cursor-pointer'}
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
                showDelete && <ConfirmModal
                    open={showDelete}
                    handleDelete={handleDelete}
                    displayName={props.displayName}
                    displayMessage={'Are you sure you want to delete:'}
                />
            }
            {
                showAlt && <ConfirmModal
                    open={showAlt}
                    handleDelete={handleAlt}
                    displayName={props.displayName}
                    displayMessage={props.altTitle ? props.altTitle : ''}
                />
            }
        </>
    )
}