import { Square, SquareCheck } from "lucide-react";
import React, { forwardRef, useMemo, useRef } from "react";
import SALNPDFFormat from "./SALNPDFFormat";
import Children from "./Children";
import RealProperties from "./RealProperties";
import PersonalProperties from "./PersonalProperties";
import { format } from "date-fns";
import { User } from "@/Types";
import { SALNTOTALTYPE } from "./SALNSeparatePage";
import { PAGE, SALNTPRINTYPE } from "../Types/type";
import { cn } from "@/Lib/utils";

type Props = Omit<SALNTPRINTYPE, "pages"> & {
    pagecount: {
        page: number,
        totalPage: number
    },
    page: PAGE
};

const SALNPage1 = forwardRef<HTMLDivElement, Props>(({ pagecount, user, saln, spouse, address, page }, ref) => {
    return (
        <SALNPDFFormat
            ref={ref}
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
                <div className="text-center flex justify-center text-[10pt] leading-4">
                    As of{" "}
                    <div className="border-b border-black w-48 leading-4">
                        {format(saln?.asof, 'MMMM dd, y')}
                    </div>
                </div>
                <div className="text-[8pt] text-center">
                    (Required by R.A. 6713)
                </div>
            </div>

            <div className="text-[8pt] text-center mt-2">
                <div>
                    {" "}
                    <span className="font-bold">Note: </span>{" "}
                    <span className="italic">
                        Husband and wife who are both public officials and
                        employees may file the required statements jointly or
                        separately.
                    </span>{" "}
                </div>
                <div className="flex gap-16 justify-center">
                    <div className="flex items-center gap-1.5">
                        {saln.isjoint !== "joint" ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />}
                        <div className="italic text-[10pt]">Joint Filing</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {saln.isjoint !== "separate" ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />}
                        <div className="italic text-[10pt]">
                            Separate Filing
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {saln.isjoint !== "not" ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />}
                        <div className="italic text-[10pt]">Not Applicable</div>
                    </div>
                </div>
            </div>

            {/* Declarant and spouse */}
            <div className="text-[8pt] mt-3 uppercase">
                {/* Declarant */}
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
                                    <div className="grid grid-cols-[1fr,1fr,3rem] capitalize">
                                        <div className="">(Family Name)</div>
                                        <div className="">(First Name)</div>
                                        <div className="">(M.I.)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[5rem]">
                                Address:
                            </div>
                            <div className="grow min-h-7">
                                <div className={cn("border-b border-black", !address && "h-4")}>{address}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Position:
                            </div>
                            <div className="grow h-4 border-b border-black">{user.position}</div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Agency/Office:
                            </div>
                            <div className="grow h-4 border-b border-black">
                                Southern Davao NHS
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Office Address:
                            </div>
                            <div className="grow h-4 border-b border-black">
                                Southern Davao, Panabo City
                            </div>
                        </div>
                    </div>
                </div>
                {/* Spouse */}
                <div className="grid grid-cols-[1fr,19rem] gap-7">
                    <div>
                        <div className="flex items-start mt-1">
                            <div className="font-bold uppercase w-[5rem]">
                                Spouse:
                            </div>
                            <div className="grow">
                                <div className="border-b border-black h-4">
                                    <div className="grid grid-cols-[1fr,1fr,3rem]">
                                        <div className="">{spouse?.familyname}</div>
                                        <div className="">{spouse?.firstname}</div>
                                        <div className="">{spouse?.middleinitial?.charAt(0)}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-[1fr,1fr,3rem] capitalize">
                                        <div className="">(Family Name)</div>
                                        <div className="">(First Name)</div>
                                        <div className="">(M.I.)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-start mt-1">
                            <div className="font-bold uppercase w-[7rem]">
                                Position:
                            </div>
                            <div className="grow h-4 border-b border-black">{spouse?.position}</div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Agency/Office:
                            </div>
                            <div className="grow h-4 border-b border-black">{spouse?.office}</div>
                        </div>
                        <div className="flex items-start">
                            <div className="font-bold uppercase w-[7rem]">
                                Office Address:
                            </div>
                            <div className="grow">
                                {
                                    spouse ? (
                                        <div className="border-b border-black">
                                            {spouse.officeaddress}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-4 border-b border-black"></div>
                                            <div className="h-4 border-b border-black"></div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-y border-black h-0.5 my-3"></div>

            <div className="font-bold text-center underline text-[10pt]">
                UNMARRIED CHILDREN BELOW EIGHTEEN (18) YEARS OF AGE LIVING IN DECLARANT’S  HOUSEHOLD
            </div>

            <div className="mt-1">
                <Children children={page.children} />
            </div>

            <div className="border-y border-black h-0.5 mt-5 mb-2.5"></div>

            <div className="font-bold text-center underline text-[10pt]">
                ASSETS, LIABILITIES AND NETWORTH
            </div>

            <div className="text-[10pt] text-center px-32 leading-4 italic">
            (Including those of the spouse and unmarried children below eighteen (18)
                years of age living in declarant’s household)
            </div>

            <div>
                <div className="font-bold text-[10pt]">1. ASSETS</div>
                <div className="indent-4 font-bold text-[10pt]">a. Real Properties*</div>

                <div className="mt-1">
                    <RealProperties real={page.real} saln_totals={page.saln_totals} />
                </div>

                <div className="indent-4 font-bold text-[10pt]">b. Personal Properties*</div>
                <div className="mt-1">
                    <PersonalProperties personal={page.personal} saln_totals={page.saln_totals} />
                </div>
            </div>
            <div className="italic text-[10pt] mt-4">* Additional sheet/s may be used, if necessary.</div>
        </SALNPDFFormat>
    );
});

export default SALNPage1;
