import { cn } from "@/Lib/utils";
import React from "react";
import { SubHeader } from "./Header";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { CHILDRENTYPE, FATHERTYPE, MOTHERTYPE, SPOUSETYPE } from "../../Types/FamilyBackground";
import { format } from "date-fns";

export type FamilyBackgroundType = {
    spouse: SPOUSETYPE;
    father: FATHERTYPE;
    mother: MOTHERTYPE;
    child: {name: string, dateofbirth: string}[];
}

type Props = {
    fb: FamilyBackgroundType;
}

const FamilyBackground: React.FC<Props> = ({ fb }) => {
    const { checkIfDownLoad } = useIsDownloadChecker()

    return (
        <div>
            <SubHeader title="II. FAMILY BACKGROUND" />

            <div className="grid grid-cols-[29.5rem,1fr] divide-x-2 divide-black">
                <div className="">
                    {/* 22. */}
                    <div className="">
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0">
                                <div className={cn("pl-0.5 pr-1", checkIfDownLoad('-mt-1'))}>22.</div>
                                <div className={cn('ml-0.5', checkIfDownLoad('-mt-1'))}>SPOUSE'S SURNAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold uppercase', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.familyname}</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0">
                                <div className="pl-2 pr-1 opacity-0">22.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>FIRST NAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex">
                                <div className="grow flex justify-center items-center">
                                    <div className={cn('font-bold uppercase', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.firstname}</div>
                                </div>
                                <div className="bg-[#eaeaea] text-[6pt] relative w-[8rem] border-l-2 border-black">
                                    <span className={cn("absolute top-0 left-px", checkIfDownLoad('-mt-1.5'))}>
                                        NAME EXTENSION (JR., SR)
                                    </span>
                                    <span className={cn("absolute top-0 right-1 text-[10pt] font-bold", checkIfDownLoad('-mt-1.5'))}>
                                        {fb?.spouse.extensionname}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">22.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>MIDDLE NAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.middlename}</div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">22.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>OCCUPATION</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.occupation}</div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">22.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>EMPLOYER/BUSINESS NAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex items-center justify-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.employerbusiness}</div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">22.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>BUSINESS ADDRESS</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex items-center justify-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.businessaddress}</div>
                            </div>
                        </div>
                        <div className="flex h-[22px]">
                            <div className="flex bg-[#eaeaea] text-[7pt] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">22.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>TELEPHONE NO.</div>
                            </div>
                            <div className="border-black border-l-2 border-b-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.spouse.telephone}</div>
                            </div>
                        </div>
                    </div>
                    {/* 24. */}
                    <div className="">
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0">
                                <div className={cn("pl-0.5 pr-1", checkIfDownLoad('-mt-1'))}>24.</div>
                                <div  className={cn(checkIfDownLoad('-mt-1'))}>FATHER'S SURNAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.father?.familyname}</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0">
                                <div className="pl-2 pr-1 opacity-0">24.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>FIRST NAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex">
                                <div className="grow flex items-center justify-center">
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.father?.firstname}</div>
                                </div>
                                <div className="bg-[#eaeaea] text-[6pt] relative w-[8rem] border-l-2 border-black">
                                    <span className={cn("absolute top-0 left-px", checkIfDownLoad('-mt-1.5'))}>
                                        NAME EXTENSION (JR., SR)
                                    </span>
                                    <span className={cn("absolute top-0 right-1 text-[10pt] font-bold", checkIfDownLoad('-mt-1.5'))}>
                                        {fb?.father.extensionname}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">24.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>MIDDLE NAME</div>
                            </div>
                            <div className="border-black border-l-2 border-b-2 w-full h-[22px] flex items-center justify-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.father?.middlename}</div>
                            </div>
                        </div>
                    </div>
                    {/* 25. */}
                    <div className="">
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0">
                                <div className={cn("pl-0.5 pr-1", checkIfDownLoad('-mt-1'))}>25.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>MOTHER'S MAIDEN NAME</div>
                            </div>
                            <div className="border-black border-b-2 w-full bg-[#eaeaea]"></div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 ">
                                <div className="pl-2 pr-1 opacity-0">25.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>SURNAME</div>
                            </div>
                            <div className="border-black border-l-2 border-b-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.mother?.familyname}</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 ">
                                <div className="pl-2 pr-1 opacity-0">25.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>FIRST NAME</div>
                            </div>
                            <div className="border-black border-b-2 border-l-2 w-full h-[22px] flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.mother?.firstname}</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex bg-[#eaeaea] text-[7pt] h-[22px] w-[9.6rem] shrink-0 border-black border-b-2">
                                <div className="pl-2 pr-1 opacity-0">25.</div>
                                <div className={cn(checkIfDownLoad('-mt-1'))}>MIDDLE NAME</div>
                            </div>
                            <div className="border-black border-l-2 w-full border-b-2 flex justify-center items-center">
                                <div className={cn('font-bold', checkIfDownLoad('-mt-3.5'))}>{fb?.mother?.middlename}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex divide-x-2 divide-black border-b-2 h-[22px] border-black">
                        <div className="flex bg-[#eaeaea] text-[7pt] grow">
                            <div className={cn("pr-1", checkIfDownLoad('-mt-1'))}>23.</div>
                            <div className={cn(checkIfDownLoad('-mt-1'))}>
                                {" "}
                                NAME of CHILDREN (Write full name and list all)
                            </div>
                        </div>
                        <div className={cn("bg-[#eaeaea] text-[7pt] w-[7.5rem] text-center")}>
                            <div className={cn("", checkIfDownLoad('-mt-1'))}>
                                DATE OF BIRTH (mm/dd/yyyy)
                            </div>
                        </div>
                    </div>

                    <div className="">
                        {fb?.child.map((child, index) => (
                            <div
                                key={index}
                                className="divide-x-2 divide-black border-b-2 border-black h-[22px] flex"
                            >
                                <div className="flex text-[7pt] grow items-center justify-center">
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{child.name}</div>
                                </div>
                                <div className="text-[7pt] w-[7.5rem] flex items-center justify-center">
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{child.dateofbirth && child.dateofbirth != "N/A"?format(child.dateofbirth, "MM-dd-Y"):child.dateofbirth}</div>
                                </div>
                            </div>
                        ))}
                        <div className="border-b-2 border-black w-full h-[22px]">
                            <div className="bg-[#eaeaea] h-full flex text-[7pt] items-center justify-center text-red-500 italic">
                                <div className={cn(checkIfDownLoad('-mt-2'))}>
                                    (Continue on separate sheet if necessary)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyBackground;
