import Header from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { ArrowRight2, Dislike, Like1, Printer } from "iconsax-react";
import { Fragment, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { SALNTPRINTYPE } from "@/Pages/SALN/Types/type";
import SALNPage1 from "@/Pages/SALN/Print/SALNPage1";
import SALNPage2 from "@/Pages/SALN/Print/SALNPage2";
import SALNSeparatePage from "@/Pages/SALN/Print/SALNSeparatePage";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { router } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { useToast } from "@/Hooks/use-toast";
import { cn } from "@/Lib/utils";
import { useSidebar } from "@/Components/ui/sidebar";

type Props = SALNTPRINTYPE & {};

const ViewSaln = ({ pages, saln, declarant, spouse, address, user }: Props) => {
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef,
        bodyClass: "margin-0",
    });

    const { setProcess } = useProcessIndicator();
    const { toast } = useToast();
    const { state } = useSidebar();

    const onResponse = (action: "approved" | "disapproved") => {
        if (!user?.status_updated_at)
            router.post(
                route("myapproval.saln.approval", [saln.id]),
                {
                    action,
                },
                {
                    onBefore: () => setProcess(true),
                    onSuccess: (page) => {
                        toast({
                            title: page.props.flash.title,
                            description: page.props.flash.message,
                            status: page.props.flash.status,
                        });
                    },
                }
            );
    };

    return (
        <div className="">
            <Header title="SALN View">
                <div className="flex items-center gap-1">
                    SALN <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    View
                </div>
            </Header>

            <div className="flex items-center w-full my-5">
                <Button
                    className=""
                    variant="outline"
                    onClick={() => handlePrint()}
                >
                    <Printer /> <span>Print</span>
                </Button>

                <div
                    className={cn(
                        {
                            pending: "text-amber-600",
                            approved: "text-green-600",
                            disapproved: "text-destructive",
                        }[saln?.status],
                        "capitalize ml-auto"
                    )}
                >
                    {saln?.status}
                </div>
            </div>

            <div
                className={cn(
                    "overflow-x-auto mx-auto flex flex-col p-4 bg-gray-200 dark:bg-zinc-800 rounded-md",
                    state === "expanded"
                        ? "max-w-[18rem] [@media(min-width:436px)_and_(max-width:718px)]:max-w-sm [@media(min-width:556px)_and_(max-width:718px)]:max-w-lg [@media(min-width:718px)_and_(max-width:768px)]:max-w-2xl [@media(min-width:769px)_and_(max-width:815px)]:max-w-sm [@media(min-width:815px)_and_(max-width:979px)]:max-w-lg [@media(min-width:980px)_and_(max-width:1149px)]:max-w-2xl [@media(min-width:1150px)]:max-w-4xl"
                        : "max-w-[18rem] [@media(min-width:427px)_and_(max-width:569px)]:max-w-sm [@media(min-width:570px)_and_(max-width:779px)]:max-w-lg [@media(min-width:780px)_and_(max-width:957px)]:max-w-2xl [@media(min-width:958px)]:max-w-full"
                )}
                style={{
                    scrollbarColor:
                        "hsl(var(--foreground)) transparent !important",
                }}
            >
                <div
                    ref={contentRef}
                    className="space-y-3 print:space-y-0 mx-auto"
                >
                    {pages.map((page, index) =>
                        index === 0 ? (
                            <Fragment key={index}>
                                <SALNPage1
                                    pagecount={{
                                        page: 1,
                                        totalPage: pages?.length + 1,
                                    }}
                                    saln={saln}
                                    declarant={declarant}
                                    page={page}
                                    spouse={spouse}
                                    user={user}
                                    address={address}
                                />
                                <SALNPage2
                                    pagecount={{
                                        page: 2,
                                        totalPage: pages.length + 1,
                                    }}
                                    saln={saln}
                                    declarant={declarant}
                                    page={page}
                                    spouse={spouse}
                                    address={address}
                                />
                            </Fragment>
                        ) : (
                            <SALNSeparatePage
                                pagecount={{
                                    page: index + 2,
                                    totalPage: pages.length + 1,
                                }}
                                saln={saln}
                                declarant={declarant}
                                page={page}
                                spouse={spouse}
                                user={user}
                                address={address}
                            />
                        )
                    )}
                </div>
            </div>

            <div className="flex gap-4 sm:justify-end mt-7 border-t border-border pt-4 pb-10 [&>div]:max-sm:w-full">
                {saln?.status === "pending" && !user?.status_updated_at && (
                    <>
                        <TooltipLabel label="Approve">
                            <Button
                                className="bg-green-600 hover:bg-green-500 max-sm:w-full"
                                onClick={() => onResponse("approved")}
                            >
                                <Like1 />
                                <div>Approve</div>
                            </Button>
                        </TooltipLabel>

                        <TooltipLabel label="Disapprove">
                            <Button
                                className="bg-destructive hover:bg-destructive/85 max-sm:w-full"
                                onClick={() => onResponse("disapproved")}
                            >
                                <Dislike />
                                <div>Disapprove</div>
                            </Button>
                        </TooltipLabel>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewSaln;
