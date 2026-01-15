import React from 'react';
import { TableHeadCell } from 'flowbite-react';
import { HiChevronUp, HiChevronDown } from 'react-icons/hi';
import { SortConfig } from '@/types/SortTypes';

type SortableTableHeadCellProps<T> = {
    columnKey: keyof T;
    sortConfig: SortConfig<T>;
    onSort: (key: keyof T) => void;
    children: React.ReactNode;
    className?: string;
    centered?: boolean;
};

export function SortableTableHeadCell<T>({
    columnKey,
    sortConfig,
    onSort,
    children,
    className = '',
    centered = false,
}: SortableTableHeadCellProps<T>) {
    const isSorted = sortConfig.key === columnKey;

    return (
        <TableHeadCell
            className={`cursor-pointer select-none hover:bg-gray-700 ${className}`}
            onClick={() => onSort(columnKey)}
        >
            <div className={`flex items-center gap-1 ${centered ? 'justify-center' : ''}`}>
                {children}
                {isSorted && (
                    sortConfig.order === 'asc'
                        ? <HiChevronUp className="text-lg" />
                        : <HiChevronDown className="text-lg" />
                )}
            </div>
        </TableHeadCell>
    );
}
