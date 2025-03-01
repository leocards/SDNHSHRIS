import React, { useMemo, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import { Card } from "@/Components/ui/card";
import { ACTIVELEAVETYPE, getTimeRemains } from "./type";
import { formatDateRange } from "@/Types/types";
import CalendarView from "./CalendarView";
import { Button } from "@/Components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { LEAVETYPESOBJ } from "../Leave/Types/leavetypes";
import { cn } from "@/Lib/utils";

type Props = {
    activeleave: ACTIVELEAVETYPE[];
};

const ActiveLeave = ({ activeleave }: Props) => {
    const [selectedLeave, setSelectedLeave] = useState<ACTIVELEAVETYPE | null>(
        activeleave?.length === 1 ? activeleave[0] : null
    );

    const leaveStatus = useMemo(() => {
        if (selectedLeave) {
            if(!selectedLeave?.from) {
                return 'active'
            }
            return getTimeRemains({
                from: new Date(selectedLeave?.from ?? ""),
                to: selectedLeave?.to ? new Date(selectedLeave?.to ?? "") : undefined,
            });
        }
    }, [selectedLeave]);

    return (
        <Card className="shadow-sm border border-border rounded-lg relative">
            {activeleave.length === 0 && (
                <div className="flex flex-col items-center absolute inset-0 justify-center">
                    <img
                        className="size-24 opacity-40 dark:opacity-65"
                        src={empty}
                    />
                    <div className="text-sm font-medium text-foreground/50 mt-1">
                        No active or upcoming leave.
                    </div>
                </div>
            )}

            {!selectedLeave && activeleave.length > 1 && (
                <div className="h-full p-3 space-y-1">
                    {activeleave.map((leave, index) => (
                        <div
                            className="border h-fit rounded-md p-2 px-3 flex items-center hover:shadow-md transition duration-150 shadow-sm"
                            onClick={() => setSelectedLeave(leave)}
                            role="button"
                            key={index}
                        >
                            <div>
                                <div className="font-medium">{LEAVETYPESOBJ[leave.type]}</div>

                                <div className="text-sm">
                                    {leave.user?.name}
                                </div>
                            </div>
                            <div className="text-sm ml-auto text-right">
                                {leave?.from && formatDateRange({
                                    from: leave?.from ?? "",
                                    to: leave?.to ?? "",
                                })}
                                {leave?.from && getTimeRemains({
                                    from: new Date(leave?.from ?? ""),
                                    to: leave?.to ? new Date(leave?.to ?? "") : undefined,
                                }) == "active" ? (
                                    <div className="text-green-600 text-xs capitalize">
                                        {getTimeRemains({
                                            from: new Date(leave?.from ?? ""),
                                            to: leave?.to ? new Date(leave?.to ?? "") : undefined,
                                        })}
                                    </div>
                                ) : leave?.from && (
                                    <div className="leading-4 text-xs text-foreground/60">
                                        Time remaining:{" "}
                                        {getTimeRemains({
                                            from: new Date(leave?.from ?? ""),
                                            to: leave?.to ? new Date(leave?.to ?? "") : undefined,
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedLeave && (
                <div>
                    <div className="h-14 border-b flex items-center px-3">
                        {activeleave.length > 1 && (
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="size-8 mr-4 shrink-0"
                                onClick={() => setSelectedLeave(null)}
                            >
                                <ChevronLeft className="size-5" />
                            </Button>
                        )}
                        <div className="mr-auto">
                            <Label className="text-lg leading-5 line-clamp-1">
                                {LEAVETYPESOBJ[selectedLeave?.type]}
                            </Label>

                            <div className="text-sm line-clamp-1">
                                {selectedLeave.user?.name}
                            </div>
                        </div>

                        <div className="shrink-0 ml-3 text-right">
                            {selectedLeave?.from && formatDateRange({
                                from: selectedLeave?.from ?? "",
                                to: selectedLeave?.to ?? "",
                            })}
                            {leaveStatus == "active" ? (
                                <div className={cn("text-green-600 capitalize", selectedLeave?.from && "text-xs")}>
                                    {leaveStatus}
                                </div>
                            ) : (
                                <div className={cn("leading-4 text-xs text-foreground/60")}>
                                    Time remaining: {leaveStatus}
                                </div>
                            )}
                        </div>
                    </div>

                    <CalendarView
                        date={{
                            from: selectedLeave?.from ? new Date(selectedLeave?.from ?? "") : new Date(selectedLeave?.updated_at),
                            to: selectedLeave?.to ? new Date(selectedLeave?.to ?? "") : undefined,
                        }}
                    />
                </div>
            )}
        </Card>
    );
};

export default ActiveLeave;
