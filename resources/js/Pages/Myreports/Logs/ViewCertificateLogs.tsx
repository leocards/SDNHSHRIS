import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall, { TypographyStatus } from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import LeavePDF from "@/Pages/Leave/PDF/LeavePDF";
import { COCImages, ImageViewer } from "@/Pages/ServiceRecord/ViewCertificate";
import { formatDateRange } from "@/Types/types";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";

type Props = ModalProps & {
    certificate: number | null;
};

const ViewCertificateLogs = ({ certificate, show, onClose }: Props) => {
    const [certificates, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (certificate) {
            setLoading(true);
            window.axios
                .get(route("myreports.logs.certificate", [certificate]))
                .then((response) => {
                    setCertificate(response.data);
                })
                .then(() => setLoading(false));
        }
    }, [certificate]);

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
                certificates && (
                    <Fragment>
                        <ImageViewer
                            user={certificates?.user}
                            name={certificates?.details?.name}
                            path={certificates?.details?.path}
                            filename={certificates?.details?.filename}
                        />

                        <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-3">
                                <TypographySmall
                                    className=""
                                    children="Date:"
                                />
                                <div className="text-sm">
                                    {formatDateRange({
                                        from: certificates?.details?.from,
                                        to: certificates?.details?.to,
                                    })}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TypographySmall
                                    className=""
                                    children="Venue:"
                                />
                                <div className="text-sm">
                                    {certificates?.details?.venue}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TypographySmall
                                    className=""
                                    children="Organizer:"
                                />
                                <div className="text-sm">
                                    {certificates?.details?.organizer}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <TypographySmall
                                    className=""
                                    children="Credits:"
                                />
                                <div className="flex gap-5 ml-4">
                                    <div className="flex items-center gap-3">
                                        <TypographySmall
                                            className=""
                                            children="Earned:"
                                        />
                                        <div className="text-sm">
                                            {certificates?.details?.credits}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TypographySmall
                                            className=""
                                            children="Unused:"
                                        />
                                        <div className="text-sm">
                                            {certificates?.details?.remainingcredits}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )
            )}
        </Modal>
    );
};

export default ViewCertificateLogs;
