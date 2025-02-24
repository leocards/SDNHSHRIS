import Modal, { ModalProps } from "@/Components/Modal";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import React, { useState } from "react";
import "filepond/dist/filepond.min.css";
import { router } from "@inertiajs/react";
import { useToast } from "@/Hooks/use-toast";
import FilePondUploader from "@/Components/FilePondUploader";

const allowedMimeTypes = [
    // "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
];

type Props = ModalProps & {
    leave: number;
};

const SubmitMedical: React.FC<Props> = ({ leave, show, onClose }) => {
    const { setProcess } = useProcessIndicator();
    const [medical, setMedical] = useState<number | null>(null);
    const { toast } = useToast();


    const handleFilepondLoad = (id: number): any => {
        setMedical(id);
    };

    const handleFilePondRemove = () => {
        setMedical(null);
    };

    const onSubmitMedical = () => {
        router.post(
            route("leave.medical.store", [leave]),
            {
                medical,
            },
            {
                onBefore: () => setProcess(true),
                onSuccess: (page: any) => {
                    toast({
                        title: page.props.flash.title,
                        description: page.props.flash.message,
                        status: page.props.flash.status,
                    });

                    if (page.props.flash.status === "success") {
                        onClose(false);
                    }
                },
            }
        );
    };

    return (
        <Modal show={show} onClose={onClose} title="Upload Medical Certificate">
            <Button
                className="absolute top-4 right-4"
                size="icon"
                variant="outline"
                onClick={() => onClose(false)}
            >
                <X />
            </Button>

            <div className="py-10 pb-5">
                <FilePondUploader
                    route={route("sr.temporary")}
                    mimetypes={allowedMimeTypes}
                    handleLoad={handleFilepondLoad}
                    handleRemove={handleFilePondRemove}
                />
            </div>

            <div className="flex items-center mt-8 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose(false)}
                >
                    Cancel
                </Button>
                <Button
                    className="ml-auto"
                    disabled={!medical}
                    onClick={() => medical && onSubmitMedical()}
                >
                    Send Application
                </Button>
            </div>
        </Modal>
    );
};

export default SubmitMedical;
