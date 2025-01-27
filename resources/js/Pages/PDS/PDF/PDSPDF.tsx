import { APPROVALTYPE, User } from "@/Types";
import React, {
    forwardRef,
    Fragment,
    PropsWithChildren,
    useEffect,
    useState,
} from "react";
import {
    ADDRESSTYPE,
    PERSONALINFORMATIONTYPE,
} from "../Types/PersonalInformation";
import { CIVILSERVICETYPE } from "../Types/CivilServiceEligibility";
import { WORKEXPERIENCETYPE } from "../Types/WorkExperience";
import { VOLUNTARYWORKTYPE } from "../Types/VoluntaryWork";
import { LEARNINGANDEVELOPMENTTYPE } from "../Types/LearningAndDevelopment";
import { C4TYPE } from "../Types/C4";
import {
    PDSPDFIsDownloadProvider,
    useIsDownloadChecker,
} from "@/Components/Provider/pds-downloader-provider";
import { cn } from "@/Lib/utils";
import C1 from "./C1";
import Header from "./Partials/Header";
import { PersonalInfoProps } from "./Partials/PersonalInformation";
import { EducationalBackgroundType } from "./Partials/EducationalBackground";
import { FamilyBackgroundType } from "./Partials/FamilyBackground";
import C2 from "./C2";
import C3 from "./C3";
import { OtherInformationType } from "./Partials/OtherInformation";
import C4 from "./C4";
import TypographySmall from "@/Components/Typography";
import { PDSTABSTYPE } from "@/Types/types";

type PDSPDFDATATYPES = {
    status: APPROVALTYPE;
    user: Pick<
        User,
        | "firstname"
        | "lastname"
        | "extensionname"
        | "middlename"
        | "birthday"
        | "gender"
        | "birthplace"
    >;
    personalInformation: Omit<PERSONALINFORMATIONTYPE, "id" | "addresses"> & {
        residential: ADDRESSTYPE;
        permanent: ADDRESSTYPE;
    };
    familyBackground: FamilyBackgroundType;
    educationalBackground: EducationalBackgroundType;
    civilService: CIVILSERVICETYPE;
    workExperience: WORKEXPERIENCETYPE;
    voluntaryWork: VOLUNTARYWORKTYPE;
    learningAndDevelopment: LEARNINGANDEVELOPMENTTYPE;
    otherInformation: OtherInformationType;
    c4: C4TYPE;
};

type PDSPDFProps = {
    userid: number | null;
    tab: PDSTABSTYPE;
    onStatus?: (status: APPROVALTYPE) => void;
    onLoad?: (load: boolean) => void;
    onEmpty?: (empty: boolean) => void;
};

const PDSPDF = forwardRef<HTMLDivElement, PDSPDFProps>((props, ref) => {
    const [loading, setLoading] = useState(false);
    const [emptyData, setEmptyData] = useState(false);
    const [data, setData] = useState<PDSPDFDATATYPES>();

    useEffect(() => {
        if (props.userid)
            (async () => {
                try {
                    setLoading(true);
                    props.onLoad?.(true);

                    const response = await window.axios.get<PDSPDFDATATYPES>(
                        route("pds.pds", [props.userid])
                    );

                    props.onStatus && props.onStatus(response.data.status);

                    setData(response.data);
                } catch (error) {
                    setEmptyData(true);
                    props.onEmpty?.(true);
                } finally {
                    setLoading(false);
                    props.onLoad?.(false);
                }
            })();
    }, [props.userid]);

    return (
        <div className="inline-flex gap-4 w-[calc(900px-20pt)] overflow-hidden !bg-white gray-50">
            {loading ? (
                <div className="flex flex-col items-center gap-4 mx-auto">
                    <div className="loading loading-spinner loading-md"></div>
                    <TypographySmall>Please wait a moment...</TypographySmall>
                </div>
            ) : (
                !emptyData ? (
                    <Fragment>
                        {props.tab === "C1" && data && (
                            <>
                                <div>
                                    <PDSPDFIsDownloadProvider>
                                        <Pages pageNumber={1}>
                                            <Header />
                                            <C1
                                                personalInfo={
                                                    {
                                                        ...data?.personalInformation,
                                                        ...data?.user,
                                                        residential:
                                                            data
                                                                ?.personalInformation
                                                                .residential,
                                                        permanent:
                                                            data
                                                                ?.personalInformation
                                                                .permanent,
                                                    } as PersonalInfoProps
                                                }
                                                familyBackground={
                                                    data.familyBackground
                                                }
                                                education={
                                                    data.educationalBackground
                                                }
                                            />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>

                                <div>
                                    <PDSPDFIsDownloadProvider
                                        initialValue={true}
                                    >
                                        <Pages
                                            ref={ref}
                                            pageNumber={1}
                                            className=""
                                        >
                                            <Header />
                                            <C1
                                                personalInfo={
                                                    {
                                                        ...data?.personalInformation,
                                                        ...data?.user,
                                                    } as PersonalInfoProps
                                                }
                                                familyBackground={
                                                    data.familyBackground
                                                }
                                                education={
                                                    data.educationalBackground
                                                }
                                            />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>
                            </>
                        )}

                        {props.tab === "C2" && data && (
                            <>
                                <div>
                                    <PDSPDFIsDownloadProvider>
                                        <Pages pageNumber={2}>
                                            <C2
                                                civilservice={data.civilService}
                                                workexperience={
                                                    data.workExperience
                                                }
                                            />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>

                                <div>
                                    <PDSPDFIsDownloadProvider
                                        initialValue={true}
                                    >
                                        <Pages ref={ref} pageNumber={2}>
                                            <C2
                                                civilservice={data.civilService}
                                                workexperience={
                                                    data.workExperience
                                                }
                                            />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>
                            </>
                        )}

                        {props.tab === "C3" && data && (
                            <>
                                <div>
                                    <PDSPDFIsDownloadProvider>
                                        <Pages pageNumber={3}>
                                            <C3
                                                voluntarywork={
                                                    data.voluntaryWork
                                                }
                                                learningdevelopment={
                                                    data.learningAndDevelopment
                                                }
                                                otherinformation={
                                                    data.otherInformation
                                                }
                                            />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>

                                <div>
                                    <PDSPDFIsDownloadProvider
                                        initialValue={true}
                                    >
                                        <Pages ref={ref} pageNumber={3}>
                                            <C3
                                                voluntarywork={
                                                    data.voluntaryWork
                                                }
                                                learningdevelopment={
                                                    data.learningAndDevelopment
                                                }
                                                otherinformation={
                                                    data.otherInformation
                                                }
                                            />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>
                            </>
                        )}

                        {props.tab === "C4" && data && (
                            <>
                                <div>
                                    <PDSPDFIsDownloadProvider>
                                        <Pages pageNumber={4}>
                                            <C4 c4Data={data.c4} />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>

                                <div>
                                    <PDSPDFIsDownloadProvider
                                        initialValue={true}
                                    >
                                        <Pages ref={ref} pageNumber={4}>
                                            <C4 c4Data={data.c4} />
                                        </Pages>
                                    </PDSPDFIsDownloadProvider>
                                </div>
                            </>
                        )}
                    </Fragment>
                ) : (
                    <div className="text-center w-full py-10">No PDS added</div>
                )
            )}
        </div>
    );
});

type PagesProps = {
    pageNumber: number;
    className?: string;
} & PropsWithChildren;

export const Pages = React.forwardRef<HTMLDivElement, PagesProps>(
    ({ ...props }, ref) => {
        const { checkIfDownLoad } = useIsDownloadChecker();

        return (
            <div
                ref={ref}
                className={cn(
                    "w-[calc(900px-20pt)] mx-auto shadow-md font-arial-narrow text-[10pt] text-black p x-[20pt] scale-[.95]",
                    props.className
                )}
            >
                <div
                    className={cn(
                        "border-[2.5px]  border-black h-full",
                        props.pageNumber === 4
                            ? "border-t-[2.5px]"
                            : "border-t-[4px]"
                    )}
                >
                    {props.children}
                </div>
                <div className="text-[6pt] italic text-right pr-2 h-[16px]">
                    <div className={cn(checkIfDownLoad("-mt-1.5 pb-"))}>
                        CS FORM 212 (Revised 2017), Page {props.pageNumber} of 4
                    </div>
                </div>
            </div>
        );
    }
);

export default PDSPDF;
