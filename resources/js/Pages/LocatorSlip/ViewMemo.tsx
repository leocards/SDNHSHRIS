import Modal, { ModalProps } from "@/Components/Modal";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import React from "react";

type ViewMemoProps = ModalProps & {
    src: string | null
};

const ViewMemo: React.FC<ViewMemoProps> = ({ show, src, onClose }) => {
    return (
        <Modal show={show} onClose={onClose} title="Memo" maxWidth="2xl" closeable>
            <Button size={'icon'} variant={'ghost'} className="size-8 absolute top-4 right-5" onClick={() => onClose(false)}>
                <X />
            </Button>

            {src && (
                src.includes('.pdf') ? (
                    <embed
                        src={
                            src +
                            "#toolbar=0&navpanes=0&scrollbar=0"
                        }
                        className="w-full h-[30rem] aspect-auto"
                    />
                ) : (
                    <img src={src??""} alt="memo" className="rounded-md aspect-video" />
                )
            )}


            {!src && (
                <div className="flex items-center justify-center h-60">
                    <TypographySmall>
                        Nothing to preview
                    </TypographySmall>
                </div>
            )}

        </Modal>
    );
};

export default ViewMemo;
