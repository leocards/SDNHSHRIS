import { Card } from "@/Components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import emptyData from "@/Assets/empty-file.svg";
import { Fragment, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Eye } from "iconsax-react";
import ViewCertificate from "@/Pages/ServiceRecord/ViewCertificate";
import { Deferred, router } from "@inertiajs/react";
import TypographySmall from "@/Components/Typography";
import { TableHeader, TableRow } from "@/Components/Header";
import { cn } from "@/Lib/utils";
import { format } from "date-fns";
import useWindowSize from "@/Hooks/useWindowResize";
import { LOCATORSLIPTYPE } from "@/Pages/LocatorSlip/LocatorSlip";
import { User } from "@/Types";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";

type Props = {
    locatorslip: Array<LOCATORSLIPTYPE & {
            principal: User
        }>
};

const PersonnelLocatorSlip: React.FC<Props> = ({ locatorslip }) => {
    const { setProcess } = useProcessIndicator();
    const [viewCertificate, setViewCertificate] = useState(false);
    const { width } = useWindowSize()

    const columns = `1fr ${width <= 456 ? '' : '8rem'} ${width <= 640 ? '' : '10rem'} 4rem`;

    return (
        <TabsContent
            value="ls"
            className="w-full mx-auto"
        >
            <Card className="min-h-[28rem] relative mt-5">
                <Deferred
                    data="certificates"
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
                        {locatorslip?.length === 0 && (
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

                        <TableHeader style={{ gridTemplateColumns: columns }}>
                            <div>Pupose of Travel</div>
                            <div className="[@media(max-width:456px)]:!hidden">Type</div>
                            <div className="max-sm:!hidden">Date modified</div>
                            <div></div>
                        </TableHeader>

                        {locatorslip?.map((data, index) => (
                            <TableRow
                                style={{ gridTemplateColumns: columns }}
                                key={index}
                                className="cursor-pointer py-1"
                                onClick={() => router.get(route('personnel.archive.view.ls.view', [data.id]), {}, { onBefore: () => setProcess(true)})}
                            >
                                <div className="line-clamp-1">
                                    {data?.purposeoftravel}
                                </div>
                                <div
                                    className={cn("[@media(max-width:456px)]:!hidden"
                                    )}
                                >
                                    {data?.type === 'business' ? 'Official Business' : 'Official Time'}
                                </div>
                                <div className="max-sm:!hidden">{format(data?.dateoffiling, "MMMM dd, y")}</div>
                                <Button className="ml-auto" variant={"link"}>
                                    <Eye />
                                </Button>
                            </TableRow>
                        ))}
                    </Fragment>
                </Deferred>
            </Card>
        </TabsContent>
    );
};

export default PersonnelLocatorSlip;
