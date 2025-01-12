import React, { forwardRef } from "react";
import SALNPDFFormat from "./SALNPDFFormat";
import { Square, SquareCheck } from "lucide-react";
import Liabilities from "./Liabilities";
import BIFC from "./BIFC";
import Relatives from "./Relatives";
import { User } from "@/Types";
import { SALNTOTALTYPE } from "./SALNSeparatePage";
import { PAGE, SALNTPRINTYPE } from "../Types/type";

type Props = Omit<SALNTPRINTYPE, "pages"|"user"> & {
    pagecount: {
        page: number,
        totalPage: number
    },
    page: PAGE,
};

const SALNPage2 = forwardRef<HTMLDivElement, Props>(({ pagecount, saln, spouse, page, declarant }, ref) => {
    return (
        <SALNPDFFormat
            ref={ref}
            page={pagecount}
        >
            <div className="font-bold text-[10pt]">2. LIABILITIES*</div>
            <div className="mt-1">
                <Liabilities liabilities={page.liabilities} saln_totals={page.saln_totals} />
            </div>
            <div className="italic text-[10pt] mt-1">
                * Additional sheet/s may be used, if necessary.
            </div>

            <div>
                <div className="font-bold text-center underline text-[10pt] mt-6">
                    BUSINESS INTERESTS AND FINANCIAL CONNECTIONS
                </div>
                <div className="text-[8pt] text-center italic leading-4">
                    (of Declarant /Declarant’s spouse/ Unmarried Children Below Eighteen (18) years of Age Living in Declarant’s Household)
                </div>
                <div className="text-[10pt] flex items-center justify-center gap-2">
                    {saln.biandfc && (
                        !saln.biandfc.nobiandfc ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />
                    )}
                    <div>I/We do not have any business interest or financial connection.</div>
                </div>

                <div className="mt-1">
                    <BIFC bifc={saln.biandfc?.bifc} />
                </div>
            </div>

            <div>
                <div className="font-bold text-center underline text-[10pt] mt-6">
                    RELATIVES IN THE GOVERNMENT SERVICE
                </div>
                <div className="text-[8pt] text-center italic leading-4">
                    (Within the Fourth Degree of Consanguinity or Affinity. Include also Bilas, Balae and Inso)
                </div>
                <div className="text-[10pt] flex items-center justify-center gap-2">
                    {page.relatives && (
                        !page.relatives.norelative ? <Square className="size-3.5" /> : <SquareCheck className="size-3.5" />
                    )}
                    <div>I/We do not know of any relative/s in the government service</div>
                </div>

                <div className="mt-1">
                    <Relatives relatives={page.relatives?.relatives} />
                </div>
            </div>

            <p className="indent-24 text-[10.5pt] text-justify mt-4">
                I hereby certify that these are true and correct statements of my assets, liabilities, net worth, business interests and financial connections, including those of my spouse and unmarried children below eighteen (18) years of age living in my household, and that to the best of my knowledge, the above-enumerated are names of my relatives in the government within the fourth civil degree of consanguinity or affinity.
            </p>

            <p className="indent-24 text-[10.5pt] text-justify mt-1">
                I hereby authorize the Ombudsman or his/her duly authorized representative to obtain and secure from all appropriate government agencies, including the Bureau of Internal Revenue such documents that may show my assets, liabilities, net worth, business interests and financial connections, to include those of my spouse and unmarried children below 18 years of age living with me in my household covering previous years to include the year I first assumed office in government.
            </p>

            <div className="mt-5 flex gap-5 text-[10pt]">
                <div>Date:</div>
                <div className="border-b border-black w-48"></div>
            </div>

            <div className="grid grid-cols-2 gap-10 text-[10pt] mt-3">
                <div className="text-center">
                    <div className="h-6 border-b border-black"></div>
                    <div className="text-[8pt] italic">(Signature of Declarant)</div>
                    <div className="mt-3">
                        <div className="grid grid-cols-[9rem,1fr] text-[8pt] text-left">
                            <div className="">Government Issued ID:</div>
                            <div className="border-b border-black">{declarant?.governmentissuedid}</div>
                        </div>
                        <div className="grid grid-cols-[9rem,1fr] text-[8pt] text-left">
                            <div className="">ID No.:</div>
                            <div className="border-b border-black">{declarant?.licensepassportid}</div>
                        </div>
                        <div className="grid grid-cols-[9rem,1fr] text-[8pt] text-left">
                            <div className="">Date Issued:</div>
                            <div className="border-b border-black">{declarant?.issued?.split('/')[0]}</div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <div className="h-6 border-b border-black"></div>
                    <div className="text-[8pt] italic">(Signature of Co-Declarant/Spouse)</div>
                    <div className="mt-3">
                        <div className="grid grid-cols-[9rem,1fr] text-[8pt] text-left">
                            <div className="">Government Issued ID:</div>
                            <div className="border-b border-black">{spouse?.governmentissuedid}</div>
                        </div>
                        <div className="grid grid-cols-[9rem,1fr] text-[8pt] text-left">
                            <div className="">ID No.:</div>
                            <div className="border-b border-black">{spouse?.idno}</div>
                        </div>
                        <div className="grid grid-cols-[9rem,1fr] text-[8pt] text-left">
                            <div className="">Date Issued:</div>
                            <div className="border-b border-black">{spouse?.dateissued}</div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[10pt] mt-7 indent-8">
                <span className="font-bold">SUBSCRIBED AND SWORN </span>
                <span>to before me this </span>
                <u>______</u>
                <span>day of  </span>
                <u>______</u>
                <span>, affiant exhibiting to me the above-stated government issued identification card.</span>
            </p>

            <div className="mt-4 text-[10pt] text-center w-fit ml-auto mr-20">
                <div>___________________________________________</div>
                <div className="italic leading-4">(Person Administering Oath)</div>
            </div>

        </SALNPDFFormat>
    );
});

export default SALNPage2;
