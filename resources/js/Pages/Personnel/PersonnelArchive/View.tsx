import Header from "@/Components/Header";
import React from "react";
import { PERSONALINFORMATIONTYPE } from "@/Pages/PDS/Types/PersonalInformation";
import { FAMILYBACKGROUNDTYPE } from "@/Pages/PDS/Types/FamilyBackground";
import { EDUCATIONALBACKGROUNDTYPE } from "@/Pages/PDS/Types/EducationalBackground";
import { CIVILSERVICETYPE } from "@/Pages/PDS/Types/CivilServiceEligibility";
import { WORKEXPERIENCETYPE } from "@/Pages/PDS/Types/WorkExperience";
import { VOLUNTARYWORKTYPE } from "@/Pages/PDS/Types/VoluntaryWork";
import { LEARNINGANDEVELOPMENTTYPE } from "@/Pages/PDS/Types/LearningAndDevelopment";
import { OTHERINFORMATIONTYPE } from "@/Pages/PDS/Types/OtherInformation";
import { C4TYPE } from "@/Pages/PDS/Types/C4";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { User } from "@/Types";
import PersonnelDetails from "./PersonnelDetails";
import PersonnelPDS from "./PersonnelPDS";
import { TARDINESSTYPE } from "@/Pages/Tardiness/Tardiness";
import PersonnelAttendance from "./PersonnelAttendance";
import PersonnelServiceRecords from "./PersonnelServiceRecords";
import PersonnelLeave from "./PersonnelLeave";
import { LEAVETYPEKEYSARRAY } from "@/Pages/Leave/Types/leavetypes";
import { SALNREPORTTYPE } from "@/Pages/Myreports/SALN/SALN";
import PersonnelSALN from "./PersonnelSALN";

type Props = {
    user: User & {
        pds_personal_information: { tin: string };
    };
    servicecredits: number;
    tardinesses: { [key: string]: Array<TARDINESSTYPE> };
    certificates: any[];
    leaves: Array<{
        id: number;
        user_id: number;
        type: (typeof LEAVETYPEKEYSARRAY)[number];
    }>;
    saln: SALNREPORTTYPE[];
};

const View: React.FC<Props> = ({
    user,
    tardinesses,
    certificates,
    leaves,
    saln,
    servicecredits
}) => {

    return (
        <div>
            <Header
                title="Personal Archive"
                className="mb-2"
                children="Personnel Archive"
            />

            <Tabs
                className="overflow-hidden grow flex flex-col my-5"
                defaultValue="details"
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="pds">PDS</TabsTrigger>
                    <TabsTrigger value="tardiness">Attendance</TabsTrigger>
                    <TabsTrigger value="sr">Service Records</TabsTrigger>
                    <TabsTrigger value="leave">Leave</TabsTrigger>
                    <TabsTrigger value="saln">SALN</TabsTrigger>
                </TabsList>

                <PersonnelDetails user={user} servicecredits={servicecredits} />

                <PersonnelPDS userId={user.id} />

                <PersonnelAttendance tardinesses={tardinesses} />

                <PersonnelServiceRecords certificates={certificates} />

                <PersonnelLeave leaves={leaves} />

                <PersonnelSALN
                    saln={saln}
                    user={{
                        position: user?.position,
                        tin: user?.pds_personal_information?.tin,
                    }}
                />
            </Tabs>
        </div>
    );
};

export default View;
