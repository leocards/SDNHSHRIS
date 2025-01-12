import React from "react";
import SALNPDFFormat from "./SALNPDFFormat";
import RealProperties from "./RealProperties";
import PersonalProperties from "./PersonalProperties";
import Liabilities from "./Liabilities";
import BIFC from "./BIFC";
import { User } from "@/Types";
import { PAGE, SALNTPRINTYPE, SALNTYPE } from "../Types/type";

export type SALNTOTALTYPE = {
    real: number,
    personal: number,
    liability: number,
    networth: number
}

type Props = Omit<SALNTPRINTYPE, "pages"> & {
    pagecount: {
        page: number,
        totalPage: number
    }
    page: PAGE
};

const SALNSeparatePage: React.FC<Props> = ({
    pagecount, user, saln, spouse, page, declarant
}) => {
    return (
        <SALNPDFFormat
            page={pagecount}
         >
            <div className="text-[7pt]">
                <div className="text-left w-fit ml-auto">
                    <div>Revised as of January 2015</div>
                    <div>Per CSC Resolution No. 1500088</div>
                    <div>Promulgated on January 23, 2015</div>
                </div>
            </div>

            <div className="font-bold text-[12pt] text-center mt-1">
                SWORN STATEMENT OF ASSETS, LIABILITIES AND NET WORTH
            </div>

            <div className="">
                <div className="text-center text-[10pt] leading-4">
                    As of <span className="underline">November 23, 2024</span>
                </div>
                <div className="text-[10pt] text-center italic">
                    (Additional sheet/s for the declarant)
                </div>
            </div>

            <div className="text-[8pt] mt-4">
                <div className="grid grid-cols-[1fr,19rem] gap-7">
                    <div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[5rem]">
                                Declarant:
                            </div>
                            <div className="grow">
                                <div className="border-b border-black h-4">
                                    <div className="grid grid-cols-[1fr,1fr,3rem]">
                                        <div className="">{user.lastname}</div>
                                        <div className="">{user.firstname}</div>
                                        <div className="">{user.middlename?.charAt(0)}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-[1fr,1fr,3rem]">
                                        <div className="">(Family Name)</div>
                                        <div className="">(First Name)</div>
                                        <div className="">(M.I.)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Position:
                            </div>
                            <div className="grow h-4 border-b border-black"></div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Agency/Office:
                            </div>
                            <div className="grow h-4 border-b border-black"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-y border-black h-[3px] my-3"></div>

            <div className="font-bold text-center underline text-[10pt]">
                ASSETS, LIABILITIES AND NETWORTH
            </div>

            <div>
                <div className="font-bold text-[10pt]">1. ASSETS</div>
                <div className="indent-4 font-bold text-[10pt]">
                    a. Real Properties*
                </div>

                <div className="mt-1">
                    <RealProperties real={page.real} saln_totals={page.saln_totals} />
                </div>

                <div className="indent-4 font-bold text-[10pt]">
                    b. Personal Properties*
                </div>
                <div className="mt-1">
                    <PersonalProperties personal={page.personal} saln_totals={page.saln_totals} />
                </div>
            </div>

            <div className="font-bold text-[10pt]">2. LIABILITIES*</div>
            <div className="mt-1">
                <Liabilities liabilities={page.liabilities} saln_totals={page.saln_totals} />
            </div>

            <div className="border-y border-black h-[3px] my-3"></div>

            <div className="">
                <div className="font-bold text-center underline text-[10pt] mt-6">
                    BUSINESS INTERESTS AND FINANCIAL CONNECTIONS
                </div>

                <div className="mt-1">
                    <BIFC bifc={saln.biandfc?.bifc} />
                </div>
            </div>
        </SALNPDFFormat>
    );
};

export default SALNSeparatePage;
