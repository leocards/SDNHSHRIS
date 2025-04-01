import Header from "@/Components/Header";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
import { cn } from "@/Lib/utils";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar";
import { Menu } from "lucide-react";
import { useSidebar } from "@/Components/ui/sidebar";
import PersonnelLocatorSlip from "./PersonnelLocatorSlip";
import { LOCATORSLIPTYPE } from "@/Pages/LocatorSlip/LocatorSlip";
import PersonnelClassAssumption from "./PersonnelClassAssumption";
import { CLASSASSUMPTIONTYPE } from "@/Pages/ClassAssumption/type";

type Props = {
    tab: string| null;
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
    locatorslip: Array<LOCATORSLIPTYPE & {
                principal: User
            }>
    classassumption: Omit<
            CLASSASSUMPTIONTYPE,
            "principal" | "curriculumhead" | "academichead"
        >[];
};

const View: React.FC<Props> = ({
    tab,
    user,
    tardinesses,
    certificates,
    leaves,
    saln,
    servicecredits,
    locatorslip,
    classassumption
}) => {
    const { state } = useSidebar()

    const [tabs, setTabs] = useState(tab??"details")

    const TabsLabel = {
        "details": "Details",
        "pds": "PDS",
        "tardiness": "Attendance",
        "sr": "Service Records",
        "leave": "Leave",
        "saln": "SALN",
        "ls": "Locator Slip",
        "ca": "Class Assumption",
    }[tabs]

    return (
        <div>
            <Header
                title="Personal Archive"
                className="mb-2"
                children="Personnel Archive"
            />

            <Tabs
                className="overflow-hidden grow flex flex-col my-5 w-full"
                defaultValue="details"
                onValueChange={setTabs}
                value={tabs}
            >
                <TabsList className={cn(
                    "w-fit flex rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60",
                    "data-[state=expanded]:[@media(max-width:1030px)]:hidden",
                    "data-[state=collapsed]:[@media(max-width:860px)]:hidden",
                    "[@media(max-width:659px)]:hidden"
                )} data-state={state}>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="pds">PDS</TabsTrigger>
                    <TabsTrigger value="tardiness">Attendance</TabsTrigger>
                    <TabsTrigger value="sr">Service Records</TabsTrigger>
                    <TabsTrigger value="leave">Leave</TabsTrigger>
                    <TabsTrigger value="saln">SALN</TabsTrigger>
                    <TabsTrigger value="ls">Locator Slip</TabsTrigger>
                    <TabsTrigger value="ca">Class Assumption</TabsTrigger>
                </TabsList>

                <div className={cn(
                    "flex items-center gap-3",
                    "data-[state=expanded]:[@media(min-width:1030px)]:hidden",
                    "data-[state=collapsed]:[@media(min-width:861px)]:hidden",
                )} data-state={state}>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger size="icon" variant={"outline"}>
                                <Menu />
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem className={cn(tabs === 'details' && "text-primary font-semibold")} onClick={() => setTabs('details')}>Details</MenubarItem>
                                <MenubarItem className={cn(tabs === 'pds' && "text-primary font-semibold")} onClick={() => setTabs('pds')}>PDS</MenubarItem>
                                <MenubarItem className={cn(tabs === 'tardiness' && "text-primary font-semibold")} onClick={() => setTabs('tardiness')}>Attendance</MenubarItem>
                                <MenubarItem className={cn(tabs === 'sr' && "text-primary font-semibold")} onClick={() => setTabs('sr')}>Service Records</MenubarItem>
                                <MenubarItem className={cn(tabs === 'leave' && "text-primary font-semibold")} onClick={() => setTabs('leave')}>Leave</MenubarItem>
                                <MenubarItem className={cn(tabs === 'saln' && "text-primary font-semibold")} onClick={() => setTabs('saln')}>SALN</MenubarItem>
                                <MenubarItem className={cn(tabs === 'ls' && "text-primary font-semibold")} onClick={() => setTabs('ls')}>Locator Slip</MenubarItem>
                                <MenubarItem className={cn(tabs === 'ca' && "text-primary font-semibold")} onClick={() => setTabs('ca')}>Class Assumption</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <div>{TabsLabel}</div>
                </div>

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

                <PersonnelLocatorSlip
                    locatorslip={locatorslip}
                />

                <PersonnelClassAssumption classassumption={classassumption} />
            </Tabs>
        </div>
    );
};

export default View;
