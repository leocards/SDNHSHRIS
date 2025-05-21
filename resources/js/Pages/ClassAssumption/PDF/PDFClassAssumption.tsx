import React, { forwardRef } from "react";
import Header from "./Header";
import deped from "@/Assets/images/DepEd.png";
import { format } from "date-fns";
import { User } from "@/Types";
import Footer from "./Footer";
import { CLASSASSUMPTIONTYPE } from "../type";
import SickLeaveContent from "./SickLeaveContent";
import OfficialBusinessContent from "./OfficialBusinessContent";

type Props = {
    ca: CLASSASSUMPTIONTYPE;
};

const PDFClassAssumption = forwardRef<HTMLDivElement, Props>(({ ca }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[790px] shrink-0 print:mx-auto print:px-7 scale-95"
        >
            <style>
                {`
                    @media print {
                        body {
                            overflow: hidden;
                            height: fit-content;
                            margin: 0px !important;
                        }
                        @page {
                            size: portrait;
                            margin-top: 1rem;
                            margin-bottom: 0.88rem;
                            page-break-inside: avoid; /* Avoid breaking inside this element */
                            break-inside: avoid; /* Modern alternative to page-break-inside */
                        }
                    }
                `}
            </style>

            <Header principal={ca.principal} />
            {ca.details.details.catype === "sick" ? (
                <SickLeaveContent
                    user={ca.user}
                    academichead={ca.academichead.full_name}
                    curriculumhead={ca.curriculumnhead.full_name}
                    details={ca.details.details}
                    date={ca.details.date}
                    loads={ca.details.classloads}
                />
            ) : (
                <OfficialBusinessContent
                    user={ca.user}
                    academichead={ca.academichead.full_name}
                    curriculumhead={ca.curriculumnhead.full_name}
                    details={ca.details.details}
                    date={new Date(ca.details.date.from)}
                    loads={ca.details.classloads}
                />
            )}
            <Footer principal={ca.principal} />
        </div>
    );
});

export default PDFClassAssumption;
