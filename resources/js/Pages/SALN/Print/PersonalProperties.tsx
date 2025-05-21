import React from "react";
import { SALNTOTALTYPE } from "./SALNSeparatePage";
import { SALNTYPE } from "../Types/type";
import { format } from "date-fns";

type Props = {
    asof: string;
    saln_totals: SALNTOTALTYPE
    personal: SALNTYPE['assets']['personal']
}

const PersonalProperties: React.FC<Props> = ({ asof, personal, saln_totals }) => {
    return (
        <div>
            <div className="grid grid-cols-[1fr,12rem,8rem] bg-black/25 text-[8pt] text-center font-bold [&>div]:py-1.5 divide-x divide-black border border-black">
                <div>DESCRIPTION</div>
                <div>YEAR ACQUIRED</div>
                <div>ACQUISITION COST/AMOUNT</div>
            </div>
            <div className="divide-y divide-black border-b border-x border-black">
                {personal?.map((p, index) => (
                    <Card asof={asof} key={index} personal={p} />
                ))}
                {Array.from({ length: 4 - (personal?.length||0) }).map((_, index) => (
                    <div key={index} className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] divide-x divide-black text-center">
                        <div>N/A</div>
                        <div>N/A</div>
                        <div>N/A</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] font-bold">
                <div className="col-span-2 text-right">Subtotal:</div>
                <div className="border-b border-black text-center">₱ {Number(saln_totals.personal).toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-[1fr,12rem,8rem] text-[10pt] mt-2 font-bold">
                <div className="col-span-2 text-right">
                    TOTAL ASSETS (a+b):
                </div>
                <div className="border-b-2 border-black text-center">
                    ₱ {Number((saln_totals.personal) + (saln_totals.real)).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

const Card: React.FC<{asof:string; personal?: {
    description: string;
    yearacquired: string;
    acquisitioncost: string;
}}> = ({
    asof,
    personal
}) => {
    return (
        <div
            className="grid grid-cols-[1fr,12rem,8rem] text-[8.5pt] divide-x divide-black text-center uppercase"
        >
            <div>{personal? personal.description : "N/A"}</div>
            <div>{personal? personal.yearacquired + ('-' + format(asof, 'y')) : "N/A"}</div>
            <div>{personal? !isNaN(parseFloat(personal.acquisitioncost)) ? "₱ " + Number(personal.acquisitioncost).toLocaleString() : "N/A" : "N/A"}</div>
        </div>
    );
}

export default PersonalProperties;
