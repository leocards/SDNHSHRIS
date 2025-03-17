import Header, { TableHeader, TableRow } from "@/Components/Header";
import TypographySmall from "@/Components/Typography";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { User } from "@/Types";
import { Departments, PDSTABSTYPE } from "@/Types/types";
import { format } from "date-fns";
import { Eye, Messages2 } from "iconsax-react";
import React, { useState } from "react";
import empty from "@/Assets/empty-tardiness.svg";
import emptyData from "@/Assets/empty-file.svg";
import ViewCertificate from "../ServiceRecord/ViewCertificate";
import PDSPDF from "../PDS/PDF/PDSPDF";
import { ChevronLeft, Menu } from "lucide-react";
import { router } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { useMessage } from "@/Components/Provider/message-provider";
import { cn } from "@/Lib/utils";
import { useSidebar } from "@/Components/ui/sidebar";
import useWindowSize from "@/Hooks/useWindowResize";
import { PERSONALINFORMATIONTYPE } from "../PDS/Types/PersonalInformation";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { LOCATORSLIPTYPE } from "../LocatorSlip/LocatorSlip";

type Props = {
    tab: string | null;
    user: User & {
        mailingaddress: string;
        pds_personal_information: PERSONALINFORMATIONTYPE;
    };
    leavecount: number;
    attendances: any[];
    certificates: any[];
    locatorslip: Array<LOCATORSLIPTYPE & {
        principal: User
    }>
};

const ViewSearched: React.FC<Props> = ({
    tab,
    user,
    leavecount,
    attendances,
    certificates,
    locatorslip
}) => {
    const [selectedCertificate, setSelectedCertificate] = useState(0);
    const [viewCertificate, setViewCertificate] = useState(false);
    const [pdsTab, setPdsTab] = useState<PDSTABSTYPE>("C1");
    const { setProcess } = useProcessIndicator();
    const { selectConversation } = useMessage();
    const { state } = useSidebar();
    const { width } = useWindowSize();
    const [tabs, setTabs] = useState(tab??"details");

    const srcolumns = `1fr ${width <= 456 ? "" : "10rem"} ${width <= 640 ? "" : "10rem"} 4rem`;
    const columns = ["1fr", "10rem", "10rem", "4rem"].join(" ");
    const TabsLabel = {
        details: "Details",
        tardiness: "Attendance",
        sr: "Certificates",
        pds: "PDS",
        ls: "Locator Slip",
    }[tabs??'details'];

    return (
        <div>
            <Header title="General Search" />

            <div className="flex items-center gap-4 font-medium uppercase">
                <Button
                    className=""
                    variant="outline"
                    size={width <= 640 ? "icon" : "default"}
                    onClick={() =>
                        router.get(
                            route("general-search"),
                            {},
                            {
                                onBefore: () => setProcess(true),
                            }
                        )
                    }
                >
                    <ChevronLeft /> <span className="max-sm:hidden">Back</span>
                </Button>

                <div>{user?.full_name}</div>
            </div>

            <Tabs
                className="overflow-hidden grow flex flex-col my-5"
                defaultValue="details"
                onValueChange={setTabs}
                value={tabs}
            >
                {width > 537 && (
                    <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="tardiness">Attendance</TabsTrigger>
                        <TabsTrigger value="sr">Certificates</TabsTrigger>
                        <TabsTrigger value="pds">PDS</TabsTrigger>
                        <TabsTrigger value="ls">Locator Slip</TabsTrigger>
                    </TabsList>
                )}

                <div className="flex items-center gap-3 [@media(min-width:538px)]:hidden">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger size="icon" variant={"outline"}>
                                <Menu />
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem
                                    className={cn(
                                        tabs === "details" &&
                                            "text-primary font-semibold"
                                    )}
                                    onClick={() => setTabs("details")}
                                >
                                    Details
                                </MenubarItem>
                                <MenubarItem
                                    className={cn(
                                        tabs === "tardiness" &&
                                            "text-primary font-semibold"
                                    )}
                                    onClick={() => setTabs("tardiness")}
                                >
                                    Attendance
                                </MenubarItem>
                                <MenubarItem
                                    className={cn(
                                        tabs === "sr" &&
                                            "text-primary font-semibold"
                                    )}
                                    onClick={() => setTabs("sr")}
                                >
                                    Certificates
                                </MenubarItem>
                                <MenubarItem
                                    className={cn(
                                        tabs === "pds" &&
                                            "text-primary font-semibold"
                                    )}
                                    onClick={() => setTabs("pds")}
                                >
                                    PDS
                                </MenubarItem>
                                <MenubarItem
                                    className={cn(
                                        tabs === "ls" &&
                                            "text-primary font-semibold"
                                    )}
                                    onClick={() => setTabs("ls")}
                                >
                                    Locator Slip
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <div>{TabsLabel}</div>
                </div>

                <TabsContent
                    value="details"
                    className="p-4 [@media(max-width:456px)]:px-0 max-w-3xl mx-auto w-full"
                >
                    <div className="" data-sidebarstate={state}>
                        <div className="flex max-md:flex-col items-center gap-3">
                            <ProfilePhoto
                                src={user.avatar}
                                className="size-24"
                                fallbackSize={40}
                            />
                            <div className="text-center">
                                <TypographySmall className="capitalize text-base">
                                    {user?.full_name}
                                </TypographySmall>
                                <br />
                                <TypographySmall className="capitalize">
                                    {user?.position}
                                </TypographySmall>
                            </div>

                            <div className="md:ml-auto">
                                <Button
                                    className=""
                                    variant="secondary"
                                    onClick={() =>
                                        selectConversation(user, true)
                                    }
                                >
                                    <Messages2 />
                                    Message
                                </Button>
                            </div>
                        </div>
                        <Card className="p-4 w-full mt-5 space-y-3">
                            <div className="grid grid-cols-1 xs:grid-cols-2 [@media(min-width:935px)]:grid-cols-4 [@media(max-width:935px)]:gap-3">
                                <DetailsCard
                                    label="Gender"
                                    value={
                                        { male: "Male", female: "Female" }[
                                            user?.gender
                                        ]
                                    }
                                />
                                <DetailsCard
                                    label="Date of Birth"
                                    value={format(user?.birthday, "MMMM d, y")}
                                />
                                <DetailsCard
                                    label="Mobile No."
                                    value={user?.mobilenumber}
                                />
                                <DetailsCard
                                    label="Email"
                                    value={user?.email}
                                    valueClass=" overflow-hidden text-ellipsis whitespace-nowrap"
                                />
                            </div>
                            <div className="grid grid-cols-1 xs:grid-cols-2 mt-2 gap-3">
                                <DetailsCard
                                    label="Home Address / Mailing Address"
                                    valueClass="capitalize"
                                    value={user?.mailingaddress?.toLowerCase()}
                                />
                                <DetailsCard
                                    label="School / Detailed"
                                    value={
                                        "Southern Davao National High School"
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-1 xs:grid-cols-2 [@media(min-width:935px)]:grid-cols-4 [@media(max-width:935px)]:gap-3 mb-2">
                                <DetailsCard
                                    label="GSIS No./BP No."
                                    value={
                                        user?.pds_personal_information?.gsis ??
                                        ""
                                    }
                                />
                                <DetailsCard
                                    label="PAG-IBIG No."
                                    value={
                                        user?.pds_personal_information
                                            ?.pagibig ?? ""
                                    }
                                />
                                <DetailsCard
                                    label="PHILHEALTH No."
                                    value={
                                        user?.pds_personal_information
                                            ?.philhealth ?? ""
                                    }
                                />
                                <DetailsCard
                                    label="BIR (TIN No.)"
                                    value={
                                        user?.pds_personal_information?.tin ??
                                        ""
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-1 xs:grid-cols-2 [@media(min-width:935px)]:grid-cols-4 [@media(max-width:935px)]:gap-3">
                                <DetailsCard
                                    label="DepEd Employee No."
                                    value={user?.personnelid}
                                />
                                <DetailsCard
                                    label="Date Hired"
                                    value={format(user?.hiredate, "MMMM, d y")}
                                />
                                <DetailsCard
                                    label="Department"
                                    value={Departments[user?.department]}
                                />
                                <DetailsCard
                                    label="Approved Leave"
                                    value={leavecount?.toString() ?? "0"}
                                />
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent
                    value="tardiness"
                    className="w-full py-4 max-sm:px-0 [@media(max-width:456px)]:px-0"
                >
                    <Card className="min-h-[28rem] relative">
                        <Accordion type="single" collapsible className="w-full">
                            {attendances.map((att, index) => (
                                <AccordionItem value={att.id} key={index}>
                                    <AccordionTrigger className="py-2.5 px-3">
                                        S.Y. {att?.schoolyear?.schoolyear} for
                                        the month of {att?.month}
                                    </AccordionTrigger>
                                    <AccordionContent className="group-data-[state=open]/accordion:border-border border-transparent border-t p-2 bg-muted">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 [&>div]:text-center [&>div>div:nth-child(2)]:text-lg">
                                            <div className="">
                                                <div>No. of Days Present</div>
                                                <div>{att?.present}</div>
                                            </div>
                                            <div className="">
                                                <div>No. of Days Absent</div>
                                                <div>{att?.absent}</div>
                                            </div>
                                            <div className="">
                                                <div>
                                                    No. of Days Time Tardy
                                                </div>
                                                <div>{att?.timetardy}</div>
                                            </div>
                                            <div className="">
                                                <div>No. of Days Undertime</div>
                                                <div>{att?.undertime}</div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        {attendances.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center pointer-events-none">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={empty}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded tardiness.
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent
                    value="sr"
                    className="w-full py-4 [@media(max-width:456px)]:px-0"
                >
                    <Card className="min-h-[28rem] relative space-y-1">
                        <TableHeader style={{ gridTemplateColumns: srcolumns }}>
                            <div>Certificate Name</div>
                            <div className="[@media(max-width:456px)]:!hidden">
                                Type
                            </div>
                            <div className="max-sm:!hidden">Date modified</div>
                            <div></div>
                        </TableHeader>
                        {certificates.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center pointer-events-none">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={emptyData}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded certificates.
                                </div>
                            </div>
                        )}

                        {certificates?.map((data, index) => (
                            <TableRow
                                style={{ gridTemplateColumns: srcolumns }}
                                key={index}
                                className="hover:bg-secondary border border-border rounded-md shadow-sm cursor-pointer"
                                onClick={() => {
                                    setSelectedCertificate(data?.id);
                                    setViewCertificate(true);
                                }}
                            >
                                <div className="line-clamp-1">
                                    {data?.details?.name ?? "N/A"}
                                </div>
                                <div
                                    className={cn(
                                        "[@media(max-width:456px)]:!hidden",
                                        data?.type === "coc"
                                            ? "uppercase"
                                            : "capitalize"
                                    )}
                                >
                                    {data?.type}
                                </div>
                                <div className="max-sm:!hidden">
                                    {format(data?.updated_at, "MMMM dd, y")}
                                </div>
                                <Button className="ml-auto" variant={"link"}>
                                    <Eye />
                                </Button>
                            </TableRow>
                        ))}

                        <ViewCertificate
                            srid={selectedCertificate}
                            show={viewCertificate}
                            onClose={setViewCertificate}
                        />
                    </Card>
                </TabsContent>

                <TabsContent
                    value="pds"
                    className="w-fit max-sm:w-full sm:mx-auto"
                >
                    <Tabs
                        defaultValue={pdsTab}
                        className="overflow-hidden rounded-md grow flex flex-col my-4 mb-2 sm:mx-auto w-fit"
                        onValueChange={(value) =>
                            setPdsTab(value as PDSTABSTYPE)
                        }
                    >
                        <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                            <TabsTrigger value="C1">C1</TabsTrigger>
                            <TabsTrigger value="C2">C2</TabsTrigger>
                            <TabsTrigger value="C3">C3</TabsTrigger>
                            <TabsTrigger value="C4">C4</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div
                        className={cn(
                            "overflow-x-auto min-h-[8.11in]",
                            width > 630 &&
                                "data-[sidebarstate=expanded]:[@media(max-width:1162px)]:max-w-2xl data-[sidebarstate=expanded]:[@media(max-width:810px)]:max-w-xl",
                            width > 630 &&
                                "data-[sidebarstate=collapsed]:[@media(max-width:1020px)]:max-w-2xl data-[sidebarstate=collapsed]:[@media(max-width:810px)]:max-w-xl",
                            width <= 630 && "max-w-[91vw]",
                            width <= 500 && "max-w-[91vw]",
                            width <= 490 && "max-w-[85vw]"
                        )}
                        data-sidebarstate={state}
                    >
                        <PDSPDF userid={user?.id} tab={pdsTab} />
                    </div>
                </TabsContent>

                <TabsContent
                    value="ls"
                    className="w-full py-4 max-sm:px-0 [@media(max-width:456px)]:px-0"
                >
                    <Card className="min-h-[28rem] relative">
                        <TableHeader style={{ gridTemplateColumns: srcolumns }}>
                            <div>Purpose of Travel</div>
                            <div className="[@media(max-width:456px)]:!hidden">
                                Type
                            </div>
                            <div className="max-sm:!hidden">Date of Filing</div>
                            <div></div>
                        </TableHeader>
                        {locatorslip.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center pointer-events-none">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={emptyData}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded locator slip.
                                </div>
                            </div>
                        )}

                        {locatorslip?.map((data, index) => (
                            <TableRow
                                style={{ gridTemplateColumns: srcolumns }}
                                key={index}
                                className="cursor-pointer py-1"
                                onClick={() => router.get(route('general-search.view.ls.view', [data.id]), {}, { onBefore: () => setProcess(true)})}
                            >
                                <div className="line-clamp-1">
                                    {data?.purposeoftravel}
                                </div>
                                <div
                                    className={cn(
                                        "[@media(max-width:456px)]:!hidden"
                                    )}
                                >
                                    {data?.type === 'business' ? 'Official Business' : 'Official Time'}
                                </div>
                                <div className="max-sm:!hidden">
                                    {format(data?.dateoffiling, "MMMM dd, y")}
                                </div>
                                <Button className="ml-auto" variant={"link"}>
                                    <Eye />
                                </Button>
                            </TableRow>
                        ))}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const DetailsCard = ({
    label,
    value,
    valueClass,
}: {
    label: string;
    value: string;
    valueClass?: string;
}) => {
    return (
        <div>
            <TypographySmall className="font-semibold">{label}</TypographySmall>

            <div className={cn(valueClass)}>{value}</div>
        </div>
    );
};

export default ViewSearched;
