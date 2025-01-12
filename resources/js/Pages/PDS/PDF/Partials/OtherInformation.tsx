import React, { useMemo } from "react";
import { SubHeader, TextCenter } from "./Header";
import { cn } from "@/Lib/utils";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";

export type OtherInformationType = Array<{skills: string; recognition: string; association: string;}>

type Props = {
    otherinformation: OtherInformationType;
}

const OtherInformation: React.FC<Props> = ({ otherinformation }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div>
            <SubHeader title="VIII. OTHER INFORMATION" />

            <div className="bg-[#eaeaea] h-[35px] grid grid-cols-[14rem,1fr,14rem] divide-x-2 divide-black text-[7pt]">
                <div className="flex">
                    <TextCenter className="px-2 grow">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>31.</div>
                        <div className="grow text-center">
                            <div className={cn(checkIfDownLoad('-mt-3'))}>SPECIAL SKILLS and HOBBIES</div>
                        </div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="px-2 grow">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>32.</div>
                        <div className="grow text-center">
                            <div className={cn(checkIfDownLoad('-mt-3'))}>
                                NON-ACADEMIC DISTINCTIONS / RECOGNITION <br />
                                (Write in full)
                            </div>
                        </div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="px-2 grow">
                        <div className={cn(checkIfDownLoad('-mt-3'))}>33.</div>
                        <div className="grow text-center">
                            <div className={cn(checkIfDownLoad('-mt-3'))}>
                                MEMBERSHIP IN ASSOCIATION/ORGANIZATION <br />
                                (Write in full)
                            </div>
                        </div>
                    </TextCenter>
                </div>
            </div>

            <div className="divide-y-2 divide-black border-t-2 border-black">
                {otherinformation.map((data, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[14rem,1fr,14rem] divide-x-2 divide-black text-[7pt] h-[25px]"
                    >
                        <TextCenter className="text-center font-bold">
                            <div className={cn('leading-3', checkIfDownLoad('-mt-3'))}>{data.skills}</div>
                        </TextCenter>
                        <TextCenter className="text-center font-bold">
                            <div className={cn('leading-3', checkIfDownLoad('-mt-3'))}>{data.recognition}</div>
                        </TextCenter>
                        <TextCenter className="text-center font-bold">
                            <div className={cn('leading-3', checkIfDownLoad('-mt-3'))}>{data.association}</div>
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

export default OtherInformation;
