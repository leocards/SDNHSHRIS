import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { usePage } from "@inertiajs/react";
import empty from "@/Assets/empty-graph.svg";
import { GENDERPROPORTIONTYPE } from "./type";

type Props = {
    gender: GENDERPROPORTIONTYPE
}

const GenderDemographic = ({
    gender
}: Props) => {
    const {schoolyear, auth: { user: { role } }} = usePage().props

    const chartData = [
        { month: "PT1", male: gender.PT1.male, female: gender.PT1.female },
        { month: "PT2", male: gender.PT2.male, female: gender.PT2.female },
        { month: "PT3", male: gender.PT3.male, female: gender.PT3.female },
    ];

    const chartConfig = {
        male: {
            label: "Male",
            color: "hsl(var(--chart-1))",
        },
        female: {
            label: "Female",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    if(role != "hr") return null

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Personnel Gender Proportion</CardTitle>
                {schoolyear && <CardDescription>School Year {schoolyear.schoolyear}</CardDescription>}
            </CardHeader>
            <CardContent className="ri ng grow relative grid">
                {!gender ? <div className="p-2 overflow-y-auto relative">
                    <div className="flex flex-col items-center absolute inset-0 justify-center">
                        <img className="size-24 opacity-40 dark:opacity-65" src={empty} />
                        <div className="text-sm font-medium text-foreground/50">No available data to visualize.</div>
                    </div>
                </div> : (
                    <ChartContainer config={chartConfig} className="my-auto h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar
                                dataKey="male"
                                fill="hsl(var(--chart-1))"
                                radius={4}
                            />
                            <Bar
                                dataKey="female"
                                fill="hsl(var(--chart-2))"
                                radius={4}
                            />
                            <ChartLegend
                                content={<ChartLegendContent className="text-sm" />}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Personnel Types
                </div>
                <div className="leading-none flex flex-wrap gap-2">
                    <div className="text-muted-foreground"><span className="font-medium text-foreground">PT1</span> - JHS/SHS</div>
                    <div className="text-muted-foreground"><span className="font-medium text-foreground">PT2</span> - Accounting</div>
                    <div className="text-muted-foreground"><span className="font-medium text-foreground">PT3</span> - Principal</div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default GenderDemographic;
