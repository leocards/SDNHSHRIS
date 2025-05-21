import { cn } from "@/Lib/utils";
import React from "react";
import { SubHeader } from "./Header";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { TextCenter } from "./Header";
import { checkDateFormat } from "@/Types/types";
import { EDUCATIONALBACKGROUNDTYPESINGLE, IFormEducationalBackground, EDUCATIONTYPE } from "../../Types/EducationalBackground";

export type EducationalBackgroundType = {
    elementary: IFormEducationalBackground['elementary'];
    secondary: IFormEducationalBackground['secondary'];
    senior: IFormEducationalBackground['senior'];
    vocational: IFormEducationalBackground['vocational'];
    college: IFormEducationalBackground['college'];
    graduate: IFormEducationalBackground['graduatestudies'];
};

const EducationalBackground: React.FC<EducationalBackgroundType> = ({
    ...props
}) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div>
            <SubHeader title="III. EDUCATIONAL BACKGROUND" />

            <div>
                <div className="bg-white[#eaeaea] grid grid-cols-[9.6rem,11.8rem,11.8rem,7rem,5rem,3.5rem,1fr] divide-x-2 divide-black border-b-2 border-black text-[7pt]">
                    <div className="pt-1 px-0.5 h-[45px]">
                        <div className={cn(checkIfDownLoad("-mt-1"))}>26.</div>
                        <div className={cn("text-center ")}>
                            <div className={cn(checkIfDownLoad("-mt-1"))}>
                                LEVEL
                            </div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "py-1 text-center px-0.5 flex justify-center items-center"
                        )}
                    >
                        <div className={cn(checkIfDownLoad("-mt-3"))}>
                            NAME OF SCHOOL <br /> (Write in full)
                        </div>
                    </div>
                    <div
                        className={cn(
                            "py-1 text-center px-0.5 flex justify-center items-center"
                        )}
                    >
                        <div className={cn(checkIfDownLoad("-mt-3"))}>
                            BASIC EDUCATION/DEGREE/COURSE <br /> (Write in full)
                        </div>
                    </div>
                    <div className="text-[6pt] text-center flex flex-col">
                        <div className="grow mt-2">
                            <div>
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    PERIOD OF ATTENDANCE
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x-2 divide-black border-t-2 border-black">
                            <div className="h-[13px]">
                                <div className={cn(checkIfDownLoad("-mt-1"))}>
                                    From
                                </div>
                            </div>
                            <div className="h-[13px]">
                                <div className={cn(checkIfDownLoad("-mt-1"))}>
                                    To
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "py-1 text-center px-0.5 flex flex-col justify-center items-center leading-3"
                        )}
                    >
                        <div className={cn(checkIfDownLoad("-mt-2"))}>
                            HIGHEST LEVEL/ UNITS EARNED <br />{" "}
                            <span className="text-[6pt]">
                                (if not graduated)
                            </span>
                        </div>
                    </div>
                    <div
                        className={cn(
                            "py-1 text-center text-[6.5pt] px-0.5 flex justify-center items-center"
                        )}
                    >
                        <div className={cn(checkIfDownLoad("-mt-2"))}>
                            YEAR GRADUATED
                        </div>
                    </div>
                    <div
                        className={cn(
                            "py-1 text-center break-words text-[6pt] px-0.5 leading-[.6rem]"
                        )}
                    >
                        <div className={cn(checkIfDownLoad("-mt-1"))}>
                            SCHOLARSHIP/ ACADEMIC HONORS RECEIVED
                        </div>
                    </div>
                </div>

                {props.elementary?.map((elementary, index) => (
                    <EducationCard key={index} level="elementary" {...elementary} />
                ))}
                {(!props.elementary || props.elementary.length === 0) && <EmptyEducationCard level="elementary" />}

                {props.secondary?.map((elementary, index) => (
                    <EducationCard key={index} level="secondary" {...elementary} />
                ))}
                {(!props.secondary||props.secondary.length === 0) && <EmptyEducationCard level="secondary" />}

                {props.senior?.map((elementary, index) => (
                    <EducationCard key={index} level="Senior High" {...elementary} />
                ))}
                {(!props.senior||props.senior.length === 0) && <EmptyEducationCard level="Senior High" />}

                {props.vocational?.map((elementary, index) => (
                    <EducationCard key={index} level="VOCATIONAL / TRADE COURSE" {...elementary} />
                ))}
                {(!props.vocational||props.vocational.length === 0) && <EmptyEducationCard level="VOCATIONAL / TRADE COURSE" />}

                {props.college?.map((elementary, index) => (
                    <EducationCard key={index} level="college" {...elementary} />
                ))}
                {(!props.college||props.college.length === 0) && <EmptyEducationCard level="college" />}

                {props.graduate?.map((elementary, index) => (
                    <EducationCard key={index} level="Graduate studies" {...elementary} />
                ))}
                {(!props.graduate||props.graduate.length === 0) && <EmptyEducationCard level="Graduate studies" />}

                {/* default empty */}

            </div>
        </div>
    );
};

export default EducationalBackground;

type EducationCardProps = EDUCATIONTYPE & {
    level: string;
}

const EducationCard: React.FC<EducationCardProps> = ({ ...props }) => {
    const { checkIfDownLoad } = useIsDownloadChecker()

    return (
        <div className="grid grid-cols-[9.6rem,11.8rem,11.8rem,7rem,5rem,3.5rem,1fr] divide-x-2 divide-black text-[7pt] [&>div]:h-[28px] border-b-2 border-black">
            <div className="bg-[#eaeaea] flex">
                <TextCenter className="w-full !justify-start pl-5 uppercase">
                    {props.level}
                </TextCenter>
            </div>
            <TextCenter className="text-center">
                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{props?.nameofschool}</div>
            </TextCenter>
            <TextCenter className="text-center">
                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{props?.basiceddegreecourse}</div>
            </TextCenter>
            <div className="grid grid-cols-2 divide-x-2 divide-black">
                <TextCenter>
                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{checkDateFormat(props?.period?.from)}</div>
                </TextCenter>
                <TextCenter>
                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{checkDateFormat(props?.period?.to)}</div>
                </TextCenter>
            </div>
            <TextCenter className="">
                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{props?.highestlvl}</div>
            </TextCenter>
            <TextCenter className="">
                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{props?.yeargraduated}</div>
            </TextCenter>
            <TextCenter className="">
                <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{props?.scholarshiphonor}</div>
            </TextCenter>
        </div>
    );
};

const EmptyEducationCard = ({ level }: { level: string }) => {
    return (
        <div className="grid grid-cols-[9.6rem,11.8rem,11.8rem,7rem,5rem,3.5rem,1fr] divide-x-2 divide-black text-[7pt] [&>div]:h-[28px] border-b-2 border-black">
            <div className="bg-[#eaeaea] flex">
                <TextCenter className="w-full !justify-start pl-5 uppercase">
                    {level}
                </TextCenter>
            </div>
            <TextCenter className="text-center">
                <div className={cn('font-bold')}>N/A</div>
            </TextCenter>
            <TextCenter className="text-center">
                <div className={cn('font-bold')}>N/A</div>
            </TextCenter>
            <div className="grid grid-cols-2 divide-x-2 divide-black">
                <TextCenter>
                    <div className={cn('font-bold')}>N/A</div>
                </TextCenter>
                <TextCenter>
                    <div className={cn('font-bold')}>N/A</div>
                </TextCenter>
            </div>
            <TextCenter className="">
                <div className={cn('font-bold')}>N/A</div>
            </TextCenter>
            <TextCenter className="">
                <div className={cn('font-bold')}>N/A</div>
            </TextCenter>
            <TextCenter className="">
                <div className={cn('font-bold')}>N/A</div>
            </TextCenter>
        </div>
    );
};
