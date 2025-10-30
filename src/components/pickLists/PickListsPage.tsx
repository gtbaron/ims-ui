import React, {useState} from "react";
import {Button} from "flowbite-react";
import {PickListsList} from "@/components/pickLists/PickListsList";
import {AddUpdatePickListModal} from "@/components/modals/AddUpdatePickListModal";
import {PickList, PickListStatus} from "@/components/pickLists/PickList";
import {callCreatePickList, callUpdatePickList} from "@/services/PickListService";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {addPickList, updatePickList} from "@/store/slices/PickListSlice";

const defaultPickList: PickList = {
    id: undefined,
    itemId: undefined,
    quantity: 0,
    pickListStatus: PickListStatus.DRAFT,
};

export const PickListsPage: React.FC = () => {
    const pickLists: PickList[] = useAppSelector((state) => state.pickLists.list);
    const [showAddUpdatePickListModal, setShowAddUpdatePickListModal] = useState(false);
    const [modalPickList, setModalPickList] = useState<PickList>(defaultPickList);
    const dispatch = useAppDispatch();

    const handleEdit = (pickListId: number | undefined) => {
        if (!pickListId) return;

        const clickedPickList = pickLists.find(pickList => pickList.id === pickListId);
        if (clickedPickList) {
            setShowAddUpdatePickListModal(true);
            setModalPickList(clickedPickList);
        }
    }

    const handleAdd = () => {
        setShowAddUpdatePickListModal(true);
    }

    const handleAddUpdatePickList = async (submit: boolean, pickList: PickList) => {
        setShowAddUpdatePickListModal(false);
        if (!submit) return;

        if (pickList.id) {
            const updatedPickList = await callUpdatePickList(pickList);
            dispatch(updatePickList(updatedPickList));
        } else {
            const createdPickList = await callCreatePickList(pickList);
            dispatch(addPickList(createdPickList));
        }
    }

    return (
        <div>
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>Pick Lists</h1>
                <Button color={'gray'} size={'sm'} onClick={handleAdd}>Add Pick List</Button>
            </div>
            <PickListsList handleEdit={handleEdit} />
            {showAddUpdatePickListModal && <AddUpdatePickListModal
                pickList={modalPickList}
                showModal={showAddUpdatePickListModal}
                handleResponse={handleAddUpdatePickList}
            />}
        </div>
    );
}