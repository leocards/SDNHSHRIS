import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { TabsContent } from "@/Components/ui/tabs";
import { Deferred } from "@inertiajs/react";
import { Back, Eye } from "iconsax-react";
import React, { Fragment, useState } from "react";
import PersonnelLeaveView from "./PersonnelLeaveView";
import { LeaveViewProps } from "@/Pages/Leave/LeaveView";
import {
    LEAVETYPEKEYSARRAY,
    LEAVETYPESOBJ,
} from "@/Pages/Leave/Types/leavetypes";
import emptyData from "@/Assets/empty-file.svg";

type Props = {
    leaves: Array<{
        id: number;
        user_id: number;
        type: (typeof LEAVETYPEKEYSARRAY)[number];
    }>;
};

const PersonnelLeave: React.FC<Props> = ({ leaves }) => {
    const [leaveData, setLeaveData] = useState<LeaveViewProps | null>(null);
    const [loading, setLoading] = useState(false);

    const onViewLeave = async (leaveId: number) => {
        setLoading(true);

        let response = await window.axios.get<LeaveViewProps>(
            route("personnel.archive.leave.view", [leaveId])
        );
        let data = response.data;
        setLeaveData(data);
        setLoading(false);
    };

    return (
        <TabsContent
            value="leave"
            className="sm:max-w-4xl mx-auto sm:min-w-[35rem] w-full"
        >
            <Deferred
                data="leaves"
                fallback={
                    <div className="flex flex-col items-center gap-4 mx-auto mt-5">
                        <div className="loading loading-spinner loading-md"></div>
                        <TypographySmall>
                            Please wait a moment...
                        </TypographySmall>
                    </div>
                }
            >
                <Fragment>
                    {loading ? (
                        <div className="flex flex-col items-center gap-4 mx-auto mt-5">
                            <div className="loading loading-spinner loading-md"></div>
                            <TypographySmall>
                                Please wait a moment...
                            </TypographySmall>
                        </div>
                    ) : leaveData ? (
                        <Fragment>
                            <Button
                                variant="outline"
                                className="my-5"
                                onClick={() => setLeaveData(null)}
                            >
                                <Back />
                                <div>Back</div>
                            </Button>
                            <PersonnelLeaveView
                                leave={leaveData?.leave}
                                hr={leaveData?.hr}
                                applicant={leaveData?.applicant}
                                principal={leaveData?.principal}
                            />
                        </Fragment>
                    ) : (
                        <Card className="min-h-[28rem] p-2 space-y-1 mt-5 relative">
                            {leaves?.length === 0 && (
                                <div className="flex flex-col items-center absolute inset-0 justify-center pointer-events-none">
                                    <img
                                        className="size-24 opacity-40 dark:opacity-65"
                                        src={emptyData}
                                    />
                                    <div className="text-sm font-medium text-foreground/50 mt-1">
                                        No recorded leave application.
                                    </div>
                                </div>
                            )}
                            {leaves?.map((leave, index) => (
                                <div
                                    key={index}
                                    className="hover:bg-secondary p-3 py-1 border border-border rounded-md flex items-center shadow-sm"
                                    role="button"
                                    onClick={() => onViewLeave(leave.id)}
                                >
                                    <div className="line-clamp-1">
                                        {LEAVETYPESOBJ[leave?.type]}
                                    </div>
                                    <Button
                                        className="ml-auto"
                                        variant={"link"}
                                    >
                                        <Eye />
                                    </Button>
                                </div>
                            ))}
                        </Card>
                    )}
                </Fragment>
            </Deferred>
        </TabsContent>
    );
};

export default PersonnelLeave;
