import { Card } from "@/Components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import emptyData from "@/Assets/empty-file.svg";
import { Fragment, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Eye } from "iconsax-react";
import ViewCertificate from "@/Pages/ServiceRecord/ViewCertificate";
import { Deferred } from "@inertiajs/react";
import TypographySmall from "@/Components/Typography";
import { TableHeader, TableRow } from "@/Components/Header";
import { cn } from "@/Lib/utils";
import { format } from "date-fns";

type Props = {
    certificates: any[];
};

const PersonnelServiceRecords: React.FC<Props> = ({ certificates }) => {
    const [selectedCertificate, setSelectedCertificate] = useState(0);
    const [viewCertificate, setViewCertificate] = useState(false);

    const columns = ["1fr", "10rem", "10rem", "4rem"].join(" ");

    return (
        <TabsContent
            value="sr"
            className="max-w-4xl min-w-[35rem] w-full mx-auto"
        >
            <Card className="min-h-[28rem] relative p-2 space-y-1 mt-5">
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
                        {certificates?.length === 0 && (
                            <div className="flex flex-col items-center absolute inset-0 justify-center pointer-events-none">
                                <img
                                    className="size-24 opacity-40 dark:opacity-65"
                                    src={emptyData}
                                />
                                <div className="text-sm font-medium text-foreground/50 mt-1">
                                    No recorded certificates.
                                </div>
                            </div>
                        )}

                        <TableHeader style={{ gridTemplateColumns: columns }}>
                            <div>Certificate Name</div>
                            <div>Type</div>
                            <div>Date modified</div>
                            <div></div>
                        </TableHeader>

                        {certificates?.map((data, index) => (
                            <TableRow
                                style={{ gridTemplateColumns: columns }}
                                key={index}
                                className="hover:bg-secondary border border-border rounded-md shadow-sm cursor-pointer"
                                onClick={() => {
                                    setSelectedCertificate(data?.id);
                                    setViewCertificate(true);
                                }}
                            >
                                <div className="line-clamp-1">
                                    {data?.details?.name ?? "N/A"}
                                </div>
                                <div
                                    className={cn(
                                        data?.type === "coc"
                                            ? "uppercase"
                                            : "capitalize"
                                    )}
                                >
                                    {data?.type}
                                </div>
                                <div>{format(data?.updated_at, "MMMM dd, y")}</div>
                                <Button className="ml-auto" variant={"link"}>
                                    <Eye />
                                </Button>
                            </TableRow>
                        ))}
                    </Fragment>
                </Deferred>

                <ViewCertificate
                    srid={selectedCertificate}
                    show={viewCertificate}
                    onClose={setViewCertificate}
                    isInactive
                />
            </Card>
        </TabsContent>
    );
};

export default PersonnelServiceRecords;
