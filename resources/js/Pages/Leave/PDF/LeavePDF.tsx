import React from "react";
import { cn } from "@/Lib/utils";
import LeavePDFApplicant from "./LeavePDFApplicant";
import LeavePDFDetailsOfApplication from "./LeavePDFDetailsOfApplication";
import LeavePDFDetailsOfActionOnApplication from "./LeavePDFDetailsOfActionOnApplication";
import DepEdLogo from "@/Assets/images/DepEd.png";
import { APPLICATIONFORLEAVETYPES, PRINCIPAL } from "./type";

const LeavePDF = React.forwardRef<
    HTMLDivElement,
    { isDownload?: boolean; leave: APPLICATIONFORLEAVETYPES; hr: string; principal: PRINCIPAL }
>(({ isDownload, leave, hr, principal }, ref) => {

    return (
        <div ref={ref} className="w-[790px] shrink-0 mx-auto text-[11px]">
            <style>
                    {`
                        @media print {
                            body {
                                overflow: hidden;
                                height: fit-content;
                            }
                        }

                        @page {
                            size: portrait;
                        }
                    `}
            </style>
            <div className={cn("flex flex-col m-[40pt] mx-[30pt]", isDownload && "my-[20pt] dark:text-black")}>
                <div className="flex p-2 mx-auto">
                    <img
                        src={DepEdLogo}
                        alt=""
                        style={{ width: 80, height: 80 }}
                    />
                    <div className="ml-10 text-center mr-auto">
                        <div>Republic of the Philippines</div>
                        <div>Department of Education</div>
                        <div>Region XI</div>
                        <div>SCHOOLS DIVISION OF PANABO CITY</div>
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                marginTop: 5,
                            }}
                        >
                            APPLICATION FOR LEAVE
                        </div>
                    </div>
                    <img
                        src={DepEdLogo}
                        alt=""
                        style={{ width: 65, height: 65 }}
                        className="opacity-0"
                    />
                </div>

                <div className={cn("mt-4 border", isDownload ? "border-black" : "dark:border-border border-black")}>
                    <LeavePDFApplicant leave={leave} isDownload={isDownload} />

                    <LeavePDFDetailsOfApplication
                        isDownload={isDownload}
                        leave={leave}
                    />

                    <LeavePDFDetailsOfActionOnApplication
                        isDownload={isDownload}
                        hr={hr}
                        principal={principal}
                    />
                </div>
            </div>
        </div>
    );
});

export default LeavePDF;
