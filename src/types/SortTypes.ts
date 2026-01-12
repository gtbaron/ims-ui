export type SortOrder = 'asc' | 'desc';

export interface SortConfig<T> {
    key: keyof T | null;
    order: SortOrder;
}
