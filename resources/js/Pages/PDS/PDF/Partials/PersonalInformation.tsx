import { cn } from "@/Lib/utils";
import { SubHeader } from "./Header";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { format } from "date-fns";
import { User } from "@/Types";
import {
    ADDRESSTYPE,
    PERSONALINFORMATIONTYPE,
} from "../../Types/PersonalInformation";

export type PersonalInfoProps = Omit<
    PERSONALINFORMATIONTYPE,
    "id" | "addresses"
> &
    Pick<
        User,
        | "firstname"
        | "lastname"
        | "extensionname"
        | "middlename"
        | "birthday"
        | "gender"
        | "birthplace"
    > & {
        residential: ADDRESSTYPE;
        permanent: ADDRESSTYPE;
    };

const PersonalInformation: React.FC<PersonalInfoProps> = ({ ...props }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div className="">
            <SubHeader title="I. PERSONAL INFORMATION" />

            {/* 2 */}
            <div className="border-b-[3px] border-black">
                <div className="flex">
                    <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                        <div
                            className={cn(
                                "pl-2 pr-1",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            2.
                        </div>
                        <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                            SURNAME
                        </div>
                    </div>
                    <div className="border-black border-b-2 border-l-2 w-full h-[24px]">
                        <div
                            className={cn(
                                "font-bold pl-1 uppercase",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            {props.lastname}
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                        <div className="pl-2 pr-1 opacity-0">2.</div>
                        <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                            FIRST NAME
                        </div>
                    </div>
                    <div className="border-black border-b-2 border-l-2 w-full flex h-[24px]">
                        <div className="grow">
                            <div
                                className={cn(
                                    "font-bold pl-1 uppercase",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                {props.firstname}
                            </div>
                        </div>
                        <div className="bg-[#eaeaea] text-[6pt] relative w-[13.3rem] border-l-2 border-black">
                            <span
                                className={cn(
                                    "absolute top-0 left-1 uppercase",
                                    checkIfDownLoad("-mt-1")
                                )}
                            >
                                NAME EXTENSION (JR., SR)
                            </span>
                            <span className={cn("absolute top-0 right-10 font-bold text-[10pt]", checkIfDownLoad('-mt-1.5'))}>
                                {props?.extensionname}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                        <div className="pl-2 pr-1 opacity-0">2.</div>
                        <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                            MIDDLE NAME
                        </div>
                    </div>
                    <div className="border-black border-l-2 w-full h-[24px]">
                        <div
                            className={cn(
                                "font-bold pl-1 uppercase",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            {props.middlename}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-[21.5rem,1fr] divide-x-[3px] divide-black">
                {/* 3-15 */}
                <div>
                    {/* 3. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] pb-2 w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                3.
                            </div>
                            <div>
                                <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                    DATE OF BIRTH
                                </div>
                                <div className={cn(checkIfDownLoad("-mt-1"))}>
                                    (mm/dd/yyyy){" "}
                                </div>
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[36px] text-center align-middle">
                            <div
                                className={cn(
                                    "font-bold my-1.5",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                {format(props.birthday, "P")}
                            </div>
                        </div>
                    </div>
                    {/* 4. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                4.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                PLACE OF BIRTH
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] text-center">
                            <div
                                className={cn(
                                    "font-bold uppercase",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                {props.placeofbirth}
                            </div>
                        </div>
                    </div>
                    {/* 5. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                5.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                SEX
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full grid grid-cols-2 gap-3 px-2 h-[24px]">
                            <div className="flex items-center gap-1 text-[8pt]">
                                <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                    <div
                                        className={cn(
                                            "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        {props.gender === "male" && (
                                            <span>&#x2714;</span>
                                        )}
                                    </div>
                                </div>
                                <div className="font-arial">
                                    <div
                                        className={cn(
                                            checkIfDownLoad("-mt-3.5")
                                        )}
                                    >
                                        Male
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[8pt]">
                                <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                    <div
                                        className={cn(
                                            "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        {props.gender === "female" && (
                                            <span>&#x2714;</span>
                                        )}
                                    </div>
                                </div>
                                <div className="font-arial">
                                    <div
                                        className={cn(
                                            checkIfDownLoad("-mt-3.5")
                                        )}
                                    >
                                        Female
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 6. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[4px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                6.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                CIVIL STATUS
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full px-2 pb-1 h-[55.96px] [64.96px]">
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <div className="flex items-center gap-1 text-[8pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.civilstatus.status ===
                                                "single" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-arial">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3.5")
                                            )}
                                        >
                                            Single
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[8pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.civilstatus.status ===
                                                "married" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-arial">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3.5")
                                            )}
                                        >
                                            Married
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "grid grid-cols-2 gap-3",
                                    checkIfDownLoad("my-1")
                                )}
                            >
                                <div className="flex items-center gap-1 text-[8pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.civilstatus.status ===
                                                "widowed" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-arial">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3.5")
                                            )}
                                        >
                                            Widowed
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[8pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.civilstatus.status ===
                                                "separate" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-arial">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3.5")
                                            )}
                                        >
                                            Separated
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-[auto,1fr] gap-3 mt-">
                                <div className="flex items-center gap-1 text-[8pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[6pt] leading-[1px] tracking-tighter px-0",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.civilstatus &&
                                                ![
                                                    "single",
                                                    "married",
                                                    "widowed",
                                                    "separate",
                                                ].includes(
                                                    props.civilstatus.status
                                                ) && <span>&#x2714;</span>}
                                        </div>
                                    </div>
                                    <div className="font-arial">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3.5")
                                            )}
                                        >
                                            Other/s:
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[8pt] font-bold">
                                    <div
                                        className={cn(
                                            "font-bold",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        {(props.civilstatus.status && props.civilstatus.status == "others") &&
                                            props.civilstatus.others}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 7. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                7.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                HEIGHT (m)
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.height}
                            </div>
                        </div>
                    </div>
                    {/* 8. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                8.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                WEIGHT (kg)
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.weight}
                            </div>
                        </div>
                    </div>
                    {/* 9. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-2 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                9.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                BLOOD TYPE
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >{props.bloodtype}</div>
                        </div>
                    </div>
                    {/* 10. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-0.5 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                10.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                GSIS ID NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.gsis}
                            </div>
                        </div>
                    </div>
                    {/* 11. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-0.5 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                11.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                PAG-IBIG ID NO
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.pagibig}
                            </div>
                        </div>
                    </div>
                    {/* 12. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-0.5 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                12.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                PHILHEALTH NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.philhealth}
                            </div>
                        </div>
                    </div>
                    {/* 13. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-0.5 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                13.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                SSS NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.sss}
                            </div>
                        </div>
                    </div>
                    {/* 14. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-0.5 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                14.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                TIN NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.tin}
                            </div>
                        </div>
                    </div>
                    {/* 15. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[9.6rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-0.5 pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                15.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                AGENCY EMPLOYEE NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.agencyemployee}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 16 - 21 */}
                <div>
                    {/* 16. */}
                    <div className="flex border-b-2 border-black">
                        <div className="flex bg-[#eaeaea] text-[7pt] h-[87.5px] w-[11rem] shrink-0 border-r-2 border-black">
                            <div className="flex">
                                <div className="pr-1">16.</div>
                                <div>CITIZENSHIP</div>
                            </div>
                        </div>
                        <div className="grow">
                            <div className="flex gap-8 px-3 pt-2">
                                <div className="flex items-center gap-1 text-[7pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.citizenship.citizen ===
                                                "filipino" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "font-arial",
                                            checkIfDownLoad("-mt-3.5")
                                        )}
                                    >
                                        Filipino
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[7pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.citizenship.citizen ===
                                                "dual" && <span>&#x2714;</span>}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "font-arial",
                                            checkIfDownLoad("-mt-3.5")
                                        )}
                                    >
                                        Dual Citizenship
                                    </div>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "flex gap-5 ml-[6.3rem] px-3 pt-px w-fit",
                                    checkIfDownLoad("mt-1")
                                )}
                            >
                                <div className="flex items-center gap-1 text-[7pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.citizenship.dual?.by ===
                                                "birth" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "font-arial",
                                            checkIfDownLoad("-mt-3.5")
                                        )}
                                    >
                                        by birth
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-[7pt]">
                                    <div className="border-2 border-black size-[10.55px] flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.citizenship.dual?.by ===
                                                "naturalization" && (
                                                <span>&#x2714;</span>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "font-arial",
                                            checkIfDownLoad("-mt-3.5")
                                        )}
                                    >
                                        by naturalization
                                    </div>
                                </div>
                            </div>
                            <div className="ml-[7.6rem]">
                                <div
                                    className={cn(
                                        checkIfDownLoad("-mt-1.5 mb-2")
                                    )}
                                >
                                    Pls. indicate country:
                                </div>
                            </div>

                            <div className="border-t border-x-0 border-black h-7 mt-0.5 flex items-center pl-1">
                                <div
                                    className={cn(
                                        "text-[8pt] uppercase",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    {props.citizenship.dual?.country}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 17. */}
                    <div className="flex border-b-2 border-black h-[6.8rem]">
                        <div className="flex flex-col bg-[#eaeaea] text-[7pt] py-[3px] w-[8rem] shrink-0 border-r-2 border-black">
                            <div className="flex">
                                <div
                                    className={cn(
                                        "pl- pr-1",
                                        checkIfDownLoad("-mt-1.5")
                                    )}
                                >
                                    17.
                                </div>
                                <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                    RESIDENTIAL ADDRESS
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "mt-auto text-center",
                                    checkIfDownLoad("mb-1")
                                )}
                            >
                                ZIP CODE
                            </div>
                        </div>
                        <div className="grow">
                            <div className="grid grid-cols-2">
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.residential?.houselotblockno}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            House/Block/Lot No
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.residential?.street}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Street
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.residential?.subdivision}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Subdivision/Village
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.residential?.barangay}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Barangay
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.residential?.citymunicipality}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            City/Municipality
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.residential?.province}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Province
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div
                                    className={cn(
                                        "font-bold",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    {props.residential?.zipcode}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 18. */}
                    <div className="flex border-b-2 border-black h-[6.4rem]">
                        <div className="flex flex-col bg-[#eaeaea] text-[7pt] py-[3px] w-[8rem] shrink-0 border-r-2 border-black">
                            <div className="flex">
                                <div
                                    className={cn(
                                        "pl- pr-1",
                                        checkIfDownLoad("-mt-1.5")
                                    )}
                                >
                                    18.
                                </div>
                                <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                    PERMANENT ADDRESS
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "mt-auto text-center",
                                    checkIfDownLoad("mb-1")
                                )}
                            >
                                ZIP CODE
                            </div>
                        </div>
                        <div className="grow">
                            <div className="grid grid-cols-2">
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.permanent?.houselotblockno}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            House/Block/Lot No
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.permanent?.street}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Street
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.permanent?.subdivision}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Subdivision/Village
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.permanent?.barangay}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Barangay
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.permanent?.citymunicipality}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            City/Municipality
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b-2 border-black">
                                    <div className="h-4 flex items-center justify-center">
                                        <div
                                            className={cn(
                                                "font-bold text-[7pt] uppercase",
                                                checkIfDownLoad("-mt-2")
                                            )}
                                        >
                                            {props.permanent?.province}
                                        </div>
                                    </div>
                                    <div className="text-[6.5pt] italic h-[9px] text-center border-t border-black leading-[.50rem]">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-1.5")
                                            )}
                                        >
                                            Province
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div
                                    className={cn(
                                        "font-bold",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    {props.permanent?.zipcode}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 19. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[7.9rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-px pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                19.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                TELEPHONE NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.telephone}
                            </div>
                        </div>
                    </div>
                    {/* 20. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[7.9rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-px pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                20.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                MOBILE NO.
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.mobile && props.mobile != "N/A" ?'+63'+props.mobile:props.mobile}
                            </div>
                        </div>
                    </div>
                    {/* 21. */}
                    <div className="flex border-black border-b-2">
                        <div className="flex bg-[#eaeaea] text-[7pt] py-[5px] w-[7.9rem] shrink-0">
                            <div
                                className={cn(
                                    "pl-px pr-1",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                21.
                            </div>
                            <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                                E-MAIL ADDRESS (if any)
                            </div>
                        </div>
                        <div className="border-black border-l-2 w-full h-[24px] flex items-center justify-center">
                            <div
                                className={cn(
                                    "font-bold",
                                    checkIfDownLoad("-mt-4")
                                )}
                            >
                                {props.email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
