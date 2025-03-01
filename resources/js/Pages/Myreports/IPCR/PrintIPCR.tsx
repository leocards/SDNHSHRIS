import Modal, { ModalProps } from "@/Components/Modal";
import { Margin, usePDF } from "react-to-pdf";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";

import PDFIPCR from "./PDFIPCR";
import { IPCRTYPE } from "./IPCR";
import { useRef } from "react";
import { User } from "@/Types";

type Props = {
    ipcr: Array<IPCRTYPE>;
    principal: Pick<User, "full_name"|"position">;
    hr: string;
    year: string;
} & ModalProps;

const PrintIPCR: React.FC<Props> = ({ ipcr, show, principal, hr, onClose, year }) => {
    const contentRef = useRef(null)
    const download_pdf = usePDF({
        method: "open",
        filename: "SALN.pdf",
        page: {
            format: "A4",
            margin: Margin.MEDIUM,
            orientation: "portrait",
        },
    });

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="fit">
            <div className="">
                <div className="flex justify-between">
                    <Button
                        variant={"outline"}
                        onClick={() => handlePrint()}
                        className="gap-2"
                    >
                        <Printer className="size-4" />
                        <span>Print</span>
                    </Button>
                    <Button
                        variant={"outline"}
                        size="icon"
                        onClick={() => onClose(false)}
                        className="gap-2"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
                <style>
                    {`
                        @media print {
                            body {
                                overflow: hidden;
                                height: fit-content;
                            }
                        }

                        @page {
                            size: portrait;
                        }
                    `}
                </style>
                <div className=" overflow-y-auto rounded-scrollbar overflow-x-auto">
                    <PDFIPCR ipcr={ipcr} ref={contentRef}  principal={principal} hr={hr} year={year} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintIPCR;
