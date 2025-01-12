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
import { PERSONNELPERFORMANCETYPE } from "./type";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

type Props = {
    performance: PERSONNELPERFORMANCETYPE[];
};

const YearlyPerformanceGraph = ({ performance }: Props) => {
    const {
        auth: {
            user: { role },
        },
    } = usePage().props;

    if (role === "hr") return null;

    const chartData = performance && performance.length > 0 ? performance : [];

    const chartConfig = {
        rating: {
            label: "Ratings",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <Card className="min-h-[28rem] relative grid grid-rows-[auto,1fr]">
            <CardHeader className="flex space-y-0 border-b border-border">
                <div className="">
                    <CardTitle>Yearly Performance</CardTitle>
                    <CardDescription>
                        Showing the performance ratings for the last 7 school
                        years
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-2 overflow-y-auto relative">
                {performance.length === 0 ? (
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
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickCount={3}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <defs>
                                <linearGradient
                                    id="fillRating"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--chart-1))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--chart-1))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="rating"
                                type="natural"
                                fill="url(#fillRating)"
                                fillOpacity={0.4}
                                stroke="hsl(var(--chart-1))"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
            {performance.length !== 0 && (
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                School Year/s{" "}
                                {performance &&
                                    (performance?.length >= 2
                                        ? `${performance[0].sy} - ${
                                              performance[
                                                  performance.length - 1
                                              ].sy
                                          }`
                                        : performance?.length == 1 &&
                                          performance[0].sy)}
                            </div>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default YearlyPerformanceGraph;
