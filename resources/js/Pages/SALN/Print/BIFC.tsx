import React from "react";
import { SALNTPRINTYPE, SALNTYPE } from "../Types/type";

type Props = {
    bifc: SALNTYPE['biandfc']['bifc']
}

const BIFC: React.FC<Props> = ({ bifc }) => {
    return (
        <div className="border border-black divide-y divide-black">
            <div className="grid grid-cols-4 divide-x divide-black font-bold text-[8pt] text-center [&>div]:px-1 [&>div]:pt-1 bg-black/25">
                <div>NAME OF ENTITY/BUSINESS ENTERPRISE</div>
                <div>BUSINESS ADDRESS</div>
                <div>NATURE OF BUSINESS INTEREST &/OR FINANCIAL CONNECTION</div>
                <div>DATE OF ACQUISITION OF INTEREST OR CONNECTION</div>
            </div>

            {bifc?.map((b, index) => (
                <div key={index} className="grid grid-cols-4 divide-x divide-black text-[10pt] text-center [&>div]:px-1 uppercase pt-0.5">
                    <div>{b?.name}</div>
                    <div>{b?.address}</div>
                    <div>{b?.nature}</div>
                    <div>{b?.date??'n/a'}</div>
                </div>
            ))}

            {bifc.length === 0 && Array.from({ length: 4 - (bifc?.length||0) }).map((__dirname, index) => (
                <div key={index} className="grid grid-cols-4 divide-x divide-black text-[9pt] text-center [&>div]:px-1 uppercase">
                    <div>N/A</div>
                    <div>N/A</div>
                    <div>N/A</div>
                    <div>N/A</div>
                </div>
            ))}
        </div>
    );
};

export default BIFC;
