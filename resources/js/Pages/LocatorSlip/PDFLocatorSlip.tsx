import React, { useRef } from "react";
import deped from "@/Assets/images/DepEd.png";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { LOCATORSLIPTYPE } from "./LocatorSlip";
import { Square, SquareCheck } from "lucide-react";
import { User } from "@/Types";

const PDFLocatorSlip = React.forwardRef<
    HTMLDivElement,
    { locatorslip: LOCATORSLIPTYPE & {
        principal: User
    } }
>(({ locatorslip }, ref) => {
    return (
        <div ref={ref} className="w-[790px] shrink-0 print:mx-auto print:px-7 scale-95">
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
                            margin-top: 1.95rem;
                            margin-bottom: 0.88rem;
                            page-break-inside: avoid; /* Avoid breaking inside this element */
                            break-inside: avoid; /* Modern alternative to page-break-inside */
                        }
                    }
                `}
            </style>
            <table className="table border-none">
                <tbody className="[&>tr]:border-none">
                    <tr>
                        <td className="p-0">
                            <img
                                src={deped}
                                className="w-24 shrink-0 mx-auto"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="text-xs text-center">
                                Republic of the Philippines
                            </div>
                            <div className="text-center font-semibold">
                                Department of Education
                            </div>
                            <div className="text-center">REGION XI</div>
                            <div className="text-center">PANABO CITY</div>
                        </td>
                    </tr>

                    <tr className="mt-0">
                        <td className="py-2">
                            <div className="text-center font-semibold">
                                SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                            </div>
                            <div className="text-center">
                                Southern Davao, Panabo City
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="table border border-black mt-3">
                <tbody className="[&>tr]:border-none [&>tr>td]:px-0">
                    <tr>
                        <td
                            className="text-2xl font-semibold underline text-center pt-0"
                            colSpan={2}
                        >
                            LOCATOR SLIP
                        </td>
                    </tr>
                    <tr className="">
                        <td className="font-semibold underline pt-1.5 pb-2 w-[12.5rem]">
                            Region :
                        </td>
                        <td className="font-semibold underline pt-1.5 pb-2">XI</td>
                    </tr>
                    <tr>
                        <td className="py-0 w-[12.5rem]">
                            Bureau/Division/School:
                        </td>
                        <td className="py-0">
                            Southern Davao National High School
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="table border-black">
                <tbody className="[&>tr]:border-black [&>tr>td:first-child]:border-l [&>tr>td]:border-r [&>*>*]:border-black">
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase p-0 pl-2 font-semibold">
                            Date of Filing
                        </td>
                        <td className="p-0 pl-1">
                            {format(locatorslip.dateoffiling, "MMM d, y")}
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase p-0 pl-2 font-semibold">
                            Name
                        </td>
                        <td className="uppercase p-0 pl-1">
                            {locatorslip.user?.full_name}
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase p-0 pl-2 font-semibold">
                            Permanent Station
                        </td>
                        <td className="py-0.5 pl-1">
                            Southern Davao National High School
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase py-2 pl-2 font-semibold">
                            Position/Designation
                        </td>
                        <td className="uppercase p-0 pl-1">
                            {locatorslip.user?.position}
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase py-2 pl-2 font-semibold">
                            Purpose of Travel
                        </td>
                        <td className="p-0 pl-1">
                            {locatorslip.purposeoftravel}
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase py-2 pl-2 font-semibold">
                            Please Check
                        </td>
                        <td className="p-0 pl-1">
                            <div className="grid grid-cols-2">
                                <div className="flex items-center gap-2 justify-center">
                                    {locatorslip.type === "business" ? (
                                        <SquareCheck className="stroke-1" />
                                    ) : (
                                        <Square className="stroke-1" />
                                    )}
                                    <span>Official Business</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center">
                                    {locatorslip.type === "time" ? (
                                        <SquareCheck className="stroke-1" />
                                    ) : (
                                        <Square className="stroke-1" />
                                    )}
                                    <span>Official Time</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase py-2 pl-2 font-semibold">
                            Destination
                        </td>
                        <td className="p-0 pl-1">
                            {locatorslip.destination}
                        </td>
                    </tr>
                    <tr>
                        <td className="w-[12.5rem] shrink-0 uppercase p-0 pl-2 font-semibold">
                            Date and time or event/ Transaction/Meeting
                        </td>
                        <td className="p-0 pl-1">
                            {format(locatorslip.agenda.date, "MMM d, y")}
                            {locatorslip.agenda.time && " / "}
                            {locatorslip.agenda.time && format(locatorslip.agenda.date+' '+locatorslip.agenda.time, 'h:m')}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="table border-black border">
                <tbody className="">
                    <tr className="divide-x border-black divide-black grid grid-cols-2">
                        <td className="p-0">
                            <div className="font-semibold pl-2">
                                Requested by:
                            </div>
                            <div className="px-5">
                                <div className="h-11 border-b border-black flex items-end justify-center">
                                    <div className="font-semibold uppercase">
                                        {locatorslip.user.full_name}
                                    </div>
                                </div>
                                <div className="text-center text-[10pt]">
                                {locatorslip.user.position}
                                </div>
                            </div>
                            <div className="pt-4 pb-5 pl-4">
                                <div className="border-b border-black w-fit text-[10pt]">
                                    Date:{" "}
                                    {format(
                                        locatorslip.dateoffiling,
                                        "MMMM d, y"
                                    )}
                                </div>
                            </div>
                        </td>
                        <td className="p-0">
                            <div className="font-semibold pl-2">
                                Approved by:
                            </div>
                            <div className="px-5">
                                <div className="h-11 border-b border-black w-fit mx-auto flex items-end justify-center">
                                    <div className="font-semibold uppercase">
                                        {locatorslip.principal.full_name}
                                    </div>
                                </div>
                                <div className="text-center text-[10pt]">
                                    {locatorslip.principal.position}
                                </div>
                            </div>
                            <div className="pt-4 pb-5 pl-4">
                                <div className="border-b border-black w-fit text-[10pt]">
                                    Date: {locatorslip.approved_at ? locatorslip.status === 'disapproved' ? '' : format(locatorslip.approved_at, "MMMM d, y") : 'Pending'}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="p-0">
                            <div>
                                <div className="uppercase border-b border-black w-fit text-2xl mx-auto font-semibold mt-7">
                                    Certification
                                </div>
                                <div className="mt-8 pl-5">
                                    This is to certify that the above employee
                                    appeared in this Office for the above
                                    purpose.
                                </div>

                                <div className="grid grid-cols-3 mt-12">
                                    <div className="pl-5 text-center">
                                        <div className="border-b border-black"></div>
                                        <div>Signature over Printed Name</div>
                                    </div>
                                    <div className="pr-0 pl-11 text-center">
                                        <div className="border-b border-black"></div>
                                        <div>Position</div>
                                    </div>
                                    <div className="pl-12 text-center">
                                        <div className="border-b border-black"></div>
                                        <div>Date</div>
                                    </div>
                                </div>

                                <div className="mt-8 pl-5">
                                    (Note: This portion shall be filled out by
                                    the Official/Authorize personnel of the
                                    Office visited.)
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

export default PDFLocatorSlip;
