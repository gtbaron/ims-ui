import React from "react";
import {TabItem, Tabs} from "flowbite-react";
import {HiShoppingBag} from "react-icons/hi";
import {HiWrench} from "react-icons/hi2";
import {ItemsInventory} from "@/components/inventory/items/ItemsInventory";

export const InventoryPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-start mb-3">
                <h1 className='text-white'>Inventory</h1>
            </div>
            <Tabs aria-label="Tabs with icons" variant="underline">
                <TabItem active title="Items" icon={HiShoppingBag}>
                    <ItemsInventory />
                </TabItem>
                <TabItem title="Parts" icon={HiWrench}>
                    <div className={'text-white'}>Parts Inventory</div>
                </TabItem>
            </Tabs>
        </div>
    )
}