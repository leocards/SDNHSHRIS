import Header from "@/Components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import PersonalInformationForm from "./Forms/PersonalInformationForm";
import TypographySmall from "@/Components/Typography";
import FamilyBackgroundForm from "./Forms/FamilyBackgroundForm";
import EducationalBackground from "./Forms/EducationalBackground";
import CivilServiceEligibility from "./Forms/CivilServiceEligibility";
import WorkExperience from "./Forms/WorkExperience";
import VoluntaryWork from "./Forms/VoluntaryWork";
import LearningAndDevelopment from "./Forms/LearningAndDevelopment";
import OtherInformation from "./Forms/OtherInformation";
import C4 from "./Forms/C4";
import { Button } from "@/Components/ui/button";
import { PERSONALINFORMATIONTYPE } from "./Types/PersonalInformation";
import { FAMILYBACKGROUNDTYPE } from "./Types/FamilyBackground";
import { EDUCATIONALBACKGROUNDTYPE } from "./Types/EducationalBackground";
import { CIVILSERVICETYPE } from "./Types/CivilServiceEligibility";
import { WORKEXPERIENCETYPE } from "./Types/WorkExperience";
import { VOLUNTARYWORKTYPE } from "./Types/VoluntaryWork";
import { LEARNINGANDEVELOPMENTTYPE } from "./Types/LearningAndDevelopment";
import { OTHERINFORMATIONTYPE } from "./Types/OtherInformation";
import { C4TYPE } from "./Types/C4";
import { APPROVALTYPE } from "@/Types";
import { cn } from "@/Lib/utils";
import { DocumentDownload, Export } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import ImportExcelPds from "../Personnel/ImportExcelPds";
import { usePage } from "@inertiajs/react";
import PDSPDF from "./PDF/PDSPDF";
import { PDSTABSTYPE } from "@/Types/types";
import { Margin, usePDF } from "react-to-pdf";

type PersonalDataSheetProps = {
    status: APPROVALTYPE;
    hasImport: string | null;
    personalInformation: PERSONALINFORMATIONTYPE | null;
    familyBackground: FAMILYBACKGROUNDTYPE | null;
    educationalBackground: EDUCATIONALBACKGROUNDTYPE | null;
    civilService: CIVILSERVICETYPE | null;
    workExperience: WORKEXPERIENCETYPE | null;
    voluntaryWork: VOLUNTARYWORKTYPE | null;
    learningAndDevelopment: LEARNINGANDEVELOPMENTTYPE | null;
    otherInformation: OTHERINFORMATIONTYPE | null;
    c4: C4TYPE | null;
};

const PersonalDataSheet: React.FC<PersonalDataSheetProps> = (props) => {
    const user = usePage().props.auth.user;
    const [showImport, setShowImport] = useState(false);
    const [tab, setTab] = useState<PDSTABSTYPE>("C1");
    const [isLoading, setIsLoading] = useState(false);

    const download_pdf = usePDF({
        method: "save",
        filename: "Personal Data Sheet.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    return (
        <div className="overflow-hidden relative">
            <Header title="PDS" children="Personal Data Sheet" />

            <Tabs
                defaultValue="C1"
                className="overflow-hidden grow flex flex-col my-5"
                onValueChange={(value) => setTab(value as PDSTABSTYPE)}
            >
                <div className="flex [@media(max-width:856px)]:flex-col [@media(max-width:856px)]:gap-4 [@media(max-width:856px)]:mb-3">
                    <div className="flex items-center gap-3 divide-x divide-border">
                        <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                            <TabsTrigger value="C1">C1</TabsTrigger>
                            <TabsTrigger value="C2">C2</TabsTrigger>
                            <TabsTrigger value="C3">C3</TabsTrigger>
                            <TabsTrigger value="C4">C4</TabsTrigger>
                        </TabsList>
                        <div className="pl-3 flex items-center gap-3">
                            <Button
                                className="max-lg:p-0 max-lg:size-10"
                                variant="outline"
                                disabled={
                                    props.status !== "approved" || isLoading
                                }
                                onClick={() => {
                                    if (
                                        props.status === "approved" ||
                                        !isLoading
                                    )
                                        download_pdf.toPDF();
                                }}
                            >
                                <DocumentDownload />
                                <span className="max-lg:hidden">
                                    {isLoading ? "Loading" : "Download"}
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className="[@media(min-width:857px)]:ml-auto [@media(min-width:857px)]:w-fit w-full gap-3 flex items-center [@media(max-width:856px)]:justify-between">
                        <TypographySmall
                            className={cn(
                                "capitalize",
                                props.status == "approved"
                                    ? "text-green-600"
                                    : "text-destructive"
                            )}
                        >
                            {props.status}
                        </TypographySmall>
                        <Button
                            onClick={() => {
                                if (!!!props.hasImport) setShowImport(true);
                            }}
                            disabled={!!props.hasImport}
                        >
                            {!!props.hasImport ? (
                                "Already uploaded PDS"
                            ) : (
                                <>
                                    <Export />
                                    <span>Import</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <TabsContent value="C1">
                    <Tabs
                        defaultValue="I"
                        className="overflow-hidden grow flex flex-col mb-5"
                        onValueChange={(value) => {}}
                    >
                        <TabsList className="max-xs:!hidden w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal [&>button>span]:line-clamp-1 bg-primary/15 text-primary/60">
                            <TabsTrigger value="I">
                                I. Personal Information
                            </TabsTrigger>
                            <TabsTrigger value="II">
                                II. Family Background
                            </TabsTrigger>
                            <TabsTrigger value="III">
                                III. Educational Background
                            </TabsTrigger>
                        </TabsList>
                        <TabsList className="xs:!hidden xs:w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button]:w-full bg-primary/15 text-primary/60">
                            <TabsTrigger value="I">
                                I.
                            </TabsTrigger>
                            <TabsTrigger value="II">
                                II.
                            </TabsTrigger>
                            <TabsTrigger value="III">
                                III.
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="I">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <PersonalInformationForm
                                data={props.personalInformation}
                            />
                        </TabsContent>
                        <TabsContent value="II">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <FamilyBackgroundForm
                                data={props.familyBackground}
                            />
                        </TabsContent>
                        <TabsContent value="III">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <EducationalBackground
                                data={props.educationalBackground}
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
                <TabsContent value="C2">
                    <Tabs
                        defaultValue="IV"
                        className="overflow-hidden grow flex flex-col mb-5"
                        onValueChange={(value) => {}}
                    >
                        <TabsList className="max-xs:!hidden w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                            <TabsTrigger value="IV">
                                IV. CIVIL SERVICE ELIGIBILITY
                            </TabsTrigger>
                            <TabsTrigger value="V">
                                V. WORK EXPERIENCE
                            </TabsTrigger>
                        </TabsList>
                        <TabsList className="xs:!hidden xs:w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button]:w-full bg-primary/15 text-primary/60">
                            <TabsTrigger value="IV">
                                IV.
                            </TabsTrigger>
                            <TabsTrigger value="V">
                                V.
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="IV">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <CivilServiceEligibility
                                data={props.civilService}
                            />
                        </TabsContent>
                        <TabsContent value="V">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <WorkExperience data={props.workExperience} />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
                <TabsContent value="C3">
                    <Tabs
                        defaultValue="VI"
                        className="overflow-hidden grow flex flex-col mb-5"
                        onValueChange={(value) => {}}
                    >
                        <TabsList className="max-xs:!hidden w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                            <TabsTrigger value="VI">
                                VI. VOLUNTARY WORK OR...
                            </TabsTrigger>
                            <TabsTrigger value="VII">
                                VII. LEARNING AND DEVE...
                            </TabsTrigger>
                            <TabsTrigger value="VIII">
                                VIII. OTHER INFORMATION
                            </TabsTrigger>
                        </TabsList>
                        <TabsList className="xs:!hidden xs:w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button]:w-full bg-primary/15 text-primary/60">
                            <TabsTrigger value="VI">
                                VI.
                            </TabsTrigger>
                            <TabsTrigger value="VII">
                                VII.
                            </TabsTrigger>
                            <TabsTrigger value="VIII">
                                VIII.
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="VI">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <VoluntaryWork data={props.voluntaryWork} />
                        </TabsContent>
                        <TabsContent value="VII">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <LearningAndDevelopment
                                data={props.learningAndDevelopment}
                            />
                        </TabsContent>
                        <TabsContent value="VIII">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <OtherInformation data={props.otherInformation} />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
                <TabsContent value="C4">
                    <TypographySmall className="text-destructive font-semibold italic">
                        Please save changes before navigating to other tab.
                    </TypographySmall>
                    <C4 data={props.c4} />
                </TabsContent>
            </Tabs>

            <ImportExcelPds
                show={showImport}
                user={{ id: user.id, name: user.full_name }}
                onClose={setShowImport}
                personal
            />

            <div className="w-fit absolute -mr-[50%]">
                <PDSPDF
                    ref={download_pdf.targetRef}
                    userid={user.id}
                    tab={tab}
                    onLoad={setIsLoading}
                />
            </div>
        </div>
    );
};

export default PersonalDataSheet;
