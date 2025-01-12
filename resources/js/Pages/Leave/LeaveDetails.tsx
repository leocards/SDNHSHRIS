import Modal, { ModalProps } from "@/Components/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { APPLICATIONFORLEAVETYPES } from "./PDF/type";
import TypographySmall from "@/Components/Typography";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/Lib/utils";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { Maximize3 } from "iconsax-react";
import { createPortal } from "react-dom";

type Props = ModalProps & {
    response: Pick<
        APPLICATIONFORLEAVETYPES,
        | "principalstatus"
        | "principaldisapprovedmsg"
        | "hrstatus"
        | "hrdisapprovedmsg"
        | "type"
        | "avatar"
        | "firstname"
        | "lastname"
        | "medical"
    >;
};

const LeaveDetails = ({ response, show, onClose }: Props) => {
    const role = usePage().props.auth.user.role;
    const [maximize, setMaximize] = useState(false);

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Application for Leave Details"
        >
            <Button
                className="absolute top-4 right-4"
                size="icon"
                variant="outline"
                onClick={() => onClose(false)}
            >
                <X />
            </Button>
            <Tabs defaultValue="response">
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger
                        value="medical"
                        disabled={
                            response?.type !== "sick" &&
                            response?.type !== "maternity"
                        }
                    >
                        Medical
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="response"
                    className="py-3 space-y-3 min-h-52"
                >
                    <div className="border border-border rounded-md p-4">
                        <div className="flex items-center">
                            <TypographySmall>
                                Principal's response
                            </TypographySmall>

                            <div className="ml-auto flex items-center">
                                <TypographySmall
                                    className={cn(
                                        "capitalize",
                                        {
                                            pending: "text-amber-600",
                                            approved: "text-green-600",
                                            disapproved: "text-destructive",
                                        }[
                                            response?.principalstatus ??
                                                "pending"
                                        ]
                                    )}
                                >
                                    {response?.principalstatus ?? "Pending"}
                                </TypographySmall>
                                <div className="ml-3">
                                    <ChevronDown className="size-4" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-2.5 rounded-md text-sm bg-secondary space-y-2">
                            <div className="">Disapproved message</div>
                            <div className="italic">
                                {response?.principaldisapprovedmsg ??
                                    "No message"}
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-md p-4">
                        <div className="flex items-center">
                            <TypographySmall>HR's response</TypographySmall>

                            <div className="ml-auto flex items-center">
                                <TypographySmall
                                    className={cn(
                                        "capitalize",
                                        {
                                            pending: "text-amber-600",
                                            approved: "text-green-600",
                                            disapproved: "text-destructive",
                                        }[response?.hrstatus ?? "pending"]
                                    )}
                                >
                                    {response?.hrstatus ?? "Pending"}
                                </TypographySmall>
                                <div className="ml-3">
                                    <ChevronDown className="size-4" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-2.5 rounded-md text-sm bg-secondary space-y-2">
                            <div className="">Disapproved message</div>
                            <div className="italic">
                                {response?.hrdisapprovedmsg ?? "No message"}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="medical" className="min-h-52">
                    <div className="border border-border rounded-md overflow-hidden relative h-[21rem] bg-black/5">
                        <div className="absolute top-0 right-0 w-full p-3 bg-gradient-to-b from-black/70 flex">
                            {role == "hr" && (
                                <div className="flex items-center gap-3">
                                    <ProfilePhoto className="size-8 shadow" />
                                    <TypographySmall className="text-primary-foreground">
                                        {(response?.firstname??"") +
                                            " " +
                                            (response?.lastname??"")}
                                    </TypographySmall>
                                </div>
                            )}

                            <TooltipLabel label="Maximize" className="ml-auto">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8 ml-auto"
                                    onClick={() => response?.medical && setMaximize(true)}
                                    disabled={!response?.medical}
                                >
                                    <Maximize3 />
                                </Button>
                            </TooltipLabel>
                        </div>

                        <img src={response?.medical ?? ""} />

                        {!response?.medical && (
                            <div className="mx-auto w-fit relative top-1/2 -translate-y-1/2">No medical</div>
                        )}
                    </div>

                    {maximize &&
                        createPortal(
                            <div className="fixed top-0 left-0 size-full inline-flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-[100]">
                                <div className="w-[55rem] h-[calc(100vh-10rem)] bg-black/40 relative">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8 absolute top-0 -right-10"
                                        onClick={() => setMaximize(false)}
                                    >
                                        <X />
                                    </Button>

                                    <img
                                        src={response?.medical??""}
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>,
                            document.body
                        )}
                </TabsContent>
            </Tabs>
        </Modal>
    );
};

export default LeaveDetails;
