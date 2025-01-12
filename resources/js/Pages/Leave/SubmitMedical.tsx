import Modal, { ModalProps } from "@/Components/Modal";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { router, usePage } from "@inertiajs/react";
import { useToast } from "@/Hooks/use-toast";

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
    const page = usePage();
    const { toast } = useToast();
    const pondRef = useRef<FilePond | null>(null);

    registerPlugin(
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize
    );

    const handleFilepondLoad = (load: any): any => {
        const response = JSON.parse(load);

        if (response.status === "success") setMedical(response.file.id);

        return null;
    };

    const handleFilepondError = (error: any) => {
        // console.log(error)
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
                <FilePond
                    ref={pondRef}
                    name="file"
                    maxFiles={1}
                    className="filepond--pane filepond--drop-label"
                    credits={false}
                    maxFileSize={"10mb"}
                    allowFileTypeValidation
                    acceptedFileTypes={allowedMimeTypes}
                    server={{
                        timeout: 7000,
                        process: {
                            url: route("sr.temporary"),
                            method: "POST",
                            headers: {
                                "X-CSRF-TOKEN": page.props.ct,
                            },
                            withCredentials: false,
                            onload: handleFilepondLoad,
                            onerror: handleFilepondError,
                        },
                    }}
                    onremovefile={handleFilePondRemove}
                />
            </div>

            <div className="flex items-center mt-8 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => onClose(false)}>
                    Cancel
                </Button>
                <Button className="ml-auto" disabled={!medical} onClick={() => medical && onSubmitMedical()}>Send Application</Button>
            </div>
        </Modal>
    );
};

export default SubmitMedical;
