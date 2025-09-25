import React, {useMemo} from "react";
import {useAppSelector} from "@/store/hooks";

export const ItemsInventory: React.FC = () => {
    const items = useAppSelector((state) => state.items.list);
    const itemsInventory = useAppSelector((state) => state.itemsInventory.list);

    const inventoryDisplayList = useMemo(() => {
        const itemById = new Map(items.map(item => [item.id, item]));
        return (itemsInventory ?? []).map(itemInventory => ({
            id: itemById.get(itemInventory.itemId)?.id,
            name: itemById.get(itemInventory.itemId)?.name,
            quantity: itemInventory.quantity,
        }));
    }, [items, itemsInventory]);

    return (
        <>
            <div className="flex justify-start mb-3">
                <h1 className='text-yellow-200'>TODO: finish implementing items inventory</h1>
            </div>
            <ul className={'text-white text-left mb-3'}>
                {inventoryDisplayList.map(ii => (
                    <li key={ii.id}>{ii.name} - {ii.quantity}</li>
                ))}
            </ul>
        </>
    );
}