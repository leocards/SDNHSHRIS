import { cn } from "@/Lib/utils";
import React from "react";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { TextCenter } from "./Partials/Header";
import { C4TYPE, defaults, getC4, IFormC4 } from "../Types/C4";
import { format } from "date-fns";

type Props = {
    c4Data: C4TYPE | null
}

const C4: React.FC<Props> = ({ c4Data }) => {
    const { checkIfDownLoad } = useIsDownloadChecker();
    const data = {
        34: getC4<IFormC4['34']>(c4Data, "34", defaults['34']),
        35: getC4<IFormC4['35']>(c4Data, "35", defaults['35']),
        36: getC4<IFormC4['36']>(c4Data, "36", defaults['36']),
        37: getC4<IFormC4['37']>(c4Data, "37", defaults['37']),
        38: getC4<IFormC4['38']>(c4Data, "38", defaults['38']),
        39: getC4<IFormC4['39']>(c4Data, "39", defaults['39']),
        40: getC4<IFormC4['40']>(c4Data, "40", defaults['40']),
        41: getC4<IFormC4['41']>(c4Data, "41", defaults['41']),
        governmentId: getC4(c4Data, "governmentId", defaults['governmentId'])
    }

    return (
        <div className="">
            <div className="bg-[#eaeaea] pt-px border-b-[2.5px] border-black"></div>
            <div className="divide-y-2 divide-black border-b-[3px] border-black">
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[8rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-3")
                            )}
                        >
                            34.
                        </div>
                        <div>
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                Are you related by consanguinity or affinity to
                                the appointing or recommending authority, or to
                                the chief of bureau or office or to the person
                                who has immediate supervision over you in the
                                Office, Bureau or Department where you will be
                                apppointed,
                            </div>
                            <div>a. within the third degree?</div>
                            <div>
                                b. within the fourth degree (for Local
                                Government Unit - Career Employees)?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        {/* choice a */}
                        <div
                            className={cn(
                                "flex gap-12 ",
                                checkIfDownLoad("mt-[3.3rem]", "mt-[3.2rem]")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['34'].choicea.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['34'].choicea.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>
                        {/* choice b */}
                        <div
                            className={cn(
                                "flex gap-12 ",
                                checkIfDownLoad("mt-3", "mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[7px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['34'].choiceb.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[7px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['34'].choiceb.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>
                        {/* choice b details */}
                        <div className="text-[9pt]">If YES, give details:</div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[20px]", "h-[17px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['34'].choiceb.details}</div>
                        </TextCenter>
                    </div>
                </div>

                {/* 35 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[9.2rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            35.
                        </div>
                        <div
                            className={cn(
                                "space-y-14",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            <div className="leading-4">
                                a. Have you ever been found guilty of any
                                administrative offense?
                            </div>
                            <div>
                                b. Have you been criminally charged before any
                                court?
                            </div>
                        </div>
                    </div>

                    <div className="divide-y-2 divide-black">
                        {/* 35 a */}
                        <div className="pl-4 mb-1">
                            <div className="flex gap-12 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(data['35'].choicea.choices == 'y') && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        YES
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[10px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(data['35'].choicea.choices == 'n') && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        NO
                                    </div>
                                </div>
                            </div>

                            <div className="text-[9pt]">
                                If YES, give details:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 !justify-start h-[24px]">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['35'].choicea.details}</div>
                            </TextCenter>
                        </div>
                        {/* 35 b */}
                        <div className="pl-4">
                            <div className="flex gap-12 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(data['35'].choiceb.choices == 'y') && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        YES
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="border-2 border-black size-[11px]">
                                        <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                            {(data['35'].choiceb.choices == 'n') && (<span>&#x2714;</span>)}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-[7.5pt]",
                                            checkIfDownLoad("-mt-2")
                                        )}
                                    >
                                        NO
                                    </div>
                                </div>
                            </div>

                            <div className="text-[9pt]">
                                If YES, give details:
                            </div>
                            <div className="flex pr-2.5">
                                <div className="text-[9pt] shrink-0 w-20 text-right">
                                    Date Filed:
                                </div>
                                <TextCenter
                                    className={cn(
                                        "border-b-2 border-black grow ml-3 !justify-start",
                                        checkIfDownLoad("h-[20px]", "h-[17px]")
                                    )}
                                >
                                    <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['35'].choiceb.datefiled ? format(new Date(data['35'].choiceb.datefiled!), "MM-dd-Y") : data['35'].choiceb.datefiled}</div>
                                </TextCenter>
                            </div>
                            <div className="flex pr-2.5">
                                <div className="text-[9pt] shrink-0 w-20 text-right">
                                    Status of Case/s:
                                </div>
                                <TextCenter
                                    className={cn(
                                        "border-b-2 border-black grow ml-3 !justify-start",
                                        checkIfDownLoad("h-[20px]", "h-[17px]")
                                    )}
                                >
                                    <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['35'].choiceb.statusofcase}</div>
                                </TextCenter>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 36 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[4rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            36.
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                Have you ever been convicted of any crime or
                                violation of any law, decree, ordinance or
                                regulation by any court or tribunal?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        <div className="flex gap-12 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['36'].choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2.5")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['36'].choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-2.5")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "text-[9pt]",
                                checkIfDownLoad("-mt-1")
                            )}
                        >
                            If YES, give details:
                        </div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[22px]", "h-[20px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['36'].details}</div>
                        </TextCenter>
                    </div>
                </div>
                {/* 37 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[3.5rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            37.
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                Have you ever been separated from the service in
                                any of the following modes: resignation,
                                retirement, dropped from the rolls, dismissal,
                                termination, end of term, finished contract or
                                phased out (abolition) in the public or private
                                sector?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        <div
                            className={cn(
                                "flex gap-12",
                                checkIfDownLoad("mt-1")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['37'].choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['37'].choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "text-[9pt]",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            If YES, give details:
                        </div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[23px]", "h-[20px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['37'].details}</div>
                        </TextCenter>
                    </div>
                </div>
                {/* 38 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[5.3rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            38.
                        </div>
                        <div
                            className={cn(
                                "space-y-3",
                                checkIfDownLoad("-mt-1.5")
                            )}
                        >
                            <div className="leading-4">
                                a. Have you ever been a candidate in a national
                                or local election held within the last year
                                (except Barangay election)?
                            </div>
                            <div className="leading-4">
                                b. Have you resigned from the government service
                                during the three (3)-month period before the
                                last election to promote/actively campaign for a
                                national or local candidate?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4">
                        {/* 38 a */}
                        <div
                            className={cn(
                                "flex gap-12",
                                checkIfDownLoad("mt-2", "mt-1")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['38'].choicea.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['38'].choicea.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "flex pr-2.5",
                                checkIfDownLoad("-mt-px", "mb-2")
                            )}
                        >
                            <div className="text-[9pt] shrink-0">
                                If YES, give details:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['38'].choicea.details}</div>
                            </TextCenter>
                        </div>

                        {/* 38 b */}

                        <div
                            className={cn(
                                "flex gap-12",
                                checkIfDownLoad("mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['38'].choiceb.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div className="text-[7pt]">YES</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['38'].choiceb.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div className="text-[7pt]">NO</div>
                            </div>
                        </div>

                        <div className="flex pr-2.5">
                            <div className="text-[9pt] shrink-0">
                                If YES, give details:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['38'].choiceb.details}</div>
                            </TextCenter>
                        </div>
                    </div>
                </div>

                {/* 39 */}
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className="h-[3.7rem] flex bg-[#eaeaea]">
                        <div
                            className={cn(
                                "pl-2 mr-3",
                                checkIfDownLoad("-mt-2")
                            )}
                        >
                            39.
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-1.5")
                                )}
                            >
                                Have you acquired the status of an immigrant or
                                permanent resident of another country?
                            </div>
                        </div>
                    </div>

                    <div className="pl-4 pt-1.5">
                        <div className="flex gap-12">
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['39'].choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['39'].choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className="text-[9pt]">
                            If YES, give details (country):
                        </div>
                        <TextCenter
                            className={cn(
                                "border-b-2 border-black w-[17.5rem] ml-3 !justify-start",
                                checkIfDownLoad("h-[22px]", "h-[17px]")
                            )}
                        >
                            <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['39'].details}</div>
                        </TextCenter>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr,21rem] text-[10pt] divide-x-2 divide-black">
                    <div className={"h-[9.3rem] flex bg-[#eaeaea]"}>
                        <div>
                            <div
                                className={cn(
                                    "pl-2 mr-3",
                                    checkIfDownLoad("-mt-2.5")
                                )}
                            >
                                40.
                            </div>
                            <div className={cn("pt-2.5 mr-3")}>a.</div>
                            <div className={cn("pt-5 mr-3")}>b.</div>
                            <div className={cn("pt-5 mr-3")}>c.</div>
                        </div>
                        <div className="">
                            <div
                                className={cn(
                                    "leading-4",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                Pursuant to: (a) Indigenous People's Act (RA
                                8371); (b) Magna Carta for Disabled Persons (RA
                                7277); and (c) Solo Parents Welfare Act of 2000
                                (RA 8972), please answer the following items:
                                <br />
                                Are you a member of any indigenous group?
                            </div>
                            <div className="leading-4 pt-6">
                                Are you a person with disability?
                            </div>
                            <div className="leading-4 pt-6">
                                Are you a solo parent?
                            </div>
                        </div>
                    </div>

                    <div className={cn(checkIfDownLoad("pt-9", "pt-10"))}>
                        {/* 40 a */}
                        <div className="flex gap-12 pl-4">
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['40'].choicea.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['40'].choicea.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className="flex pr-2.5">
                            <div
                                className={cn(
                                    "text-[9pt] w-32 shrink-0",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                If YES, please specify:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['40'].choicea.details}</div>
                            </TextCenter>
                        </div>

                        <div
                            className={cn(
                                "flex gap-12 pl-4",
                                checkIfDownLoad("mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['40'].choiceb.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['40'].choiceb.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className={cn("flex pr-2.5")}>
                            <div
                                className={cn(
                                    "text-[9pt] w-32 shrink-0",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                If YES, please specify ID No:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['40'].choiceb.details}</div>
                            </TextCenter>
                        </div>

                        <div
                            className={cn(
                                "flex gap-12 pl-4",
                                checkIfDownLoad("mt-2")
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['40'].choicec.choices == 'y') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    YES
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="border-2 border-black size-[11px]">
                                    <div className={cn('font-bold text-[6pt] leading-[8px] px-px', checkIfDownLoad('-mt-1'))}>
                                        {(data['40'].choicec.choices == 'n') && (<span>&#x2714;</span>)}
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        "text-[7.5pt]",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    NO
                                </div>
                            </div>
                        </div>

                        <div className={cn("flex pr-2.5")}>
                            <div
                                className={cn(
                                    "text-[9pt] w-32 shrink-0",
                                    checkIfDownLoad("-mt-2")
                                )}
                            >
                                If YES, please specify ID No:
                            </div>
                            <TextCenter className="border-b-2 border-black w-[17.5rem] ml-3 h-[20px] !justify-start">
                                <div className={cn('', checkIfDownLoad('-mt-2.5'))}>{data['40'].choicec.details}</div>
                            </TextCenter>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b-[3px] border-black grid grid-cols-[38.3rem,1fr]">
                <div className="">
                    <div className="border-r-[3px] border-black">
                        <div className="border-b-[3px] border-black">
                            <TextCenter className="bg-[#eaeaea] h-[23px] !justify-start text-[7pt] gap-4 px-2">
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    41.
                                </div>
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    REFERENCES{" "}
                                    <span className="text-red-500 text-[ 6pt]">
                                        (Person not related by consanguinity or
                                        affinity to applicant /appointee)
                                    </span>
                                </div>
                            </TextCenter>
                        </div>
                        <div className="bg-[#eaeaea] border-b-2 border-black grid grid-cols-[18rem,13.7rem,1fr] divide-x-2 divide-black h-[20px] text-[7pt]">
                            <TextCenter>
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    NAME
                                </div>
                            </TextCenter>
                            <TextCenter>
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    ADDRESS
                                </div>
                            </TextCenter>
                            <TextCenter className="">
                                <div className={cn(checkIfDownLoad("-mt-3"))}>
                                    TEL NO.
                                </div>
                            </TextCenter>
                        </div>

                        <div className="divide-y-2 divide-black">
                            {data['41'].map((refer, index) => (
                                <div key={index} className="grid grid-cols-[18rem,13.7rem,1fr] divide-x-2 divide-black h-[25px] text-[7pt]">
                                    <TextCenter className="font-bold">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3")
                                            )}
                                        >
                                            {refer.name}
                                        </div>
                                    </TextCenter>
                                    <TextCenter className="font-bold">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3")
                                            )}
                                        >
                                            {refer.address}
                                        </div>
                                    </TextCenter>
                                    <TextCenter className="font-bold">
                                        <div
                                            className={cn(
                                                checkIfDownLoad("-mt-3")
                                            )}
                                        >
                                            {refer.telno}
                                        </div>
                                    </TextCenter>
                                </div>
                            ))}
                        </div>

                        <div className="border-y-[3px] border-black bg-[#eaeaea] pb-1 h-[108.8px]">
                            <div className="flex text-[10pt] gap-4 pr-4">
                                <div
                                    className={cn(
                                        "pl-2",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    42.
                                </div>
                                <div
                                    className={cn(
                                        "text-justify",
                                        checkIfDownLoad("-mt-2")
                                    )}
                                >
                                    I declare under oath that I have personally
                                    accomplished this Personal Data Sheet which
                                    is a 'y', correct and complete statement
                                    pursuant to the provisions of pertinent
                                    laws, rules and regulations of the Republic
                                    of the Philippines. I authorize the agency
                                    head/authorized representative to
                                    verify/validate the contents stated herein.
                                    I agree that any misrepresentation made in
                                    this document and its attachments shall
                                    cause the filing of administrative/criminal
                                    case/s against me.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 [&>div]:border-[3px] gap-4 [&>div]:border-black [&>div]:h-[108.8px] p-2 pr-0 text-[8.5pt]">
                        <div className="divide-y-2 divide-black">
                            <div className={cn("h-[2rem] flex bg-[#eaeaea]")}>
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Government Issued ID
                                    <span className="text-[6.5pt]">
                                        (i.e.Passport, GSIS, SSS, PRC, Driver's
                                        License, etc.)
                                    </span>{" "}
                                    <br />
                                    <i>
                                        PLEASE INDICATE ID Number and Date of
                                        Issuance
                                    </i>
                                </div>
                            </div>
                            <div className="h-[24px] text-[7pt] flex items-center">
                                <div
                                    className={cn(
                                        "w-24",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    Government Issued ID:{" "}
                                </div>
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{data['governmentId'].governmentissuedid}</div>
                                </TextCenter>
                            </div>
                            <div className="h-[24px] text-[7pt] flex items-center">
                                <div
                                    className={cn(
                                        "w-24",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    ID/License/Passport No.:
                                </div>
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{data['governmentId'].licensepassportid}</div>
                                </TextCenter>
                            </div>
                            <div className="h-[24px] text-[7pt] flex items-center">
                                <div
                                    className={cn(
                                        "w-24",
                                        checkIfDownLoad("-mt-3")
                                    )}
                                >
                                    Date/Place of Issuance:
                                </div>
                                <TextCenter>
                                    <div className={cn('font-bold', checkIfDownLoad('-mt-3'))}>{data['governmentId'].issued}</div>
                                </TextCenter>
                            </div>
                        </div>
                        <div className="flex flex-col divide-y-2 divide-black">
                            <div className="grow"></div>
                            <div className="h-[14px] bg-[#eaeaea] text-[7pt] text-center">
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Signature (Sign inside the box)
                                </div>
                            </div>
                            <div className="h-[14px]"></div>
                            <div className="h-[14px] bg-[#eaeaea] text-[7pt] text-center">
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Date Accomplished{" "}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="px-12">
                        <div className="h-[9.5rem] w-[] border-2 border-black mx-auto mt-[24px]">
                            <div className="text-[7pt] text-center px-6 leading-3 mt-3">
                                <div className={cn()}>
                                    ID picture taken within the last 6 months
                                    4.5 cm. X 3.5 cm (passport size)
                                </div>
                            </div>
                            <div className="text-[7pt] text-center leading-3 mt-4">
                                <div className={cn()}>
                                    Computer generated <br />
                                    or photocopied picture <br />
                                    is not acceptable
                                </div>
                            </div>
                        </div>
                        <div
                            className={cn(
                                "text-center text-gray-300 text-[8pt] mt-3",
                                checkIfDownLoad("mt-2 mb-1")
                            )}
                        >
                            PHOTO
                        </div>
                    </div>

                    <div className="p-3.5 pb-0">
                        <div className="border-[3px] border-black flex flex-col h-32">
                            <div className="grow"></div>
                            <div className="h-[14px] border-t-2 border-black text-center text-[7pt]">
                                <div className={cn(checkIfDownLoad("-mt-2"))}>
                                    Right Thumbmark
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    "h-[9.3rem] flex flex-col items-center text-[10pt]",
                    checkIfDownLoad("pt-3", "pt-1.5")
                )}
            >
                <div className="flex h-fit">
                    <div className={cn(checkIfDownLoad("-mt-3"))}>
                        SUBSCRIBED AND SWORN to before me this{" "}
                    </div>
                    <div
                        className={cn(
                            "w-36 border-b border-black mx-2 h-[18px]",
                            checkIfDownLoad("-mt-1")
                        )}
                    ></div>
                    <div className={cn(checkIfDownLoad("-mt-3"))}>,</div>
                    <div className={cn("ml-1", checkIfDownLoad("-mt-3"))}>
                        affiant exhibiting his/her validly issued government ID
                        as indicated above
                    </div>
                </div>

                <div className="border-[3px] w-72 mt-3 h-[6.5rem] ml-[5.8rem] border-black flex flex-col">
                    <div className="grow"></div>
                    <div className="h-[20px] bg-[#eaeaea] border-t-2 border-black text-center text-[9pt]">
                        <div className={cn(checkIfDownLoad("-mt-2"))}>
                            Person Administering Oath
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default C4;
