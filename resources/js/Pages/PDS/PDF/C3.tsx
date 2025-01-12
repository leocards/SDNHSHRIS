import VoluntaryWork, { VoluntaryWorkType } from "./Partials/VoluntaryWork";
import LearningAndDevelopment, { LearningDevelopmentType } from "./Partials/LearningAndDevelopment";
import OtherInformation, { OtherInformationType } from "./Partials/OtherInformation";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { cn } from "@/Lib/utils";
import { VOLUNTARYWORKTYPESINGLE } from "../Types/VoluntaryWork";

const C3 = (props: {
    voluntarywork: Array<VoluntaryWorkType>;
    learningdevelopment: LearningDevelopmentType;
    otherinformation: OtherInformationType;
}) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div>
            <VoluntaryWork voluntarywork={props.voluntarywork} />

            <LearningAndDevelopment learningdevelopment={props.learningdevelopment} />

            <OtherInformation otherinformation={props.otherinformation} />

            <div className="flex w-full">
                <div className="flex grow">
                    <div className="bg-[#eaeaea] h-[32px] font-bold italic text-[9pt] flex items-center justify-center w-[14.1rem] border-r-[3px] border-black py-1.5">
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
                    <div className="grow w-[13.85rem]"></div>
                </div>
            </div>
        </div>
    );
};

export default C3;
