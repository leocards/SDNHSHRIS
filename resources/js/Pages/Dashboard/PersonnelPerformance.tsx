import { ProfilePhoto } from "@/Components/ui/avatar";
import { Card, CardContent } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { usePage } from "@inertiajs/react";
import { OUTSTANDINGPERSONNEL } from "./type";

type Props = {
    performance: OUTSTANDINGPERSONNEL
}

const PersonnelPerformance = ({ performance }: Props) => {
    const {
        schoolyear,
        auth: {
            user: { role },
        },
    } = usePage().props;

    if (role != "hr") return null;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4 flex overflow-hidden h-[calc(27rem-1rem)]">
                <Tabs
                    defaultValue="outstanding"
                    className="overflow-hidden grow flex flex-col"
                >
                    <TabsList className="w-fit">
                        <TabsTrigger value="outstanding">
                            Outstanding
                        </TabsTrigger>
                        <TabsTrigger value="leastperforming">
                            Least Performing
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="outstanding"
                        className="overflow-y-auto space-y-1.5 overscroll-contain"
                    >
                        {performance?.outstanding?.map((rating, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ProfilePhoto
                                        className="size-9"
                                        fallbackSize={14}
                                    />
                                    <div>{rating?.name}</div>
                                </div>
                                <div className="px-2">{rating?.ratings}</div>
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent
                        value="leastperforming"
                        className="overflow-y-auto space-y-1.5 overscroll-contain"
                    >
                        {performance?.leastperforming?.map((rating, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ProfilePhoto
                                        className="size-9"
                                        fallbackSize={14}
                                    />
                                    <div>{rating?.name}</div>
                                </div>
                                <div className="px-2">{rating?.ratings??"0"}</div>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default PersonnelPerformance;
