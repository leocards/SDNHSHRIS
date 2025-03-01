import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall, {
    TypographyLarge,
    TypographyStatus,
} from "@/Components/Typography";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { router, usePage } from "@inertiajs/react";
import { Dislike, Like1, Maximize3 } from "iconsax-react";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { CERTIFICATEAPPROVALTYPE } from "./ServiceRecord";
import { createPortal } from "react-dom";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { formatDateRange } from "@/Types/types";
import { useToast } from "@/Hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { User } from "@/Types";
import { cn } from "@/Lib/utils";

type ViewCertificateProps = ModalProps & {
    srid: number | null;
    isInactive?: boolean;
};

const ViewCertificate: React.FC<ViewCertificateProps> = ({
    srid,
    show,
    isInactive,
    onClose,
}) => {
    const role = usePage().props.auth.user.role;
    const [maximize, setMaximize] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const { setProcess } = useProcessIndicator();
    const { toast } = useToast();

    const onRespond = async (response: CERTIFICATEAPPROVALTYPE) => {
        if (role == "hr") {
            router.post(
                route("myapproval.sr.respond", [srid]),
                {
                    response,
                },
                {
                    async: true,
                    onBefore: () => setProcess(true),
                    onSuccess: (page: any) => {
                        toast({
                            title: page.props.flash.title,
                            description: page.props.flash.message,
                            status: page.props.flash.status,
                        });

                        if (page.props.flash.status == "success")
                            onClose(false);
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (srid && show) {
            (async () => {
                try {
                    setLoading(true);
                    const response = await window.axios.get(
                        route(
                            role === "hr" ? "myapproval.sr.view" : "sr.view",
                            [srid ?? 0]
                        )
                    );

                    setData(response.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={
                "View " + (data && data.type === "coc" ? "COC" : "Certificate")
            }
        >
            <Button
                variant="outline"
                size="icon"
                className="size-8 absolute top-4 right-6"
                onClick={() => onClose(false)}
            >
                <X />
            </Button>

            {loading ? (
                <div className="flex flex-col items-center gap-4 mx-auto">
                    <div className="loading loading-spinner loading-md"></div>
                    <TypographySmall>Please wait a moment...</TypographySmall>
                </div>
            ) : (
                data && (
                    <Fragment>
                        {data?.type === "coc" ? (
                            <COCImages
                                details={data?.details}
                                user={data?.user}
                            />
                        ) : (
                            <Fragment>
                                <ImageViewer
                                    user={data?.user}
                                    name={data?.details?.name}
                                    path={data?.details?.path}
                                    filename={data?.details?.filename}
                                />

                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <TypographySmall
                                            className=""
                                            children="Date:"
                                        />
                                        <div className="text-sm">
                                            {formatDateRange({
                                                from: data?.details?.from,
                                                to: data?.details?.to,
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TypographySmall
                                            className=""
                                            children="Venue:"
                                        />
                                        <div className="text-sm">
                                            {data?.details?.venue}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TypographySmall
                                            className=""
                                            children="Organizer:"
                                        />
                                        <div className="text-sm">
                                            {data?.details?.organizer}
                                        </div>
                                    </div>
                                    <div className="flex [@media(max-width:456px)]:flex-col [@media(min-width:456px)]:items-center">
                                        <TypographySmall
                                            className=""
                                            children="Credits:"
                                        />
                                        <div className="flex gap-5 ml-4">
                                            <div className="flex items-center gap-3">
                                                <TypographySmall
                                                    className=""
                                                    children="Earned:"
                                                />
                                                <div className="text-sm">
                                                    {data?.details?.credits}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <TypographySmall
                                                    className=""
                                                    children="Unused:"
                                                />
                                                <div className="text-sm">
                                                    {
                                                        data?.details
                                                            ?.remainingcredits
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TypographySmall
                                            className=""
                                            children="Status:"
                                        />
                                        <TypographyStatus
                                            status={data?.status}
                                            children={data?.status}
                                            className="capitalize"
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        )}

                        {(role == "hr" && data?.status === "pending" && !isInactive) && (
                            <div className="flex items-center justify-end gap-2 mt-5">
                                <Button
                                    className="bg-green-600 hover:bg-green-500 max-sm:w-full"
                                    onClick={() => onRespond("approved")}
                                >
                                    <Like1 />
                                    Approve
                                </Button>
                                <Button
                                    className="sm:ml-3 bg-destructive hover:bg-destructive/85 max-sm:w-full"
                                    onClick={() => onRespond("invalid")}
                                >
                                    <Dislike />
                                    Invalid
                                </Button>
                            </div>
                        )}
                    </Fragment>
                )
            )}
        </Modal>
    );
};

export const COCImages = ({
    user,
    details,
}: {
    user: Pick<User, "name" | "avatar">;
    details: any;
}) => {
    return (
        <div>
            <Tabs defaultValue="coa">
                <TabsList>
                    <TabsTrigger value="coa">
                        <span className="[@media(min-width:456px)]:hidden">COA</span>
                        <span className="[@media(max-width:456px)]:hidden">Certificate of Attendance</span>
                    </TabsTrigger>
                    <TabsTrigger value="dtr">DTR</TabsTrigger>
                    <TabsTrigger value="memo">MEMO</TabsTrigger>
                </TabsList>
                <TabsContent value="coa">
                    <ImageViewer
                        user={user}
                        name={details?.name}
                        path={details?.coa}
                        filename={details?.coa}
                    />
                </TabsContent>
                <TabsContent value="dtr">
                    <ImageViewer
                        user={user}
                        name={details?.name}
                        path={details?.dtr}
                        filename={details?.dtr}
                    />
                </TabsContent>
                <TabsContent value="memo">
                    <ImageViewer
                        user={user}
                        name={details?.name}
                        path={details?.memo}
                        filename={details?.memo}
                    />
                </TabsContent>
            </Tabs>

            <div className="mt-2 space-y-1">
                <div className="flex items-center gap-3">
                    <TypographySmall className="" children="Date:" />
                    <div className="text-sm">
                        {formatDateRange({
                            from: details?.from,
                            to: details?.to,
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <TypographySmall className="" children="Number of hours:" />
                    <div className="text-sm">{details?.numofhours}</div>
                </div>
                <div className="flex [@media(max-width:456px)]:flex-col [@media(min-width:456px)]:items-center">
                    <TypographySmall className="" children="Credits:" />
                    <div className="flex gap-5 ml-4">
                        <div className="flex items-center gap-3">
                            <TypographySmall className="" children="Earned:" />
                            <div className="text-sm">{details?.credits}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TypographySmall className="" children="Unused:" />
                            <div className="text-sm">
                                {details?.remainingcredits}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function getFileType(filename: string): string | null {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || null : null;
}

export const ImageViewer = ({
    name,
    path,
    user,
    filename,
}: {
    name: string;
    path: string;
    user: Pick<User, "name" | "avatar">;
    filename: string;
}) => {
    const role = usePage().props.auth.user.role;
    const [maximize, setMaximize] = useState(false);
    const filetype = getFileType(filename ?? "") ?? "jpg";

    return (
        <div>
            {filetype != "pdf" && (
                <div className="border border-border rounded-md overflow-hidden relative h-[18rem] lg:h-[21rem] bg-black/5 flex">
                    <div className="absolute top-0 right-0 w-full p-3 bg-gradient-to-b from-black/70 flex">
                        {role == "hr" && (
                            <div className="flex items-center gap-3">
                                <ProfilePhoto
                                    className="size-8 shadow"
                                    src={user?.avatar}
                                />
                                <TypographySmall className="text-primary-foreground">
                                    {user?.name}
                                </TypographySmall>
                            </div>
                        )}

                        <TooltipLabel label="Maximize" className="ml-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8 ml-auto"
                                onClick={() => setMaximize(true)}
                            >
                                <Maximize3 />
                            </Button>
                        </TooltipLabel>
                    </div>

                    <img
                        src={path}
                        className="object-contain mx-auto my-auto size-full"
                    />

                    <div className="absolute bottom-0 left-0 w-full p-3">
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black opacit z-10"></div>
                        <TypographyLarge className="relative z-10 line-clamp-2 text-primary-foreground">
                            {name}
                        </TypographyLarge>
                    </div>
                </div>
            )}

            {filetype == "pdf" && (
                <div className="border border-border rounded-md overflow-hidden relative h-[21rem] bg-black/5 flex">
                    <div className="absolute top-0 right-0 w-full p-3 bg-gradient-to-b from-black/90 flex">
                        {role == "hr" && (
                            <div className="flex items-center gap-3">
                                <ProfilePhoto
                                    className="size-8 shadow"
                                    src={user?.avatar}
                                />
                                <TypographySmall className="text-primary-foreground">
                                    {user?.name}
                                </TypographySmall>
                            </div>
                        )}

                        <TooltipLabel label="Maximize" className="ml-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8 ml-auto"
                                onClick={() => setMaximize(true)}
                            >
                                <Maximize3 />
                            </Button>
                        </TooltipLabel>
                    </div>
                    <embed
                        src={path + "#toolbar=0&navpanes=0&scrollbar=0"}
                        className="w-full"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-3">
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black opacit z-10"></div>
                        <TypographyLarge className="relative z-10 line-clamp-2 text-primary-foreground">
                            {name}
                        </TypographyLarge>
                    </div>
                </div>
            )}

            {maximize &&
                createPortal(
                    <div className="fixed top-0 left-0 size-full inline-flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-[100] max-lg:px-4">
                        <div className={cn("w-full lg:w-[55rem] bg-black /40 relative rounded-lg p-3 flex", filetype == "pdf" ? "h-[calc(100vh-14rem)] lg:h-[calc(100vh-10rem)]" : "min-h-[20rem] lg:h-[calc(100vh-10rem)]")}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8 absolute top-3 lg:top-0 right-3 lg:-right-10 max-lg:shadow-md"
                                onClick={() => setMaximize(false)}
                            >
                                <X />
                            </Button>

                            {filetype !== "pdf" ? (
                                <img
                                    src={path}
                                    className="object-contain size-full m-auto rounded-lg"
                                />
                            ) : (
                                <embed
                                    src={
                                        path +
                                        "#toolbar=0&navpanes=0&scrollbar=0"
                                    }
                                    className="w-full"
                                />
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default ViewCertificate;
