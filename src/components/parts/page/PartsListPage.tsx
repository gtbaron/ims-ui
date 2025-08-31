import React, {useEffect, useState} from 'react';
import {callCreatePart, callGetParts, callUpdatePart} from "@/services/PartsService";
import {PartType} from "../part/Part";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import PartsList from "@/components/parts/list/PartsList";
import {addPart, setPartsList, updatePart} from "@/store/slices/partsListSlice";
import {AddUpdatePartModal} from "@/components/modals/addUpdatePartModal/AddUpdatePartModal";

export const PartsListPage = () => {
    const parts: PartType[] = useAppSelector((state) => state.partsList.partsList);
    const [showAddUpdatePartModal, setShowAddUpdatePartModal] = useState(false);
    const [modalPart, setModalPart] = useState<PartType>({ id: 0, name: '', provider: '', bulkPrice: 0, bulkQuantity: 0, url: ''});
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data: PartType[] = await callGetParts();
                dispatch(setPartsList(data));
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchParts();
    }, [dispatch]);

    const handleEdit = (partId: number | undefined) => {
        if (!partId) return;

        const clickedPart = parts.find(part => part.id === partId);
        if (clickedPart) {
            setModalPart(clickedPart);
            setShowAddUpdatePartModal(true);
        }
    }

    const handleAddUpdatePart = async (submit: boolean, part: PartType) => {
        setShowAddUpdatePartModal(false);
        if (submit) {
            if (part.id) {
                const updatedPart = await callUpdatePart(part);
                dispatch(updatePart(updatedPart));
            } else {
                const createdPart = await callCreatePart(part);
                dispatch(addPart(createdPart));
            }
        }
    }

    return (
        <div>
            <PartsList handleEdit={handleEdit} />
            {showAddUpdatePartModal && <AddUpdatePartModal part={modalPart} showModal={showAddUpdatePartModal} handleResponse={handleAddUpdatePart} />}
        </div>
    )
}

export default PartsListPage;