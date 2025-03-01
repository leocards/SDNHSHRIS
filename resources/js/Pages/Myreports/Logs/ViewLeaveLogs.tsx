import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import LeavePDF from "@/Pages/Leave/PDF/LeavePDF";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";

type Props = ModalProps & {
    leaveid: number | null;
};

const ViewLeaveLogs = ({ leaveid, show, onClose }: Props) => {
    const [leave, setLeave] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (leaveid) {
            setLoading(true);
            window.axios
                .get(route("myapproval.leave.view", [leaveid]))
                .then((response) => {
                    setLeave(response.data);
                })
                .then(() => setLoading(false));
        }
    }, [leaveid]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="fit">
            <div className="w-full flex">
                <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto"
                    onClick={() => onClose()}
                >
                    <X />
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col lg:items-center gap-4 mx-auto py-8 min-w-[790px]">
                    <div className="loading loading-spinner loading-md"></div>
                    <TypographySmall>Please wait a moment...</TypographySmall>
                </div>
            ) : (
                leave && (
                    <Fragment>
                        <div className="overflow-hidden overflow-x-auto h-auto py-2">
                            <div className="mx-auto border overflow-hidden w-[790px] flex gap-2">
                                <LeavePDF
                                    leave={leave?.leave}
                                    hr={leave?.hr}
                                    principal={
                                        leave?.principal ?? {
                                            name: "No principal.",
                                            full_name: "No principal.",
                                            position: "No principal.",
                                        }
                                    }
                                    applicant={leave?.applicant!}
                                />
                            </div>
                        </div>
                    </Fragment>
                )
            )}
        </Modal>
    );
};

export default ViewLeaveLogs;
