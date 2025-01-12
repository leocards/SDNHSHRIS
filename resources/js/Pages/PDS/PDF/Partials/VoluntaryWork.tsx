import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { SubHeader, TextCenter } from "./Header";
import { cn } from "@/Lib/utils";
import { useMemo } from "react";
import { VOLUNTARYWORKTYPESINGLE } from "../../Types/VoluntaryWork";
import { checkDateFormat } from "@/Types/types";

export type VoluntaryWorkType = Omit<VOLUNTARYWORKTYPESINGLE, "id" | "user_id">;

type Props = {
    voluntarywork: Array<VoluntaryWorkType>;
};

const defaultValue: VoluntaryWorkType = {
    organization: "",
    inclusivedates: {
        from: "",
        to: "",
    },
    numberofhours: "",
    position: "",
};

const VoluntaryWork: React.FC<Props> = ({ voluntarywork }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const vw = useMemo(() => {
        const vwArray = Array.isArray(voluntarywork) ? voluntarywork : [];

        if (vwArray.length < 7) {
            return vwArray.concat(
                Array.from({ length: 7 - vwArray.length }, () => defaultValue)
            );
        } else {
            return vwArray.slice(0, 7);
        }
    }, [voluntarywork]);

    return (
        <div>
            <SubHeader title="VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S" />

            <div className="bg-[#eaeaea] h-[45px] grid grid-cols-[24rem,7rem,4rem,17.6rem] divide-x-2 divide-black text-[7pt]">
                <div className="flex p-0.5">
                    <div className={cn("pl-1 mt-1", checkIfDownLoad("-mt-1"))}>
                        <div>29.</div>
                    </div>
                    <TextCenter className="text-center grow -mt-2.5">
                        <div className={cn(checkIfDownLoad("-mt-4"))}>
                            NAME & ADDRESS OF ORGANIZATION <br /> (Write in
                            full)
                        </div>
                    </TextCenter>
                </div>
                <div className="flex flex-col">
                    <div className="grow text-center">
                        <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                            INCLUSIVE DATES <br />
                            (mm/dd/yyyy)
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x-2 divide-black border-t-2 border-black h-[15.6px] text-center">
                        <div>
                            <div className={cn(checkIfDownLoad("-mt-2"))}>
                                From
                            </div>
                        </div>
                        <div>
                            <div className={cn(checkIfDownLoad("-mt-2"))}>
                                To
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <TextCenter className="text-center grow">
                        <div
                            className={cn(
                                "text-[5.4pt]",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            NUMBER OF HOURS
                        </div>
                    </TextCenter>
                </div>
                <div className="flex">
                    <TextCenter className="grow">
                        <div className={cn(checkIfDownLoad("-mt-3"))}>
                            POSITION / NATURE OF WORK
                        </div>
                    </TextCenter>
                </div>
            </div>

            <div className="divide-y-2 divide-black border-t-2 border-black">
                {vw.map((data, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[24rem,7rem,4rem,20rem] divide-x-2 divide-black text-[7pt] h-[25px]"
                    >
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >{data.organization}</div>
                        </TextCenter>
                        <div className="grid grid-cols-2 divide-x-2 divide-black">
                            <TextCenter>
                                <div
                                    className={cn(
                                        "font-bold",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >{checkDateFormat(data.inclusivedates.from)}</div>
                            </TextCenter>
                            <TextCenter>
                                <div
                                    className={cn(
                                        "font-bold",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >{checkDateFormat(data.inclusivedates.to)}</div>
                            </TextCenter>
                        </div>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >{data.numberofhours}</div>
                        </TextCenter>
                        <TextCenter>
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-3")
                                )}
                            >{data.position}</div>
                        </TextCenter>
                    </div>
                ))}
            </div>

            <div className="bg-[#eaeaea] text-red-500 text-center italic text-[7pt] leading-3 border-y-[3px] border-black h-[15.2px]">
                <div
                    className={cn(checkIfDownLoad("-mt-2", "-mt-px font-bold"))}
                >
                    (Continue on separate sheet if necessary)
                </div>
            </div>
        </div>
    );
};

export default VoluntaryWork;
