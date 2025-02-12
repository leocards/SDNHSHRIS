import { LeaveViewProps } from "@/Pages/Leave/LeaveView";
import LeavePDF from "@/Pages/Leave/PDF/LeavePDF";
import React, { useRef } from "react";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";

type Props = LeaveViewProps;

const PersonnelLeaveView: React.FC<Props> = ({
    leave,
    hr,
    principal,
    applicant,
}) => {
    const contentRef = useRef<HTMLDivElement | null>(null);

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
    );
};

export default PersonnelLeaveView;
