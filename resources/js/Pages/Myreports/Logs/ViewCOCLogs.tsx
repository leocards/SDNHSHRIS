import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import LeavePDF from "@/Pages/Leave/PDF/LeavePDF";
import { COCImages } from "@/Pages/ServiceRecord/ViewCertificate";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";

type Props = ModalProps & {
    cocid: number | null;
};

const ViewCOCLogs = ({ cocid, show, onClose }: Props) => {
    const [coc, setCOC] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cocid) {
            setLoading(true);
            window.axios
                .get(route("myreports.logs.coc", [cocid]))
                .then((response) => {
                    setCOC(response.data);
                })
                .then(() => setLoading(false));
        }
    }, [cocid]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="fit">
            <div className="w-full flex mb-3">
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
                <div className="flex flex-col items-center gap-4 mx-auto py-8 min-w-[790px]">
                    <div className="loading loading-spinner loading-md"></div>
                    <TypographySmall>Please wait a moment...</TypographySmall>
                </div>
            ) : (
                coc && (
                    <Fragment>
                        <COCImages
                            user={coc.user}
                            details={coc.details}
                        />
                    </Fragment>
                )
            )}
        </Modal>
    );
};

export default ViewCOCLogs;
