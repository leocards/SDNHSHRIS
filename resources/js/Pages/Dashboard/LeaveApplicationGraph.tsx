import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { usePage } from "@inertiajs/react";
import empty from "@/Assets/empty-graph.svg";
import { LEAVEAPPLICATIONS } from "./type";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { FilterButton, FilterItem } from "@/Components/ui/menubar";
import { useEffect, useMemo, useState } from "react";
import { SCHOOLYEAR } from "@/Types";
import { LEAVETYPEKEYSARRAY, LEAVETYPESOBJ } from "../Leave/Types/leavetypes";

type Props = {
    leave: LEAVEAPPLICATIONS;
    schoolyears: SCHOOLYEAR[];
};

const LeaveApplicationGraph = ({ leave, schoolyears }: Props) => {
    const { schoolyear, auth } = usePage().props;
    const role = auth.user.role;

    if (role !== "hr") return null;

    const [leavegraph, setLeavegraph] = useState<LEAVEAPPLICATIONS | null>(
        leave
    );
    const [filter, setFilter] = useState<string>(schoolyear?.schoolyear ?? "");
    const [loading, setLoading] = useState(false);

    const Leaves = useMemo(() => {
        if (leave?.appliedleaves) {
            const appliedLeaves = LEAVETYPEKEYSARRAY.filter((l) =>
                leave?.appliedleaves.some((ap) => ap.type == l)
            );

            const leaveData = appliedLeaves.map((type, index) => ({
                type: `L${index + 1}`,
                approved: 0,
                disapproved: 0,
            }));

            const updateLeaveData = (
                leaveArray: Props["leave"]["approved"],
                isRejected: boolean = false
            ) => {
                leaveArray.forEach(({ total }: any, index: number) => {
                    if (index !== -1) {
                        leaveData[index][
                            isRejected ? "disapproved" : "approved"
                        ] += total;
                    } else {
                        leaveData[LEAVETYPEKEYSARRAY.length - 1][
                            isRejected ? "disapproved" : "approved"
                        ] += total;
                    }
                });
            };

            updateLeaveData(leave.approved);
            updateLeaveData(leave.disapproved, true);

            return leaveData;
        } else {
            return [];
        }
    }, [leave]);

    const chartConfig = {
        approved: {
            label: "Approved",
            color: "hsl(var(--chart-1))",
        },
        disapproved: {
            label: "Disapproved",
            color: "hsl(var(--chart-1))",
        }
    } satisfies ChartConfig;

    useEffect(() => {
        if (filter !== schoolyear?.schoolyear) {
            const sy = schoolyears.find((sy) => sy.schoolyear === filter);

            setLoading(true);
            window.axios
                .get(route("", [sy?.id]))
                .then((response) => {
                    const data = response.data;

                    setLeavegraph(data);
                })
                .finally(() => setLoading(false));
        } else {
            setLeavegraph(leave);
        }
    }, [filter]);

    return (
        <Card className="min-h-[29rem] relative grid grid-rows-[auto,1fr]">
            {loading && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 p-1.5 px-3 rounded bg-primary text-primary-foreground">
                    Loading...
                </div>
            )}
            <CardHeader className="flex space-y-0 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="">
                        <CardTitle>Leave Applications</CardTitle>
                        <CardDescription>
                            Showing total applications of SY{" "}
                            {schoolyear?.schoolyear}
                        </CardDescription>
                    </div>

                    <FilterButton
                        isDirty={filter != schoolyear?.schoolyear}
                        filter={filter}
                        onClearFilter={() => {
                            setFilter(schoolyear?.schoolyear ?? "");
                        }}
                    >
                        {schoolyears.map((sy, index) => (
                            <FilterItem
                                value={sy?.schoolyear}
                                key={index}
                                onClick={setFilter}
                            >
                                {sy?.schoolyear}
                            </FilterItem>
                        ))}
                    </FilterButton>
                </div>
            </CardHeader>
            <CardContent className="p-2 overflow-y-auto relative">
                {!leavegraph ? (
                    <div className="flex flex-col items-center absolute inset-0 justify-center">
                        <img
                            className="size-24 opacity-40 dark:opacity-65"
                            src={empty}
                        />
                        <div className="text-sm font-medium text-foreground/50">
                            No available data to visualize.
                        </div>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[300px] w-full"
                    >
                        <BarChart
                            className=""
                            accessibilityLayer
                            data={Leaves}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="type"
                                tickLine={false}
                                tickMargin={15}
                                axisLine={false}
                                className="font-medium"
                            />
                            <YAxis
                                width={30}
                                className="font-medium text-[10px]"
                            />

                            <Bar dataKey="approved" fill="#84cc16" radius={3}>
                                <LabelList
                                    position="insideTop"
                                    offset={8}
                                    valueAccessor={(val: any) => {
                                        if (val.value != 0) return val.value;
                                    }}
                                    className="fill-[#3f6212]"
                                    fontSize={12}
                                />
                            </Bar>
                            <Bar dataKey="disapproved" fill="#ec4899" radius={3}>
                                <LabelList
                                    position="insideTop"
                                    offset={8}
                                    valueAccessor={(val: any) => {
                                        if (val.value != 0) return val.value;
                                    }}
                                    className="fill-[#831843]"
                                    fontSize={12}
                                />
                            </Bar>
                            <ChartLegend
                                content={
                                    <ChartLegendContent className="text-sm" />
                                }
                            />
                        </BarChart>
                        {/* <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="approved"
                                fill="var(--color-desktop)"
                                radius={8}
                            >
                                <LabelList
                                    position="insideTop"
                                    offset={8}
                                    className="fill-primary-foreground"
                                    fontSize={12}
                                    valueAccessor={(val: any) => {
                                        if (val.value != 0) return val.value;
                                    }}
                                />
                            </Bar>
                        </BarChart> */}
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="border-t p-2">
                {[...leave.appliedleaves].map((leave, index) => (
                    <div key={index} className="flex items-center text-sm m-1 border p-1 px-1.5 rounded shadow-sm">
                        <div className="min-w-8 font-semibold">L{1 + index} - </div>
                        <div className="">{LEAVETYPESOBJ[leave.type]}</div>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
};

export default LeaveApplicationGraph;
