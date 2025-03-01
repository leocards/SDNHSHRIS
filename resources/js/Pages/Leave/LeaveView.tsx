import Header from "@/Components/Header";
import React, { Fragment, PropsWithChildren, useRef, useState } from "react";
import { APPLICATIONFORLEAVETYPES, PRINCIPAL } from "./PDF/type";
import {
    ArrowRight2,
    Dislike,
    DocumentUpload,
    InfoCircle,
    Like1,
    Printer,
} from "iconsax-react";
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { Download } from "lucide-react";
import LeaveDetails from "./LeaveDetails";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import LeavePDF from "./PDF/LeavePDF";
import SubmitMedical from "./SubmitMedical";
import { cn } from "@/Lib/utils";
import LeaveResponse from "../Myapproval/Leave/LeaveResponse";
import { User } from "@/Types";
import { useSidebar } from "@/Components/ui/sidebar";

export type LeaveViewProps = {
    leave: APPLICATIONFORLEAVETYPES;
    hr: string;
    applicant: { full_name: string } & Pick<User, "role">;
    principal: PRINCIPAL;
};

const LeaveView: React.FC<LeaveViewProps> = ({
    leave,
    hr,
    principal,
    applicant,
}) => {
    const role = usePage().props.auth.user.role;
    const {state} = useSidebar()
    const [viewDetails, setViewDetails] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [uploadMedical, setUploadMedical] = useState(false);
    const [respond, setRespond] = useState<"approved" | "disapproved" | null>(
        null
    );
    const [showRespond, setShowRespond] = useState<boolean>(false);

    const { targetRef } = usePDF({
        method: "open",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });
    const download_pdf = usePDF({
        method: "save",
        filename: "application-for-leave.pdf",
        page: { format: "A4", margin: Margin.MEDIUM },
    });

    const handlePrint = useReactToPrint({
        contentRef,
    });

    const LeaveStatus = role === "principal" || role === "hr" ? leave.hrstatus : leave.principalstatus

    return (
        <div className="overflow-hidden relative">
            <Header title="View Leave Application">
                <div className="flex items-center gap-1">
                    Leave <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    View Leave Application
                </div>
            </Header>

            <div className="flex flex-row-reverse items-center gap-3 my-5 border-b pb-3 mt-7">
                <div
                    className={cn(
                        {
                            pending: "text-amber-600",
                            approved: "text-green-600",
                            disapproved: "text-destructive",
                        }[LeaveStatus],
                        "capitalize"
                    )}
                >
                    {LeaveStatus}
                </div>

                <div className="mr-auto flex flex-row-reverse items-center gap-3">
                    <TooltipLabel label="Print">
                        <Button
                            className=""
                            size="icon"
                            variant="outline"
                            disabled={getResponse(leave)}
                            onClick={() => {
                                if (
                                    leave.hrstatus === "approved" &&
                                    leave.principalstatus === "approved"
                                )
                                    handlePrint();
                            }}
                        >
                            <Printer />
                        </Button>
                    </TooltipLabel>

                    <TooltipLabel label="Download">
                        <Button
                            className=""
                            size="icon"
                            variant="outline"
                            disabled={getResponse(leave)}
                            onClick={() => {
                                if (
                                    leave.hrstatus === "approved" &&
                                    leave.principalstatus === "approved"
                                )
                                    download_pdf.toPDF();
                            }}
                        >
                            <Download />
                        </Button>
                    </TooltipLabel>

                    <div className="border-r border-border h-7" />

                    {role !== "hr" && role !== "principal" && (
                        <TooltipLabel label="Upload Medical">
                            <Button
                                className=""
                                size="icon"
                                variant="outline"
                                disabled={leave?.type !== "sick"}
                                onClick={() => setUploadMedical(true)}
                            >
                                <DocumentUpload />
                            </Button>
                        </TooltipLabel>
                    )}

                    <TooltipLabel label="Details">
                        <Button
                            className=""
                            size="icon"
                            variant="outline"
                            onClick={() => setViewDetails(true)}
                        >
                            <InfoCircle className="rotate-180" />
                        </Button>
                    </TooltipLabel>
                </div>
            </div>

            <div className={cn("mx-auto relative overflow-x-auto", state == "collapsed" ? "max-w-[18rem] [@media(min-width:430px)_and_(max-width:639px)]:max-w-sm sm:max-w-xl [@media(min-width:910px)]:max-w-4xl" : "[@media(max-width:396px)]:max-w-[18rem] [@media(min-width:397px)_and_(max-width:629px)]:max-w-[22rem] [@media(min-width:630px)_and_(max-width:768px)]:max-w-xl [@media(min-width:768px)_and_(max-width:815px)]:max-w-sm [@media(min-width:816px)_and_(max-width:888px)]:max-w-lg [@media(min-width:889px)_and_(max-width:978px)]:max-w-xl [@media(min-width:978px)_and_(max-width:1094px)]:max-w-2xl [@media(min-width:1095px)]:max-w-4xl")}>
                <div className="mx-auto border w-[790px]">
                    <LeavePDF
                        ref={(ref) => {
                            contentRef.current = ref;
                            targetRef.current = ref;
                        }}
                        leave={leave}
                        hr={hr}
                        principal={
                            principal ?? {
                                name: "No principal",
                                full_name: "No principal",
                                position: "No principal",
                            }
                        }
                        applicant={applicant}
                    />
                </div>
            </div>
            <div className="absolute top-0 -right-[300%]">
                <LeavePDF
                    ref={download_pdf.targetRef}
                    isDownload
                    leave={leave}
                    hr={hr}
                    principal={
                        principal ?? {
                            name: "No principal",
                            full_name: "No principal",
                            position: "No principal",
                        }
                    }
                    applicant={applicant}
                />
            </div>

            <div className="flex gap-4 justify-end mt-7 border-t border-border pt-4 pb-10">
                <HrComponents>
                    {leave.hrstatus === "pending" && (
                        <>
                            <TooltipLabel label="Approve">
                                <Button
                                    className="bg-green-600 hover:bg-green-500"
                                    onClick={() => {
                                        setRespond("approved");
                                        setShowRespond(true);
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
                                        setRespond("disapproved");
                                        setShowRespond(true);
                                    }}
                                >
                                    <Dislike />
                                    <div>Disapprove</div>
                                </Button>
                            </TooltipLabel>
                        </>
                    )}
                </HrComponents>

                <PrincipalComponents>
                    {leave.principalstatus === "pending" && (
                        <>
                            <TooltipLabel label="Approve">
                                <Button
                                    className="bg-green-600 hover:bg-green-500"
                                    onClick={() => {
                                        setRespond("approved");
                                        setShowRespond(true);
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
                                        setRespond("disapproved");
                                        setShowRespond(true);
                                    }}
                                >
                                    <Dislike />
                                    <div>Disapprove</div>
                                </Button>
                            </TooltipLabel>
                        </>
                    )}
                </PrincipalComponents>
            </div>

            <LeaveDetails
                response={leave}
                show={viewDetails}
                onClose={setViewDetails}
            />

            <SubmitMedical
                leave={leave.id}
                show={uploadMedical}
                onClose={setUploadMedical}
            />

            <LeaveResponse
                leave={leave}
                response={respond}
                show={showRespond}
                onClose={setShowRespond}
            />
        </div>
    );
};

const HrComponents: React.FC<PropsWithChildren> = ({ children }) => {
    const role = usePage().props.auth.user.role;
    return role === "hr" && children;
};

const PrincipalComponents: React.FC<PropsWithChildren> = ({ children }) => {
    const role = usePage().props.auth.user.role;
    return role === "principal" && children;
};

const getResponse = (leave: APPLICATIONFORLEAVETYPES) => {
    return (
        leave?.hrstatus !== "approved" &&
        leave?.principalstatus !== "approved"
    );
};

export default LeaveView;
