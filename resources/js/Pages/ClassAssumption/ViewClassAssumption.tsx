import React, { useRef, useState } from "react";
import PDFClassAssumption from "./PDF/PDFClassAssumption";
import Header from "@/Components/Header";
import { CLASSASSUMPTIONTYPE } from "./type";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Back, Dislike, Like1, Printer } from "iconsax-react";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";
import { cn } from "@/Lib/utils";
import { router, usePage } from "@inertiajs/react";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { APPROVALTYPE } from "@/Types";
import ConfirmApproval from "./ConfirmApproval";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";

type ViewClassAssumptionProps = {
    ca: CLASSASSUMPTIONTYPE;
};

const ViewClassAssumption: React.FC<ViewClassAssumptionProps> = ({ ca }) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { width } = useWindowSize();
    const { state, isMobile } = useSidebar();
    const { role } = usePage().props.auth.user
    const url = usePage().url
    const { setProcess } = useProcessIndicator()

    const [verdict, setVerdict] = useState<'approved'|'disapproved'>('approved')
    const [showConfirmation, setShowConfirmation] = useState(false)

    const handlePrint = useReactToPrint({
        contentRef,
    });

    const onRedirectTo = () => {
            if(url.startsWith('/general-search') || url.startsWith('/personnel/personnel-archive'))
            {
                let routeTo = ''
                if (url.startsWith("/general-search")) {
                    routeTo = route("general-search.view", {
                        user: ca.user.id,
                        _query: {
                            tab: "ca",
                        },
                    });
                } else if (url.startsWith("/personnel/personnel-archive")) {
                    routeTo = route("personnel.archive.view", {
                        userId: ca.user.id,
                        _query: {
                            tab: "ca",
                        },
                    });
                }
                router.get(
                    routeTo,
                    {},
                    {
                        onBefore: () => setProcess(true),
                    }
                );
            }
        }

    return (
        <div>
            <Header
                title="View Class Assumption"
                children="View Class Assumption"
            />

            {(url.startsWith('/general-search') || url.startsWith('/personnel/personnel-archive')) && (<div className="mt-5">
                <Button onClick={onRedirectTo}>
                    <Back />
                    <span>Back</span>
                </Button>
            </div>)}

            <div className="flex items-center mt-10 border-b border-border pb-3">
                <Button
                    variant="outline"
                    onClick={() => {
                        if (ca.status == "approved") handlePrint();
                    }}
                    disabled={ca.status == "pending"}
                >
                    <Printer />
                    <span>Print</span>
                </Button>

                <div
                    className={cn(
                        "capitalize ml-auto",
                        {
                            pending: "text-amber-600",
                            approved: "text-green-600",
                            disapproved: "text-destructive",
                        }[ca.status],
                    )}
                >{ca.status}</div>
            </div>

            <div
                className={cn(
                    "overflow-y-auto mx-auto p-4",
                    width <= 1150 &&
                        width >= 971 &&
                        (state === "expanded" || !isMobile) &&
                        "max-w-2xl",
                    width <= 970 &&
                        width >= 876 &&
                        (state === "expanded" || !isMobile) &&
                        "max-w-xl",
                    width <= 875 &&
                        width >= 769 &&
                        (state === "expanded" || !isMobile) &&
                        "max-w-md",
                    width <= 900 &&
                        width >= 789 &&
                        (state === "collapsed" || isMobile) &&
                        "max-w-2xl",
                    width <= 788 &&
                        width >= 621 &&
                        (state === "collapsed" || isMobile) &&
                        "max-w-lg",
                    width <= 620 &&
                        width >= 495 &&
                        (state === "collapsed" || isMobile) &&
                        "max-w-md",
                    width <= 494 &&
                        width >= 1 &&
                        (state === "collapsed" || isMobile) &&
                        "max-w-[22rem]"
                )}
            >
                <div className="mx-auto w-fit border">
                    <PDFClassAssumption ca={ca} ref={contentRef} />
                </div>
            </div>

            {(role === "principal" && ca.status === "pending") && (
                <div className="flex gap-4 justify-end mt-7 border-t border-border pt-4 pb-10">
                    <TooltipLabel label="Approve">
                        <Button
                            className="bg-green-600 hover:bg-green-500"
                            onClick={() => {
                                setVerdict("approved");
                                setShowConfirmation(true);
                            }}
                        >
                            <Like1 />
                            <div>Approve</div>
                        </Button>
                    </TooltipLabel>

                    <TooltipLabel label="Disapprove">
                        <Button
                            className="bg-destructive hover:bg-destructive/85"
                            onClick={() => {
                                setVerdict("disapproved");
                                setShowConfirmation(true);
                            }}
                        >
                            <Dislike />
                            <div>Disapprove</div>
                        </Button>
                    </TooltipLabel>
                </div>
            )}

            <ConfirmApproval approval={verdict} id={ca.id} show={showConfirmation} onClose={setShowConfirmation} type={ca.details.details.catype} user={ca.user}  />
        </div>
    );
};

export default ViewClassAssumption;
