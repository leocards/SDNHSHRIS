import { cn } from "@/Lib/utils";
import { formatDateRange } from "@/Types/types";
import { format } from "date-fns";
import { Square, SquareCheck } from "lucide-react";
import React from "react";
import { APPLICATIONFORLEAVETYPES } from "./type";
import { LEAVETYPEKEYSARRAY, LEAVETYPESOBJ } from "../Types/leavetypes";
import { User } from "@/Types";

type Props = {
    isDownload?: boolean;
    leave: APPLICATIONFORLEAVETYPES
    applicant: {full_name: string} & Pick<User, "role">
};

const LeavePDFDetailsOfApplication = (
    props: Props
) => {
    const {
        isDownload,
        leave: { type, details, detailsinput, from, to, others, commutation, daysapplied },
        applicant
    } = props;


    return (
        <>
            <div
                className={cn(
                    "border-y text-center font-bold uppercase p-[1pt]", isDownload ? "border-black" : "dark:border-border border-black"
                )}
            >
                <div className={cn(isDownload && "-mt-3 py-1.5")}>
                    6. Details of Application
                </div>
            </div>
            <div className={cn("grid grid-cols-[1.25fr,1fr] divide-x h-[18rem] [&>div]:p-[1pt]", isDownload ? "divide-black" : "dark:divide-border divide-black")}>
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        6.A Types of Leave to be availed of:{" "}
                    </div>
                    <div className={cn("pl-2 ", !isDownload ? "pt-1" : "pt-2")}>
                        {LEAVETYPEKEYSARRAY.filter((t) => t !== 'others').map((leavetype, index) => (
                            <div
                                className="flex gap-1"
                                style={{ alignItems: "center" }}
                                key={index}
                            >
                                <div className="">
                                    {leavetype === type ? (
                                        <SquareCheck className="size-4" />
                                    ) : (
                                        <Square className="size-4" />
                                    )}
                                </div>
                                <div className={cn(isDownload && "-mt-3")}>
                                    {LEAVETYPESOBJ[leavetype]}
                                </div>
                            </div>
                        ))}
                        <div className="mt-3">Others:</div>
                        <div
                            className={cn(
                                "h-4 w-[70%]",
                                others
                                    ? "underline"
                                    : ("border-b " + (isDownload ? "border-black" : "dark:border-border border-black"))
                            )}
                        >
                            {others}
                        </div>
                    </div>
                </div>
                <div>
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        6.B Details of Leave:{" "}
                    </div>
                    <div className="pl-2 pt-0.5">
                        <div className="">
                            <div className="text-[10px] italic ml-2">
                                In case of Vacation/Special Privilege Leave:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {details === 'vphilippines' ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Within the Philippines
                                    <span className="underline pl-1 font-medium">
                                        {details === 'vphilippines' && detailsinput}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {details === "vabroad" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Abroad (Specify)
                                    <span className="underline pl-1 font-medium">
                                        {details === 'vabroad' && detailsinput}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5">
                            <div className="text-[10px] italic ml-2">
                                In case of Sick Leave:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {details === "shospital" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    In Hospital (Specify Illness)
                                    <span className="underline pl-1 font-medium">
                                        {details === "shospital" && detailsinput}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {details === "spatient" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Out Patient (Specify Illness)
                                    <span className="underline pl-1 font-medium">
                                        {details === "spatient" && detailsinput}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5">
                            <div className="text-[10px] italic ml-2">
                                In case of Special Leave Benefits for Women:
                            </div>
                            <div className="flex">
                                <div>(Specify illness)</div>
                                <span className="underline pl-1 font-medium">
                                    {type === "slbw" && detailsinput}
                                </span>
                            </div>
                        </div>
                        <div className="mt-1.5">
                            <div className="text-[10px] italic ml-2">
                                In case of study leave:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {details === "degree" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Completion of Master's Degree
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {details === "examreview" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    BAR/Board Examination Review
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5">
                            <div className="text-[10px] italic ml-2">
                                Other puspose:
                            </div>
                            <div
                                className={cn(
                                    "flex gap-1 relative",
                                    isDownload && "mt-2"
                                )}
                            >
                                {details === "monitization" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Monetization of Leave Credits
                                </div>
                            </div>
                            <div className="flex gap-1 relative">
                                {details === "terminal" ? (
                                    <SquareCheck className="size-4" />
                                ) : (
                                    <Square className="size-4" />
                                )}
                                <div className={cn(isDownload && "-mt-1.5")}>
                                    Terminal Leave
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn(
                "border-t border-black grid grid-cols-[1.25fr,1fr] divide-x divide-black h-[6.5rem] [&>div]:p-[1pt]",
                isDownload ? "border-black divide-black" : "dark:border-border dark:divide-border border-black divide-black"
            )}>
                <div className="uppercase">
                    <div className={cn("uppercase", isDownload && "-mt-1.5")}>
                        6.C Number of working days applied for
                    </div>
                    <div
                        className={cn(
                            "border-b w-[60%] ml-4 text-center",
                            isDownload ? "border-black" : "dark:border-border border-black"
                        )}
                    >
                        <div className={cn(isDownload && "mb-1.5 mt-1")}>
                            {daysapplied}{" "}
                            {daysapplied && " day/s"}
                        </div>
                    </div>
                    <div className="uppercase ml-4 mt-3"> Inclusive dates</div>
                    <div
                        className={cn(
                            "border-b w-[60%] ml-4 text-center",
                            isDownload ? "border-black" : "dark:border-border border-black"
                        )}
                    >
                        <div className={cn(isDownload && "mb-1.5 mt-1")}>
                            {formatDateRange({
                                from: from,
                                to: to,
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div
                        className={cn(
                            "uppercase",
                            isDownload && "-mt-1.5 mb-2"
                        )}
                    >
                        6.D Commutation
                    </div>
                    <div className="pl-2">
                        <div className="flex gap-1 relative">
                            {commutation === "not" ? (
                                <SquareCheck className="size-4" />
                            ) : (
                                <Square className="size-4" />
                            )}
                            <div className={cn(isDownload && "-mt-1.5")}>
                                Not requested
                            </div>
                        </div>
                        <div className="flex gap-1 relative">
                            {commutation === "requested" ? (
                                <SquareCheck className="size-4" />
                            ) : (
                                <Square className="size-4" />
                            )}
                            <div className={cn(isDownload && "-mt-1.5")}>
                                Requested
                            </div>
                        </div>
                    </div>
                    <div className="w-[80%] mx-auto mt-auto mb-1">
                        <div
                            className={cn(
                                "h-4 text-center font-bold uppercase"
                            )}
                        >
                            <div className={cn(isDownload && "-mt-3")}>{applicant.full_name}</div>
                        </div>
                        <div
                            className={cn(
                                "border-t text-center",
                                isDownload ? "border-black" : "dark:border-border border-black",
                                isDownload ? "mt-2" : "pt-0.5"
                            )}
                        >
                            <div className={cn(isDownload && "-mt-1 mb-2")}>
                                (Signature of Applicant)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeavePDFDetailsOfApplication;
