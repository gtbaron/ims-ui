export enum PickListStatus {
    DRAFT = 'DRAFT',
    INSUFFICIENT_PARTS = 'INSUFFICIENT_PARTS',
    READY_TO_PICK = 'READY_TO_PICK',
    IN_BUILD = 'IN_BUILD',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ARCHIVED = 'ARCHIVED'
};

export type PickList = {
    id?: number;
    itemId?: number;
    quantity: number;
    pickListStatus: PickListStatus;
    missingParts: number[];
};