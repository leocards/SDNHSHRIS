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

export type LeaveViewProps = {
    leave: APPLICATIONFORLEAVETYPES;
    hr: string;
    applicant: {full_name: string; } & Pick<User, "role">
    principal: PRINCIPAL;
};

const LeaveView: React.FC<LeaveViewProps> = ({ leave, hr, principal, applicant }) => {
    const role = usePage().props.auth.user.role;
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

    return (
        <div>
            <Header title="View Leave Application">
                <div className="flex items-center gap-1">
                    Leave <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    View Leave Application
                </div>
            </Header>

            <div className="flex flex-row-reverse items-center gap-3 my-5 border-b pb-3 mt-7">
                <HrComponents>
                    {leave.hrstatus !== "pending" && (
                        <div
                            className={cn(
                                {
                                    pending: "text-amber-600",
                                    approved: "text-green-600",
                                    disapproved: "text-destructive",
                                }[leave?.hrstatus],
                                "Capitalize"
                            )}
                        >
                            {leave?.hrstatus}
                        </div>
                    )}
                </HrComponents>

                <PrincipalComponents>
                    {leave.principalstatus !== "pending" && (
                        <div
                            className={cn(
                                {
                                    pending: "text-amber-600",
                                    approved: "text-green-600",
                                    disapproved: "text-destructive",
                                }[leave?.principalstatus],
                                "Capitalize"
                            )}
                        >
                            {leave?.principalstatus}
                        </div>
                    )}
                </PrincipalComponents>

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
                            // disabled={getResponse(leave)}
                            onClick={() => {
                                // if (
                                //     leave.hrstatus === "approved" &&
                                //     leave.principalstatus === "approved"
                                // )
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

            <div className="overflow-hidden overflow-x-auto h-auto py-2">
                <div className="mx-auto border overflow-hidden w-[790px] flex gap-2">
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
        leave?.principalstatus !== "approved" ||
        leave?.principalstatus !== "approved"
    );
};

export default LeaveView;
