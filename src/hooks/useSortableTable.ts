import { useState, useMemo } from 'react';
import { SortConfig, SortOrder } from '@/types/SortTypes';

export function useSortableTable<T>(
    data: T[],
    defaultSortKey: keyof T | null = null,
    defaultSortOrder: SortOrder = 'asc'
) {
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
        key: defaultSortKey,
        order: defaultSortOrder,
    });

    const handleSort = (key: keyof T) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return {
                    key,
                    order: prevConfig.order === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, order: 'asc' };
        });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) {
            return data;
        }

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            let comparison = 0;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else {
                comparison = String(aValue).localeCompare(String(bValue));
            }

            return sortConfig.order === 'asc' ? comparison : -comparison;
        });
    }, [data, sortConfig]);

    return {
        sortedData,
        sortConfig,
        handleSort,
    };
}
