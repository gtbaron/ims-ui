export enum PickListStatus {
    DRAFT = 'DRAFT',
    FULFILLED = 'FULFILLED',
    INSUFFICIENT_PARTS = 'INSUFFICIENT_PARTS',
    PICKED = 'PICKED'
};

export type PickList = {
    id?: number;
    itemId?: number;
    quantity: number;
    pickListStatus: PickListStatus;
    missingParts: number[];
};