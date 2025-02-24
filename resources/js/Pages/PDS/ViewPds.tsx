import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import PDSPDF from "./PDF/PDSPDF";
import { Fragment, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PDSTABSTYPE } from "@/Types/types";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { DocumentDownload } from "iconsax-react";
import { APPROVALTYPE } from "@/Types";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { useToast } from "@/Hooks/use-toast";
import TypographySmall from "@/Components/Typography";
import { cn } from "@/Lib/utils";
import { router } from "@inertiajs/react";
import { Margin, usePDF } from "react-to-pdf";

type Props = ModalProps & {
    userid: number | null;
};

const ViewPds: React.FC<Props> = ({ userid, show, onClose }) => {
    const { toast } = useToast();
    const { setProcess } = useProcessIndicator();
    const [isLoading, setIsLoading] = useState(false);
    const [tab, setTab] = useState<PDSTABSTYPE>("C1");
    const [status, setStatus] = useState<APPROVALTYPE>("pending");

    const download_pdf = usePDF({
                method: "save",
                filename: "application-for-leave.pdf",
                page: { format: "A4", margin: Margin.MEDIUM },
            });

    const onRespond = (reponse: APPROVALTYPE) => {
        router.post(
            route("pds.response", [userid]),
            {
                reponse: reponse,
            },
            {
                onBefore: () => setProcess(true),
                onSuccess: (page) => {
                    toast({
                        title: page.props.flash.title,
                        description: page.props.flash.message,
                        status: page.props.flash.status,
                    });

                    if (page.props.flash.status === "success") {
                        setStatus(reponse);
                        onClose(false);
                    }
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="5xl" closeable={false}>
            <div className="flex items-center">
                <Button
                    className="ml-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => onClose(false)}
                >
                    <X />
                </Button>
            </div>

            <div className="flex items-center gap-4 mx-auto w-fit">
                <Tabs
                    defaultValue={tab}
                    className="overflow-hidden rounded-md grow flex flex-col my-5"
                    onValueChange={(value) => setTab(value as PDSTABSTYPE)}
                >
                    <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 [&>button_span]:max-w-44 [&>button]:text-left [&>button]:!justify-start [&>button_span]:line-clamp-1 [&>button_span]:!whitespace-normal bg-primary/15 text-primary/60">
                        <TabsTrigger value="C1">C1</TabsTrigger>
                        <TabsTrigger value="C2">C2</TabsTrigger>
                        <TabsTrigger value="C3">C3</TabsTrigger>
                        <TabsTrigger value="C4">C4</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="pointer-events-none select-none">|</div>
                <TooltipLabel label="Download">
                    <Button
                        className="ml-auto"
                        variant="outline"
                        size="icon"
                        disabled={status !== "approved" || isLoading}
                        onClick={() => {
                            if(status === "approved" || !isLoading)
                                download_pdf.toPDF();
                        }}
                    >
                        <DocumentDownload className="" />
                    </Button>
                </TooltipLabel>
            </div>

            <div className="mx-auto w-fit">
                <PDSPDF
                    ref={download_pdf.targetRef}
                    userid={userid}
                    tab={tab}
                    onStatus={setStatus}
                    onLoad={setIsLoading}
                />
            </div>

            <div className="flex mt-5 justify-end">
                {!isLoading ? (
                    status == "pending" ? (
                        <Fragment>
                            <Button
                                className="bg-green-600 hover:bg-green-500"
                                onClick={() => onRespond("approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                className="ml-3 bg-destructive hover:bg-destructive/85"
                                onClick={() => onRespond("disapproved")}
                            >
                                Disapprove
                            </Button>
                        </Fragment>
                    ) : (
                        <TypographySmall
                            className={cn(
                                "capitalize",
                                status == "approved"
                                    ? "text-green-600"
                                    : "text-destructive"
                            )}
                        >
                            {status}
                        </TypographySmall>
                    )
                ) : null}
            </div>
        </Modal>
    );
};

export default ViewPds;
