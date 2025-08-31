import React from "react";

export type PartType = {
    id?: number;
    name: string;
    provider: string;
    bulkPrice: number;
    bulkQuantity: number;
    url: string;
};

const Part: React.FC<PartType> = (props: PartType) => {
    return (
        <div>
            <h1>Part {props.id}</h1>
            <h2>{props.name}</h2>
        </div>
    )
}

export default Part;