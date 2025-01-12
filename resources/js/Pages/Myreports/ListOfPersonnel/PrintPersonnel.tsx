import Modal, { ModalProps } from "@/Components/Modal";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/Components/ui/button";
import { Printer, X } from "lucide-react";
import PDFPersonnel from "./PDFPersonnel";
import { LIST } from "./ListOfPersonnel";
import { useRef, useState } from "react";
import { Input } from "@/Components/ui/input";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";

type Props = {
    list: LIST
} & ModalProps;

const PrintPersonnel: React.FC<Props> = ({ show, list, onClose, }) => {
    const sy = usePage().props.schoolyear
    const [schoolYear, setSy] = useState(sy ? `${format(sy.start, 'y')}-${format(sy.end, 'y')}` : "")

    const contentRef = useRef<HTMLDivElement|null>(null)
    // const download_pdf = usePDF({
    //     method: "open",
    //     filename: "MASTER LIST OF EMPLOYEES.pdf",
    //     page: {
    //         format: "A4",
    //         margin: Margin.MEDIUM,
    //         orientation: "portrait",
    //     }
    // });

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="fit">
            <div className="">
                <div className="flex justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Button
                            variant={"outline"}
                            onClick={() => handlePrint()}
                            className="gap-2"
                        >
                            <Printer className="size-4" />
                            <span>Print</span>
                        </Button>
                        <div className="flex gap-2 items-center">
                            <div>S.Y.</div>
                            <Input value={schoolYear} className="w-28 h-9 border-black" onInput={(event) => {
                                let value = event.target as HTMLInputElement
                                setSy(value.value)
                            }} />
                        </div>
                    </div>
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

                <div className="overflow-y-auto rounded-scrollbar overflow-x-hidden">
                    <PDFPersonnel summary={list} ref={contentRef} principal={list.principal.length > 0 ? list.principal[0] : {position: "None", full_name: "none"}} />
                </div>
            </div>
        </Modal>
    );
};

export default PrintPersonnel;
