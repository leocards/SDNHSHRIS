import { APPROVALTYPE, User } from "@/Types";
import PDFLocatorSlip from "./PDFLocatorSlip";
import Header from "@/Components/Header";
import { LOCATORSLIPTYPE } from "./LocatorSlip";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { Button } from "@/Components/ui/button";
import { Back, Dislike, Eye, Like1, Printer } from "iconsax-react";
import { cn } from "@/Lib/utils";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import ViewMemo from "./ViewMemo";
import ConfirmApproval from "../Myapproval/LocatorSlip/ConfirmApproval";
import { router, usePage } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";

type ViewLocatorSliptProps = {
    locatorslip: LOCATORSLIPTYPE & {
        principal: User
    };
};

const ViewLocatorSlipt: React.FC<ViewLocatorSliptProps> = ({ locatorslip }) => {
    const url = usePage().url
    const { role } = usePage().props.auth.user
    const { setProcess } = useProcessIndicator()
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [showMemo, setShowMemo] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [verdict, setVerdict] = useState<'approved'|'disapproved'>('approved')

    const { width } = useWindowSize()
    const { state, isMobile } = useSidebar()

    const onRedirectTo = () => {
        if(url.startsWith('/general-search') || url.startsWith('/personnel/personnel-archive'))
        {
            let routeTo = ''
            if (url.startsWith("/general-search")) {
                routeTo = route("general-search.view", {
                    user: locatorslip.user.id,
                    _query: {
                        tab: "ls",
                    },
                });
            } else if (url.startsWith("/personnel/personnel-archive")) {
                routeTo = route("personnel.archive.view", {
                    userId: locatorslip.user.id,
                    _query: {
                        tab: "ls",
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

    const handlePrint = useReactToPrint({
            contentRef,
        });

    return (
        <div className="">
            <Header title="View Locator Slip" children="View Locator Slip" />

            {(url.startsWith('/general-search') || url.startsWith('/personnel/personnel-archive')) && (<div className="mt-10">
                <Button onClick={onRedirectTo}>
                    <Back />
                    <span>Back</span>
                </Button>
            </div>)}

            <div className={cn("flex items-center mt-10 border-b border-border pb-3", url.startsWith('/general-search') ? 'mt-5' : 'mt-10')}>
                <Button variant="outline" onClick={() => {
                    if(locatorslip.status === 'approved')
                        handlePrint()
                }} disabled={locatorslip.status === 'pending'}>
                    <Printer />
                    <span>Print</span>
                </Button>

                <Button variant="outline" onClick={() => {
                    if(locatorslip.type !== 'time')
                        setShowMemo(true)
                }} className="ml-4" disabled={locatorslip.type === 'time'}>
                    <Eye />
                    <span>View Memo</span>
                </Button>

                <div
                    className={cn(
                        "capitalize ml-auto",
                        {
                            pending: "text-amber-600",
                            approved: "text-green-600",
                            disapproved: "text-destructive",
                        }[locatorslip.status],
                    )}
                >{locatorslip.status}</div>
            </div>

            <div className={cn(
                "overflow-y-auto mx-auto",
                ((width <= 1091 && width >= 971) && (state === 'expanded' || !isMobile)) && "max-w-2xl",
                ((width <= 970 && width >= 876) && (state === 'expanded' || !isMobile)) && "max-w-xl",
                ((width <= 875 && width >= 769) && (state === 'expanded' || !isMobile)) && "max-w-md",
                ((width <= 900 && width >= 789) && (state === 'collapsed' || isMobile)) && "max-w-2xl",
                ((width <= 788 && width >= 621) && (state === 'collapsed' || isMobile)) && "max-w-lg",
                ((width <= 620 && width >= 495) && (state === 'collapsed' || isMobile)) && "max-w-md",
                ((width <= 494 && width >= 1) && (state === 'collapsed' || isMobile)) && "max-w-[22rem]",
            )}>
                <div className="my-10 mx-auto border w-fit">
                    <PDFLocatorSlip locatorslip={locatorslip} ref={contentRef} />
                </div>
            </div>

            {(role === 'principal' && locatorslip.status === 'pending') && (<div className="flex gap-4 justify-end mt-7 border-t border-border pt-4 pb-10">
                <TooltipLabel label="Approve">
                    <Button
                        className="bg-green-600 hover:bg-green-500"
                        onClick={() => {
                            setVerdict('approved')
                            setShowConfirmation(true)
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
                            setVerdict('disapproved')
                            setShowConfirmation(true)
                        }}
                    >
                        <Dislike />
                        <div>Disapprove</div>
                    </Button>
                </TooltipLabel>
            </div>)}

            <ViewMemo show={showMemo} onClose={setShowMemo} src={locatorslip.memo??''} />
            {!(url.startsWith('/general-search') && url.startsWith('/personnel/personnel-archive')) && <ConfirmApproval show={showConfirmation} onClose={setShowConfirmation} approval={verdict} user={locatorslip.user} id={locatorslip.id} />}
        </div>
    );
};

export default ViewLocatorSlipt;
