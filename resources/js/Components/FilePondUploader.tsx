import React, { useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { usePage } from "@inertiajs/react";

type Props = {
    mimetypes: Array<string>
    handleLoad: (id: number) => void;
    handleRemove: () => void;
    route: string
};

const FilePondUploader: React.FC<Props> = ({ route, mimetypes, handleLoad, handleRemove }) => {
    const ct = usePage().props.ct
    const pondRef = useRef<FilePond | null>(null);

    registerPlugin(
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize
    );

    const handleFilepondLoad = (load: any): any => {
        const response = JSON.parse(load);

        if (response.status === "success") handleLoad(response.file.id);

        return null;
    };

    const handleFilepondError = (error: any) => {
        // console.log(error)
    }

    return (
        <div>
            <FilePond
                ref={pondRef}
                name="file"
                maxFiles={1}
                className="filepond--pane filepond--drop-label"
                credits={false}
                maxFileSize={"10mb"}
                allowFileTypeValidation
                acceptedFileTypes={mimetypes}
                server={{
                    timeout: 7000,
                    process: {
                        url: route,
                        method: "POST",
                        headers: {
                            "X-CSRF-TOKEN": ct,
                        },
                        withCredentials: false,
                        onload: handleFilepondLoad,
                        onerror: handleFilepondError,
                    },
                }}
                onremovefile={handleRemove}
            />
        </div>
    );
};

export default FilePondUploader;
