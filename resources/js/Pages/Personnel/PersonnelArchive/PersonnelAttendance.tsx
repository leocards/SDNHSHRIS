import { TableHeader, TableRow } from "@/Components/Header";
import { Card } from "@/Components/ui/card";
import { TabsContent } from "@/Components/ui/tabs";
import { Deferred } from "@inertiajs/react";
import empty from "@/Assets/empty-tardiness.svg";
import TypographySmall from "@/Components/Typography";
import { TARDINESSTYPE } from "@/Pages/Tardiness/Tardiness";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { format } from "date-fns";

type Props = {
    tardinesses?: { [key: string]: Array<TARDINESSTYPE> };
};

const PersonnelAttendance: React.FC<Props> = ({ tardinesses }) => {
    const getAttendanceForTheMonth = (
        month: string,
        value: Array<TARDINESSTYPE>
    ) => {
        return value.find((t) => t.month === month);
    };

    return (
        <TabsContent value="tardiness" className="max-w-5xl mx-auto w-full p-4">
            <Deferred
                data="tardinesses"
                fallback={
                    <div className="flex flex-col items-center gap-4 mx-auto mt-5">
                        <div className="loading loading-spinner loading-md"></div>
                        <TypographySmall>
                            Please wait a moment...
                        </TypographySmall>
                    </div>
                }
            >
                <Card className="min-h-[28rem] relative">
                    <Accordion type="single" collapsible className="w-full">
                        {Object.entries(tardinesses ?? {}).map(
                            ([key, value]) => (
                                <AccordionItem value={key}  key={key}>
                                    <AccordionTrigger className="px-4">
                                        School Year {key}
                                    </AccordionTrigger>
                                    <AccordionContent className="group-data-[state=open]/accordion:border-border border-transparent border-t">
                                        <TableHeader
                                            style={{
                                                gridTemplateColumns: Array(5).fill(0).map(() => "1fr").join(' '),
                                            }}
                                            className="bg-accent/40"
                                        >
                                            <div className="justify-center">
                                                Month
                                            </div>
                                            <div className="justify-center">
                                                No. of Days Present
                                            </div>
                                            <div className="justify-center">
                                                No. of Days Absent
                                            </div>
                                            <div className="justify-center">
                                                No. of Time Tardy
                                            </div>
                                            <div className="justify-center">
                                                No. of Undertime
                                            </div>
                                        </TableHeader>
                                        {Array.from({ length: 12 }).map(
                                            (_, index) => {
                                                const tardiness =
                                                    getAttendanceForTheMonth(
                                                        format(
                                                            new Date(
                                                                2024,
                                                                index,
                                                                1
                                                            ),
                                                            "MMMM"
                                                        ),
                                                        value
                                                    );

                                                return (
                                                    <div key={index} className="grid grid-cols-5 [&>div]:py-2 [&>div:not(:first-child)]:text-center hover:bg-secondary">
                                                        <div className="pl-3">
                                                            {format(
                                                                new Date(
                                                                    2024,
                                                                    index,
                                                                    1
                                                                ),
                                                                "MMMM"
                                                            )}
                                                        </div>
                                                        <div className="justify-center">
                                                            {tardiness?.present ?? (
                                                                <span className="text-foreground/30">
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="justify-center">
                                                            {tardiness?.absent ?? (
                                                                <span className="text-foreground/30">
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="justify-center">
                                                            {tardiness?.timetardy ?? (
                                                                <span className="text-foreground/30">
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="justify-center">
                                                            {tardiness?.undertime ?? (
                                                                <span className="text-foreground/30">
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        )}
                    </Accordion>

                    {Object.keys(tardinesses ?? {}).length === 0 && (
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
            </Deferred>
        </TabsContent>
    );
};

export default PersonnelAttendance;
