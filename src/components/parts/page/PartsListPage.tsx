import React, {useEffect} from 'react';
import {getParts} from "@/service/PartsService";
import {PartType} from "../part/Part";
import {setPartsList} from "@/store/slices/partsListSlice";
import {useAppDispatch} from "@/store/hooks";
import PartsList from "@/components/parts/list/PartsList";

export const PartsListPage = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchParts = async () => {
            try {
                console.log('Fetching parts...');
                const data: PartType[] = await getParts();
                console.log('Parts fetched:', data);
                dispatch(setPartsList(data));
            } catch (err) {
                console.error('Error fetching parts:', err);
            }
        };

        fetchParts();
    }, [dispatch]);

    return (
        <div>
            <PartsList />
        </div>
    )
}





export default PartsListPage;