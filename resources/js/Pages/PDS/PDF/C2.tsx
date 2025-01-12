import React from "react";
import CivilServiceEligibility, { CivilServiceEligibilityType } from "./Partials/CivilService";
import WorkExperience, { WorkExperienceType } from "./Partials/WorkExperience";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { cn } from "@/Lib/utils";

const C2 = (props: {
    civilservice: CivilServiceEligibilityType;
    workexperience: WorkExperienceType;
}) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div>
            <CivilServiceEligibility civilservice={props.civilservice} />

            <WorkExperience workexperience={props.workexperience} />

            <div className="flex w-full">
                <div className="flex grow">
                    <div className="bg-[#eaeaea] h-[32px] font-bold italic text-[9pt] flex items-center justify-center w-[8.1rem] border-r-[3px] border-black py-1.5">
                        <div className={cn(checkIfDownLoad("-mt-3"))}>
                            SIGNATURE
                        </div>
                    </div>
                    <div className="grow"></div>
                </div>
                <div className="flex">
                    <div className="bg-[#eaeaea] h-[32px] font-bold italic text-[9pt] flex items-center justify-center w-[7.1rem] border-x-[3px] border-black py-1.5">
                        <div className={cn(checkIfDownLoad("-mt-3"))}>DATE</div>
                    </div>
                    <div className="grow w-[12.6rem]"></div>
                </div>
            </div>
        </div>
    );
};

export default C2;
