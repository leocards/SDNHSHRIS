import { TableHeader, TableRow } from "@/Components/Header";
import { Loader } from "@/Components/TableDataSkeletonLoader";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { TabsContent } from "@/Components/ui/tabs";
import { toNumber } from "@/Pages/Myreports/SALN/type";
import { Deferred } from "@inertiajs/react";
import React, { useState } from "react";
import empty from "@/Assets/empty-file.svg";
import { SALNREPORTTYPE } from "@/Pages/Myreports/SALN/SALN";
import { User } from "@/Types";

const Columns = ["5rem", "1fr", "1fr", "1fr", "1fr", "6rem"];

type Props = {
    user: Pick<User, 'position'> & { tin: string };
    saln: Omit<SALNREPORTTYPE, 'user'>[]
}

const PersonnelSALN = ({ user, saln }:Props) => {

    return (
        <TabsContent value="saln">
            <Card className="mt-5">
                <Deferred
                    data="saln"
                    fallback={
                        <div className="flex flex-col items-center gap-4 mx-auto mt-5">
                            <div className="loading loading-spinner loading-md"></div>
                            <TypographySmall>
                                Please wait a moment...
                            </TypographySmall>
                        </div>
                    }
                >
                    <div className="overflow-y-auto grow relative min-h-[30rem] max-h-[38rem] grid grid-rows-[auto,1fr]">
                        <TableHeader
                            style={{
                                gridTemplateColumns: Columns.join(" "),
                            }}
                            className="text-[15px]"
                        >
                            <div className="justify-center">As of</div>
                            <div className="justify-center">TIN</div>
                            <div className="justify-center">Position</div>
                            <div className="justify-center">Networth</div>
                            <div className="justify-center text-center">
                                Name of Spouse/Employer/Address
                            </div>
                            <div className="justify-center">Joint Filing</div>
                        </TableHeader>
                        {saln?.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={empty}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded saln.
                                </div>
                            </div>
                        )}
                        <div>
                            {saln?.map((item, index) => (
                                <TableRow
                                    key={index}
                                    style={{
                                        gridTemplateColumns: Columns.join(" "),
                                    }}
                                >
                                    <div className="uppercase justify-center">
                                        {item?.year}
                                    </div>
                                    <div className="justify-center">
                                        {user.tin}
                                    </div>
                                    <div className="justify-center">
                                        {user.position}
                                    </div>
                                    <div className="justify-center text-center">
                                        &#8369;{" "}
                                        {Number(
                                            toNumber(item?.details.networth)
                                        ).toLocaleString()}
                                    </div>
                                    <div className="justify-center">
                                        <div className="line-clamp-1">
                                            {item?.details?.spouse}
                                        </div>
                                    </div>
                                    <div className="justify-center">
                                        {item?.details?.filing == "joint"
                                            ? "/"
                                            : ""}
                                    </div>
                                </TableRow>
                            ))}
                        </div>
                    </div>
                </Deferred>
            </Card>
        </TabsContent>
    );
};

export default PersonnelSALN;
