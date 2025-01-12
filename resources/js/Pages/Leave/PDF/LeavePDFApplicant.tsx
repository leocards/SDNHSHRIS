import { cn } from "@/Lib/utils";
import { User } from "@/Types";
import { format } from "date-fns";
import { APPLICATIONFORLEAVETYPES } from "./type";
import { formatDateRange } from "@/Types/types";

const LeavePDFApplicant = ({
    leave,
    isDownload
}: {
    isDownload?: boolean;
    leave: APPLICATIONFORLEAVETYPES;
}) => {
    const { firstname, lastname, middlename, position, department, salary, filingfrom, filingto } = leave
    return (
        <>
            <div className="grid grid-cols-[15rem,auto] uppercase p-[1pt] pb-1.5">
                <div className="">
                    <div className={cn(isDownload && "print:mt-auto -mt-1.5")}>
                        1. Office/department
                    </div>
                    <div className="mt-0.5 pl-3">{department??"N/A"}</div>
                </div>
                <div className="flex flex-col">
                    <div className="grid grid-cols-[3.5rem,1fr]">
                        <div className={cn(isDownload && "-mt-1.5")}>
                            2. Name:
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="text-center space-y-0.5">
                                <div
                                    className={cn(
                                        "capitalize text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                    (Last)
                                </div>
                                <div className={cn(lastname?.length >= 19 && "text-[9px]")}>{lastname},</div>
                            </div>
                            <div className="text-center space-y-0.5">
                                <div
                                    className={cn(
                                        "capitalize text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                    (First)
                                </div>
                                <div className={cn(firstname?.length >= 19 && "text-[9px]")}>{firstname}</div>
                            </div>
                            <div className="text-center space-y-0.5">
                                <div
                                    className={cn(
                                        "capitalize text-center",
                                        isDownload && "-mt-1.5"
                                    )}
                                >
                                    (Middle)
                                </div>
                                <div className={cn(middlename ? middlename.length >= 19 && "text-[9px]" : "")}>{middlename}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn("border-t uppercase h-9 grid grid-cols-3 p-[1pt] pb-2", isDownload ? "border-black" : "dark:border-border border-black")}>
                <div className="">
                    <div className={cn(isDownload && "-mt-1.5")}>
                        3. Date of filing
                    </div>
                    <div className="pl-3">{formatDateRange({ from: filingfrom, to: filingto })}</div>
                </div>
                <div className="">
                    <div className={cn(isDownload && "-mt-1.5")}>
                        4. Position
                    </div>
                    <div className="pl-3">{position}</div>
                </div>
                <div className="">
                    <div className={cn(isDownload && "-mt-1.5")}>5. Salary</div>
                    <div className="pl-3">&#8369; {Number((salary?.replace(',', ''))?.replace('.','')).toLocaleString()}</div>
                </div>
            </div>
        </>
    );
};

export default LeavePDFApplicant;
