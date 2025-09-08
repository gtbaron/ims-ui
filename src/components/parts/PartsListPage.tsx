import React, {useEffect, useState} from 'react';
import {callCreatePart, callGetParts, callUpdatePart} from "@/services/PartsService";
import {Part} from "./Part";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import PartsList from "@/components/parts/PartsList";
import {addPart, setParts, updatePart} from "@/store/slices/PartsSlice";
import {AddUpdatePartModal} from "@/components/modals/AddUpdatePartModal";
import {Button} from "flowbite-react";

const defaultPart: Part = {
    name: '',
    provider: '',
    bulkPrice: 0,
    bulkQuantity: 0,
    url: ''
};

export const PartsListPage = () => {
    const parts: Part[] = useAppSelector((state) => state.parts.list);
    const [showAddUpdatePartModal, setShowAddUpdatePartModal] = useState(false);
    const [modalPart, setModalPart] = useState<Part>(defaultPart);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data: Part[] = await callGetParts();
                dispatch(setParts(data));
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

    const handleAdd = () => {
        setModalPart(defaultPart);
        setShowAddUpdatePartModal(true);
    }

    const handleAddUpdatePart = async (submit: boolean, part: Part) => {
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
            <div className="flex justify-between mb-3">
                <h1 className='text-white'>Parts</h1>
                <Button color={'gray'} size={'sm'} onClick={() => handleAdd()}>Add Part</Button>
            </div>
            <PartsList handleEdit={handleEdit} />
            {showAddUpdatePartModal && <AddUpdatePartModal part={modalPart} showModal={showAddUpdatePartModal} handleResponse={handleAddUpdatePart} />}
        </div>
    )
}

export default PartsListPage;