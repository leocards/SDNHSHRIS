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
import { Download } from "lucide-react";
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
import { DocumentDownload } from "iconsax-react";

type PersonalDataSheetProps = {
    status: APPROVALTYPE;
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
    return (
        <div>
            <Header title="PDS" children="Personal Data Sheet" />

            <Tabs
                defaultValue="c1"
                className="overflow-hidden grow flex flex-col my-5"
                onValueChange={(value) => {}}
            >
                <div className="flex items-center space-x-3 divide-x divide-border">
                    <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                        <TabsTrigger value="c1">C1</TabsTrigger>
                        <TabsTrigger value="c2">C2</TabsTrigger>
                        <TabsTrigger value="c3">C3</TabsTrigger>
                        <TabsTrigger value="c4">C4</TabsTrigger>
                    </TabsList>
                    <div className="pl-3 flex flex-row-reverse items-center gap-3">
                        <TypographySmall className={cn("capitalize", props.status == "approved" ? "text-green-600" : "text-destructive")}>{props.status}</TypographySmall>

                        <Button className="" variant="outline" disabled={props.status !== "approved"}>
                            <DocumentDownload />
                            <span>Download</span>
                        </Button>
                    </div>
                </div>
                <TabsContent value="c1">
                    <Tabs
                        defaultValue="I"
                        className="overflow-hidden grow flex flex-col mb-5"
                        onValueChange={(value) => {}}
                    >
                        <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal [&>button>span]:line-clamp-1 bg-primary/15 text-primary/60">
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
                            <FamilyBackgroundForm data={props.familyBackground} />
                        </TabsContent>
                        <TabsContent value="III">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <EducationalBackground data={props.educationalBackground} />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
                <TabsContent value="c2">
                    <Tabs
                        defaultValue="IV"
                        className="overflow-hidden grow flex flex-col mb-5"
                        onValueChange={(value) => {}}
                    >
                        <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                            <TabsTrigger value="IV">
                                IV. CIVIL SERVICE ELIGIBILITY
                            </TabsTrigger>
                            <TabsTrigger value="V">
                                V. WORK EXPERIENCE
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="IV">
                            <TypographySmall className="text-destructive font-semibold italic">
                                Please save changes before navigating to other
                                tab.
                            </TypographySmall>
                            <CivilServiceEligibility data={props.civilService} />
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
                <TabsContent value="c3">
                    <Tabs
                        defaultValue="VI"
                        className="overflow-hidden grow flex flex-col mb-5"
                        onValueChange={(value) => {}}
                    >
                        <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
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
                            <LearningAndDevelopment data={props.learningAndDevelopment} />
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
                <TabsContent value="c4">
                    <TypographySmall className="text-destructive font-semibold italic">
                        Please save changes before navigating to other tab.
                    </TypographySmall>
                    <C4 data={props.c4} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PersonalDataSheet;
