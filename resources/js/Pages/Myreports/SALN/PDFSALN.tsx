import { forwardRef } from "react";
import Deped from "@/Assets/images/DepEd.png";
import SDNHSLogo from "@/Assets/images/sdnhs-logo.png";
import { cn } from "@/Lib/utils";
import { toNumber } from "./type";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";
import { User } from "@/Types";
import { SALNREPORTTYPE } from "./SALN";
import { prependIfNotEmpty } from "@/Types/types";

function groupItems(items: Array<SALNREPORTTYPE>) {
    const firstGroupSize = 28;
    const subsequentGroupSize = 36;

    // Add unique id to each item
    const itemsWithIds = items.map((item, index) => ({
        ...item,
        counter: index + 1, // Add id starting from 1
    }));

    // Step 1: Extract the first group (28 items)
    const firstGroup = itemsWithIds.slice(0, firstGroupSize);

    // Step 2: Extract the remaining items and group them in chunks of 36
    const remainingItems = itemsWithIds.slice(firstGroupSize);

    const groups = [firstGroup]; // Start with the first group

    for (let i = 0; i < remainingItems.length; i += subsequentGroupSize) {
        const chunk = remainingItems.slice(i, i + subsequentGroupSize);
        groups.push(chunk);
    }

    return groups;
}

type Props = {
    saln: Array<SALNREPORTTYPE>;
    principal?: User;
    year: string
}

const PDFSALN = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const hr = usePage().props.auth.user
    let saln = groupItems([...props.saln]);

    const fitTextContent = (text: string) => {
        if(text) {
            if (text.length > 57) return "text-xs";
            else if (text.length > 89) return "text-[10px]";
            else if (text.length > 124) return "text-[8.5px]";
        }

        return "";
    };

    const getSALNLength = (): string => {
        if(saln.length === 1 && saln[0].length > 16) {
            return "break-before-page print:pt-12"
        }

        if(saln.length > 1 && saln[saln.length - 1].length > 24)
            return "break-before-page print:pt-12"

        return ""
    };

    return (
        <div
            ref={ref}
            className="scale-[.90] font-calibri shrink-0 w-[35.56cm]"
        >
            <div className="flex font-calibri [&>div]:grow w-full print:mt-5">
                <div>
                    <img src={Deped} className="w-20 shrink-0 ml-auto" />
                </div>
                <div className="space-y-px text-center max-w-96">
                    <div className="font-bold">
                        SOUTHERN DAVAO NATIONAL HIGH SCHOOL
                    </div>
                    <div className="leading-4">SUMMARY REFORM FORM 1-A</div>
                    <div className="leading-4">
                        Statement of Assets, Liabilities and Network
                    </div>
                    <div className="leading-4">Calendar Year {props.year}</div>
                </div>
                <div>
                    <img src={SDNHSLogo} className="w-20 shrink-0" />
                </div>
            </div>
            <div className="font-calibri [&>div]:grid [&>div]:grid-cols-[12rem,1fr] mt-2 [&>div>div]:leading-4 mb-0.5">
                <div>
                    <div>Region:</div>
                    <div>REGION XI</div>
                </div>
                <div>
                    <div>Name of Agency/School:</div>
                    <div>
                        DepEd Panabo Division/Southern Davao National High
                        School
                    </div>
                </div>
                <div>
                    <div>Office Address:</div>
                    <div>Purok 4 Southern Davao, Panabo City</div>
                </div>
            </div>

            {saln.map((item, index) => {
                if (index === 0) {
                    return (
                        <div
                            key={index}
                            className="border border-black divide-y divide-black"
                        >
                            <div className="grid grid-cols-[2.5rem,1fr,7rem,7rem,7rem,24rem,4.8rem] divide-x divide-black [&>div]:leading-4">
                                <div></div>
                                <div className="divide-y divide-black">
                                    <div className="text-start leading-4 h-9">
                                        <div className="text-center">
                                            NAME OF EMPLOYEE
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[1fr,1.5rem,1fr,6rem] divide-x divide-black [&>div]:pl-px [&>div]:leading-4">
                                        <div>Last Name</div>
                                        <div></div>
                                        <div>First Name</div>
                                        <div>Middle Name</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div>TIN</div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div>POSITION</div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div>NET WORTH</div>
                                </div>
                                <div className="flex items-center justify-center text-center">
                                    <div>
                                        if spouse is with government service,{" "}
                                        <br /> Please Indicate <br /> Name of
                                        Spouse/Employer/Address
                                    </div>
                                </div>
                                <div className="flex items-center justify-center text-center">
                                    <div>Please check (/) if Joint filing</div>
                                </div>
                            </div>

                            {item.map((s, indx) => (
                                <div
                                    key={indx}
                                    className={cn(
                                        "grid grid-cols-[2.5rem,1fr,7rem,7rem,7rem,24rem,4.8rem] h-fit [&>div]:leading-5 divide-x divide-black"
                                    )}
                                >
                                    <div>{s.counter}</div>
                                    <div className="grid grid-cols-[1fr,1.5rem,1fr,6rem] divide-x divide-black [&>div]:pl-px">
                                        <div>{s.user.lastname}</div>
                                        <div className="text-center">,</div>
                                        <div>{s.user.firstname}</div>
                                        <div>
                                            {s.user.middlename?.charAt(0)}
                                            {s.user.middlename ? "." : ""}
                                        </div>
                                    </div>
                                    <div className="text-center">{s.user.pds_personal_information?.tin}</div>
                                    <div className="text-center">{s.user.position}</div>
                                    <div className="text-center">&#8369; {Number(toNumber(s.details.networth)).toLocaleString()}</div>
                                    <div
                                        className={fitTextContent(
                                            s.details.spouse
                                        )}
                                    >
                                        {s.details.spouse}
                                    </div>
                                    <div className="text-center">{s.details.joint?"/":""}</div>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={index}
                            className={cn("border border-black divide-y divide-black break-before-page print:mt-5 print: border-t bor der-t-0", "mt-10")}
                        >
                            {item.map((s, indx) => (
                                <div
                                    key={indx}
                                    className={cn(
                                        "grid grid-cols-[2.5rem,1fr,7rem,7rem,7rem,24rem,4.8rem] h-fit [&>div]:leading-5 divide-x divide-black"
                                    )}
                                >
                                    <div>{s.counter}</div>
                                    <div className="grid grid-cols-[1fr,1.5rem,1fr,6rem] divide-x divide-black [&>div]:pl-px">
                                        <div>{s.user.lastname}</div>
                                        <div className="text-center">,</div>
                                        <div>{s.user.firstname}</div>
                                        <div>
                                            {s.user.middlename?.charAt(0)}
                                            {s.user.middlename ? "." : ""}
                                        </div>
                                    </div>
                                    <div className="text-center">{s.user.pds_personal_information?.tin}</div>
                                    <div className="text-center">{s.user.position}</div>
                                    <div className="text-center">{s.details.networth}</div>
                                    <div
                                        className={fitTextContent(
                                            s.details.spouse
                                        )}
                                    >
                                        {s.details.spouse}
                                    </div>
                                    <div className="text-center">{s.details.joint && s.details.joint == 1?"/":""}</div>
                                </div>
                            ))}
                        </div>
                    );
                }
            })}

            <div className="">
                <div>
                    <div className="grid grid-cols-[18rem,4rem]">
                        <div>Total Number of Filers:</div>
                        <div className="border-b border-black text-center">{props.saln.length}</div>
                    </div>
                    <div className="grid grid-cols-[18rem,4rem]">
                        <div>Total Number of Personnel Complete adffa:</div>
                        <div className="border-b border-black text-center">{props.saln.length}</div>
                    </div>
                </div>

                <div className={cn("grid grid-cols-2 mt-7", getSALNLength())}>
                    <div>
                        <div>Prepared by:</div>

                        <div className="mt-4">
                            <div className="font-bold uppercase">
                                {hr?.name}
                            </div>
                            <div className="leading-4">School HR</div>
                        </div>

                        <div className="mt-5 leading-5">
                            <div className="grid grid-cols-[12rem,20rem]">
                                <div>Position: </div>
                                <div className="border-b border-black pl-1">{hr?.position}</div>
                            </div>
                            <div className="grid grid-cols-[12rem,20rem]">
                                <div>Email Address: </div>
                                <div className="border-b border-black pl-1">{hr?.email}</div>
                            </div>
                            <div className="grid grid-cols-[12rem,20rem]">
                                <div>Contact No.: </div>
                                <div className="border-b border-black pl-1">{hr?.mobilenumber}</div>
                            </div>
                            <div className="grid grid-cols-[12rem,20rem]">
                                <div>Date: </div>
                                <div className="border-b border-black pl-1">{format(new Date(), 'MMMM d, y')}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>Noted by:</div>

                        <div className="mt-4">
                            <div className="font-bold uppercase">
                                {props.principal?.name||"No principal added"}
                            </div>
                            <div className="leading-4">
                                {props.principal?.position||"No principal added"}
                            </div>
                        </div>

                        <div className="mt-5 leading-5">
                            <div className="grid grid-cols-[12rem,1fr]">
                                <div>Position: </div>
                                <div className="border-b border-black pl-1">{props.principal?.position||"No principal added"}</div>
                            </div>
                            <div className="grid grid-cols-[12rem,1fr]">
                                <div>Email Address: </div>
                                <div className="border-b border-black pl-1">{props.principal?.email||"No principal added"}</div>
                            </div>
                            <div className="grid grid-cols-[12rem,1fr]">
                                <div>Contact No.: </div>
                                <div className="border-b border-black pl-1">{prependIfNotEmpty(props.principal?.mobilenumber, '0')||"No principal added"}</div>
                            </div>
                            <div className="grid grid-cols-[12rem,1fr]">
                                <div>Date: </div>
                                <div className="border-b border-black pl-1">{format(new Date(), 'MMMM d, y')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PDFSALN;
