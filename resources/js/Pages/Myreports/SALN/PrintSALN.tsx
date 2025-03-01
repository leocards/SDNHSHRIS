import Modal, { ModalProps } from "@/Components/Modal";
import { HrType, PrincipalType, SALNType } from "./type";
import { Margin, usePDF } from "react-to-pdf";
import PDFSALN from "./PDFSALN";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";
import { useRef } from "react";
import { usePage } from "@inertiajs/react";
import { User } from "@/Types";
import { SALNREPORTTYPE } from "./SALN";

type Props = {
    saln: Array<SALNREPORTTYPE>;
    principal?: User;
    year: string
} & ModalProps;

const PrintSALN: React.FC<Props> = ({ saln, show, principal, year, onClose }) => {
    const contentRef = useRef<HTMLDivElement|null>(null)

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="fit" isFullScreen>
            <div className="">
                <div className="flex justify-between">
                    <Button variant={"outline"} onClick={() => handlePrint()} className="gap-2">
                        <Printer className="size-4" />
                        <span>Print</span>
                    </Button>
                    <Button variant={"outline"} size="icon" onClick={() => onClose(false)} className="gap-2">
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
                            size: landscape;
                        }
                    `}
                </style>
                <div className="max-h-[36.5rem] overflow-y-auto rounded-scrollbar overflow-x-auto">
                    <PDFSALN ref={contentRef} saln={saln}  principal={principal} year={year} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintSALN;
