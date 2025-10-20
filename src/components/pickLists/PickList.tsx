export enum PickListStatus {
    DRAFT,
    FULFILLED,
    INSUFFICIENT_PARTS,
    PICKED
};

export type PickList = {
    id?: number;
    itemId?: number;
    quantity: number;
    pickListStatus: PickListStatus;
};