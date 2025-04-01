import {
    ClassAssumptionDetailsList,
    CLASSASSUMPTIONTYPE,
} from "@/Pages/ClassAssumption/type";
import React from "react";
import { Card } from "@/Components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import emptyData from "@/Assets/empty-file.svg";
import { Fragment } from "react";
import { Button } from "@/Components/ui/button";
import { Eye } from "iconsax-react";
import { Deferred, router } from "@inertiajs/react";
import TypographySmall from "@/Components/Typography";
import { TableHeader, TableRow } from "@/Components/Header";
import useWindowSize from "@/Hooks/useWindowResize";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";

type Props = {
    classassumption: Omit<
        CLASSASSUMPTIONTYPE,
        "principal" | "curriculumhead" | "academichead"
    >[];
};

const PersonnelClassAssumption: React.FC<Props> = ({ classassumption }) => {
    const { setProcess } = useProcessIndicator();

    const columns = `1fr 10rem`;

    return (
        <TabsContent value="ca" className="w-full mx-auto">
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
                        {classassumption?.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center pointer-events-none">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={emptyData}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded class assumption.
                                </div>
                            </div>
                        )}

                        <TableHeader style={{ gridTemplateColumns: columns }}>
                            <div>Type</div>
                            <div></div>
                        </TableHeader>

                        {classassumption?.map((data, index) => (
                            <TableRow
                                style={{ gridTemplateColumns: columns }}
                                key={index}
                                className="cursor-pointer py-1"
                                onClick={() =>
                                    router.get(
                                        route("personnel.archive.ca.view", [
                                            data.id,
                                        ]),
                                        {},
                                        { onBefore: () => setProcess(true) }
                                    )
                                }
                            >
                                <div className="line-clamp-1">
                                    {["slothers", "obothers"].includes(
                                        data.details.details.type
                                    ) ? (
                                        <span>
                                            Others:{" "}
                                            {data.details.details.others}
                                        </span>
                                    ) : (
                                        ClassAssumptionDetailsList[
                                            data.details.details.catype
                                        ][
                                            data.details.details
                                                .type as keyof (typeof ClassAssumptionDetailsList)[typeof data.details.details.catype]
                                        ]
                                    )}
                                </div>
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

export default PersonnelClassAssumption;
