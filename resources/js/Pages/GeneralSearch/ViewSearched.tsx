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
import { ChevronLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { useMessage } from "@/Components/Provider/message-provider";

type Props = {
    user: User;
    leavecount: number;
    attendances: any[];
    certificates: any[];
};

const ViewSearched: React.FC<Props> = ({
    user,
    leavecount,
    attendances,
    certificates,
}) => {
    const [selectedCertificate, setSelectedCertificate] = useState(0);
    const [viewCertificate, setViewCertificate] = useState(false);
    const [pdsTab, setPdsTab] = useState<PDSTABSTYPE>("C1");
    const { setProcess } = useProcessIndicator();
    const { selectConversation } = useMessage();

    return (
        <div>
            <Header title="General Search" />

            <Button
                className=""
                variant="outline"
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
                <ChevronLeft /> Back
            </Button>

            <Tabs
                className="overflow-hidden grow flex flex-col my-5"
                defaultValue="details"
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="tardiness">Attendance</TabsTrigger>
                    <TabsTrigger value="sr">Certificates</TabsTrigger>
                    <TabsTrigger value="pds">PDS</TabsTrigger>
                </TabsList>

                <TabsContent
                    value="details"
                    className="p-4 max-w-3xl mx-auto w-full"
                >
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center w-60 shrink-0 gap-3">
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

                            <div className="mt-4">
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
                        <Card className="p-4 w-full space-y-4">
                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    User Role:
                                </TypographySmall>

                                <TypographySmall className="font-normal capitalize">
                                    {user?.role}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Gender:
                                </TypographySmall>

                                <TypographySmall className="font-normal capitalize">
                                    {user?.gender}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Date of Birth:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {format(user?.birthday, "MMMM dd, y")}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Email:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {user?.email}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Mobile no.:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {user?.mobilenumber}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Staff ID:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {user?.personnelid}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Date Hired:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {format(user?.hiredate, 'MMMM, d y')}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-start">
                                <TypographySmall className="w-24">
                                    Department:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {Departments[user?.department]}
                                </TypographySmall>
                            </div>

                            <div className="flex gap-3 items-center">
                                <TypographySmall className="w-24 !leading-5">
                                    Approved Leave:
                                </TypographySmall>

                                <TypographySmall className="font-normal">
                                    {leavecount ?? "0"}
                                </TypographySmall>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent
                    value="tardiness"
                    className="max-w-5xl mx-auto w-full p-4"
                >
                    <Card className="min-h-[28rem] relative">
                        <TableHeader className="grid grid-cols-5">
                            <div>School Year</div>
                            <div>No. of Days Present</div>
                            <div>No. of Days Absent</div>
                            <div>No. of Time Tardy</div>
                            <div>No. of Undertime</div>
                        </TableHeader>
                        {attendances.map((att, index) => (
                            <TableRow key={index} className="grid grid-cols-5">
                                <div>{att?.schoolyear?.schoolyear}</div>
                                <div>{att?.present}</div>
                                <div>{att?.absent}</div>
                                <div>{att?.timetardy}</div>
                                <div>{att?.undertime}</div>
                            </TableRow>
                        ))}
                        {attendances.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center">
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
                    className="max-w-3xl mx-auto w-full p-4"
                >
                    <Card className="min-h-[28rem] relative p-2 space-y-1">
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
                            <div
                                key={index}
                                className="hover:bg-secondary p-4 py-2 border border-border rounded-md flex items-center shadow-sm"
                                role="button"
                                onClick={() => {
                                    setSelectedCertificate(data.id);
                                    setViewCertificate(true);
                                }}
                            >
                                <div className="line-clamp-1">
                                    {data?.details?.name}
                                </div>
                                <Button className="ml-auto" variant={"link"}>
                                    <Eye />
                                </Button>
                            </div>
                        ))}

                        <ViewCertificate
                            srid={selectedCertificate}
                            show={viewCertificate}
                            onClose={setViewCertificate}
                        />
                    </Card>
                </TabsContent>

                <TabsContent value="pds" className="w-fit mx-auto">
                    <Tabs
                        defaultValue={pdsTab}
                        className="overflow-hidden rounded-md grow flex flex-col my-4 mb-2 mx-auto w-fit"
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

                    <PDSPDF userid={user?.id} tab={pdsTab} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ViewSearched;
