import {TableCell} from "flowbite-react";
import React, {useState} from "react";
import {IoOpenOutline, IoPencil, IoTrash} from "react-icons/io5";
import {ConfirmModal} from "@/components/modals/ConfirmModal";

// Action type definitions
type ActionType = 'link' | 'edit' | 'delete' | 'custom';

interface BaseAction {
    type: ActionType;
    disabled?: boolean;
    tooltip?: string;
}

interface LinkAction extends BaseAction {
    type: 'link';
    href: string;
}

interface EditAction extends BaseAction {
    type: 'edit';
    onEdit: () => void;
}

interface DeleteAction extends BaseAction {
    type: 'delete';
    onDelete: () => void;
    confirmMessage?: string;
}

interface CustomAction extends BaseAction {
    type: 'custom';
    icon: React.ReactNode;
    onAction: () => void;
    confirmTitle?: string;
}

export type Action = LinkAction | EditAction | DeleteAction | CustomAction;

interface ActionsTableCellProps {
    displayName: string;
    actions: Action[];
}

const getConfirmMessage = (action: Action, displayName: string): string => {
    if (action.type === 'delete') {
        return action.confirmMessage || 'Are you sure you want to delete:';
    }
    if (action.type === 'custom') {
        return action.confirmTitle || '';
    }
    return '';
};

interface ActionIconProps {
    action: Action;
    onConfirmNeeded: (action: Action) => void;
}

const ActionIcon: React.FC<ActionIconProps> = ({ action, onConfirmNeeded }) => {
    const baseClass = 'text-gray-400';
    const enabledClass = 'hover:text-gray-100 cursor-pointer';
    const disabledClass = '';

    switch (action.type) {
        case 'link':
            return (
                <a href={action.href} target="_blank" rel="noreferrer">
                    <IoOpenOutline
                        className={`${baseClass} ${enabledClass}`}
                        title={action.tooltip || "Open in new tab"}
                    />
                </a>
            );

        case 'edit':
            return (
                <IoPencil
                    className={`${baseClass} ${action.disabled ? disabledClass : enabledClass}`}
                    title={action.tooltip || "Edit"}
                    onClick={() => {
                        if (!action.disabled) {
                            action.onEdit();
                        }
                    }}
                />
            );

        case 'delete':
            return (
                <IoTrash
                    className="text-red-700 hover:text-red-400 cursor-pointer"
                    title={action.tooltip || "Delete"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onConfirmNeeded(action);
                    }}
                />
            );

        case 'custom':
            return (
                <span
                    className={`${baseClass} ${action.disabled ? disabledClass : enabledClass}`}
                    title={action.tooltip || ''}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!action.disabled) {
                            if (action.confirmTitle) {
                                onConfirmNeeded(action);
                            } else {
                                action.onAction();
                            }
                        }
                    }}
                >
                    {action.icon}
                </span>
            );

        default:
            return null;
    }
};

export const ActionsTableCell: React.FC<ActionsTableCellProps> = ({ displayName, actions }) => {
    const [confirmAction, setConfirmAction] = useState<Action | null>(null);

    const handleConfirm = (confirmed: boolean) => {
        if (confirmed && confirmAction) {
            if (confirmAction.type === 'delete') {
                confirmAction.onDelete();
            }
            if (confirmAction.type === 'custom') {
                confirmAction.onAction();
            }
        }
        setConfirmAction(null);
    };

    return (
        <>
            <TableCell>
                <div className="flex flex-row justify-start gap-2">
                    {actions.map((action, i) => (
                        <ActionIcon key={i} action={action} onConfirmNeeded={setConfirmAction} />
                    ))}
                </div>
            </TableCell>
            {confirmAction && (
                <ConfirmModal
                    open={true}
                    handleDelete={handleConfirm}
                    displayName={displayName}
                    displayMessage={getConfirmMessage(confirmAction, displayName)}
                />
            )}
        </>
    );
};
