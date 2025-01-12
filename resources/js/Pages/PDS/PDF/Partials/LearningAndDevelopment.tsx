import { TextCenter, SubHeader } from "./Header";
import { cn } from "@/Lib/utils";
import { useMemo } from "react";
import { checkDateFormat } from "@/Types/types";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { LEARNINGANDEVELOPMENTTYPE, LEARNINGANDEVELOPMENTTYPESINGLE } from "../../Types/LearningAndDevelopment";

export type LearningDevelopmentType = Omit<LEARNINGANDEVELOPMENTTYPESINGLE, "id"|"user_id">[]

type Props = {
    learningdevelopment: LearningDevelopmentType
}

const defaultValue: Omit<LEARNINGANDEVELOPMENTTYPESINGLE, "id"|"user_id"> = {
    title: "",
    inclusivedates: {
        from: '',
        to: '',
    },
    numofhours: '',
    type: '',
    conductedby: '',
}

const LearningAndDevelopment: React.FC<Props> = ({ learningdevelopment }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const ld = useMemo(() => {
        let ld = learningdevelopment

        if(ld) {
            if(ld.length < 23) {
                return ld.concat(Array.from({ length: (23 - ld.length)}).map(() => defaultValue))
            } else {
                return ld.slice(0, 23)
            }

        } else return Array.from({ length: 23 }).map(() => defaultValue)

    }, [learningdevelopment])

    return (
        <div>
            <SubHeader title="VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS ATTENDED" />

            <div className="bg-[#eaeaea] h-[55px] grid grid-cols-[24rem,7rem,4rem,3.6rem,14rem] divide-x-2 divide-black text-[7pt]">
                <div className="flex p-0.5 pt-3">
                    <div className="pl-1">
                        <div className={cn(checkIfDownLoad('-mt-1.5'))}>30.</div>
                    </div>
                    <TextCenter className="text-center h-fit w-full">
                        <div className={cn(checkIfDownLoad('-mt-1.5'))}>
                           TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS <br /> (Write in full)
                        </div>
                    </TextCenter>
                </div>
                <div className="flex flex-col">
                    <div className="grow text-center text-[6pt]">
                        <div className={cn(checkIfDownLoad('-mt-1.5'))}>
                            INCLUSIVE DATES OF <br />
                            ATTENDANCE <br />
                            (mm/dd/yyyy)
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x-2 divide-black border-t-2 border-black h-[15.6px] text-center">
                        <div>
                            <div className={cn(checkIfDownLoad('-mt-1.5'))}>From</div>
                        </div>
                        <div>
                            <div className={cn(checkIfDownLoad('-mt-1.5'))}>To</div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <TextCenter className="text-center grow">
                        <div className={cn("text-[5.4pt]", checkIfDownLoad('-mt-1.5'))}>NUMBER OF HOURS</div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="text-center grow">
                        <div className={cn("text-[5.4pt]", checkIfDownLoad('-mt-3'))}>
                            Type of LD <br />
                            ( Managerial/ <br />
                            Supervisory/ <br />
                            Technical/etc) <br />
                        </div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="grow text-center">
                        <div className={cn(checkIfDownLoad('-mt-1.5'))}>CONDUCTED/ SPONSORED BY <br /> (Write in full)</div>
                    </TextCenter>
                </div>
            </div>

            <div className="divide-y-2 divide-black border-t-2 border-black">
                {ld.map((data, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[24rem,7rem,4rem,3.6rem,14rem] divide-x-2 divide-black text-[7pt] h-[26px]"
                    >
                        <TextCenter>
                            <div className={cn('font-bold leading-3 text-center', checkIfDownLoad('-mt-3'))}>{data.title}</div>
                        </TextCenter>
                        <div className="grid grid-cols-2 divide-x-2 divide-black">
                            <TextCenter>
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{checkDateFormat(data.inclusivedates.from)}</div>
                            </TextCenter>
                            <TextCenter>
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{checkDateFormat(data.inclusivedates.to)}</div>
                            </TextCenter>
                        </div>
                        <TextCenter>
                            <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{data.numofhours}</div>
                        </TextCenter>
                        <TextCenter>
                            <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{data.type}</div>
                        </TextCenter>
                        <TextCenter>
                            <div className={cn('font-bold leading-3 text-center', checkIfDownLoad('-mt-3'))}>{data.conductedby}</div>
                        </TextCenter>
                    </div>
                ))}
            </div>

            <div className="bg-[#eaeaea] text-red-500 text-center italic text-[7pt] leading-3 border-y-[3px] border-black h-[15.2px]">
                <div
                    className={cn(
                        checkIfDownLoad("-mt-2", "-mt-px font-bold")
                    )}
                >
                    (Continue on separate sheet if necessary)
                </div>
            </div>
        </div>
    );
};

export default LearningAndDevelopment;
