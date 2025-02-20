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

type Props = SALNTPRINTYPE & {};

const ViewSaln = ({ pages, saln, declarant, spouse, address, user }: Props) => {
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef,
        bodyClass: "margin-0",
    });

    const { setProcess } = useProcessIndicator();
    const { toast } = useToast();

    const onResponse = (action: "approved" | "disapproved") => {
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
        <div>
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

                <div className={cn({
                    pending: "text-amber-600",
                    approved: "text-green-600",
                    disapproved: "text-destructive",
                }[saln?.status], "capitalize ml-auto")}>{saln?.status}</div>
            </div>

            <div className="overflow-y-auto rounded-scrollbar flex flex-col items-center p-4 bg-gray-200 rounded-md">
                <div ref={contentRef} className="space-y-3 print:space-y-0">
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

            <div className="flex gap-4 justify-end mt-7 border-t border-border pt-4 pb-10">
                {saln?.status === "pending" && (
                    <>
                        <TooltipLabel label="Approve">
                            <Button
                                className="bg-green-600 hover:bg-green-500"
                                onClick={() => onResponse("approved")}
                            >
                                <Like1 />
                                <div>Approve</div>
                            </Button>
                        </TooltipLabel>

                        <TooltipLabel label="Disapprove">
                            <Button
                                className="bg-destructive hover:bg-destructive/85"
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
