import React, { useMemo } from "react";
import { cn } from "@/Lib/utils";
import { checkDateFormat } from "@/Types/types";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { SubHeader, TextCenter } from "./Header";
import { WORKEXPERIENCESINGLE } from "../../Types/WorkExperience";

type wetype = Omit<WORKEXPERIENCESINGLE, "id"|"user_id"|"isgovernment"> & {
    isgovernment: "y" | "n" | string;
}

export type WorkExperienceType = wetype[]

type Props = {
    workexperience: WorkExperienceType;
};

const defaultValue: wetype = {
    inlcusivedates: {
        from: "",
        to: "",
    },
    positiontitle: "",
    department: "",
    monthlysalary: "",
    salarygrade: "",
    statusofappointment: "",
    isgovernment: "",
};

const WorkExperience: React.FC<Props> = ({ workexperience }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const we = useMemo(() => {
        let we = Array.isArray(workexperience) ? workexperience : [];
        if (we) {
            if (workexperience.length <= 28) {
                return we.concat(
                    ...Array.from({ length: 28 - we.length }).map(
                        () => defaultValue
                    )
                );
            } else {
                return we.slice(0, 27);
            }
        } else return Array.from({ length: 28 }).map(() => defaultValue);
    }, [workexperience]);

    return (
        <div>
            <SubHeader
                title="V. WORK EXPERIENCE"
                subtitle={
                    <div className="text-[8.5pt]">
                        <div>
                            (Include private employment. Start from your recent
                            work) Description of duties should be indicated in
                            the attached Work Experience sheet.
                        </div>
                    </div>
                }
                customHeight="h-[39px]"
            />

            <div className="grid grid-cols-[8rem,13rem,15rem,4rem,4rem,6.3rem,3.85rem] h-[55px] bg-[#eaeaea] divide-x-2 divide-black text-[7pt] text-center">
                <div className="flex flex-col divide-y-2 divide-black">
                    <div className="flex grow">
                        <div className={cn("pt-1", checkIfDownLoad("-mt-1.5"))}>
                            28.
                        </div>
                        <TextCenter className="text-center grow">
                            <div className={cn(checkIfDownLoad("-mt-3.5"))}>
                                INCLUSIVE DATES <br /> (mm/dd/yyyy)
                            </div>
                        </TextCenter>
                    </div>
                    <div className="grid grid-cols-2 divide-x-2 divide-black h-[14px]">
                        <div>
                            <TextCenter
                                className={cn(checkIfDownLoad("-mt-1.5"))}
                            >
                                From
                            </TextCenter>
                        </div>
                        <div>
                            <TextCenter
                                className={cn(checkIfDownLoad("-mt-1.5"))}
                            >
                                To
                            </TextCenter>
                        </div>
                    </div>
                </div>
                <TextCenter>
                    <div className={cn(checkIfDownLoad("-mt-2.5"))}>
                        POSITION TITLE <br />
                        (Write in full/Do not abbreviate)
                    </div>
                </TextCenter>
                <TextCenter>
                    <div className={cn(checkIfDownLoad("-mt-2.5"))}>
                        DEPARTMENT / AGENCY / OFFICE / COMPANY <br />
                        (Write in full/Do not abbreviate)
                    </div>
                </TextCenter>
                <TextCenter>
                    <div className={cn(checkIfDownLoad("-mt-2.5"))}>
                        MONTHLY SALARY
                    </div>
                </TextCenter>
                <TextCenter>
                    <div
                        className={cn("text-[4.8pt]", checkIfDownLoad("-mt-2"))}
                    >
                        SALARY/ JOB/ PAY <br />
                        GRADE (if <br />
                        applicable)& STEP <br />
                        (Format "00-0")/ <br />
                        INCREMENT
                    </div>
                </TextCenter>
                <TextCenter>
                    <div className={cn("px-1", checkIfDownLoad("-mt-2.5"))}>
                        STATUS OF APPOINTMENT
                    </div>
                </TextCenter>
                <TextCenter className="">
                    <div className={cn(checkIfDownLoad("-mt-2.5"))}>
                        GOV'T <br />
                        SERVICE <br />
                        (Y/ N)
                    </div>
                </TextCenter>
            </div>

            <div className="divide-y-2 divide-black border-t-2 border-black text-[9pt]">
                {we.map((data, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[8rem,13rem,15rem,4rem,4rem,6.3rem,3.85rem] divide-x-2 divide-black h-[27px]"
                    >
                        <div className="grid grid-cols-2 divide-x-2 divide-black">
                            <TextCenter>
                                <div
                                    className={cn(
                                        "font-bold",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    {checkDateFormat(data.inlcusivedates.from)}
                                </div>
                            </TextCenter>
                            <TextCenter>
                                <div
                                    className={cn(
                                        "font-bold",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    {checkDateFormat(data.inlcusivedates.to)}
                                </div>
                            </TextCenter>
                        </div>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >
                                {data.positiontitle}
                            </div>
                        </TextCenter>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >
                                {data.department}
                            </div>
                        </TextCenter>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >
                                {data.monthlysalary}
                            </div>
                        </TextCenter>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >
                                {data.salarygrade}
                            </div>
                        </TextCenter>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >
                                {data.statusofappointment}
                            </div>
                        </TextCenter>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >
                                {!data.isgovernment
                                    ? data.isgovernment !== ""
                                        ? "n"
                                        : ""
                                    : "y"}
                            </div>
                        </TextCenter>
                    </div>
                ))}
            </div>

            <div className="bg-[#eaeaea] text-red-500 text-center italic text-[7pt] leading-3 border-y-[3px] border-black h-[15.2px]">
                <div
                    className={cn(
                        checkIfDownLoad("-mt-1.5", "-mt-px font-bold")
                    )}
                >
                    (Continue on separate sheet if necessary)
                </div>
            </div>
        </div>
    );
};

export default WorkExperience;
