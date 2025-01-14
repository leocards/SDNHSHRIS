import React, { useRef } from "react";
import Modal, { ModalProps } from "../Modal";
import { Button } from "../ui/button";
import { Printer } from "iconsax-react";
import { useMessage } from "../Provider/message-provider";
import { useReactToPrint } from "react-to-print";
import { X } from "lucide-react";

type Props = ModalProps & {};

const ExportConversation = ({ show, onClose }: Props) => {
    const { openedUser, conversations } = useMessage();
    const contentRef = useRef(null);

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Modal show={show} onClose={onClose} title="Export Conversation" maxWidth="fit">
            <Button variant="outline" onClick={() => handlePrint()}>
                <Printer />
                <span>Print Conversation</span>
            </Button>

            <Button variant="outline" onClick={() => onClose(false)} size="icon" className="size-7 absolute top-5 right-5">
                <X />
            </Button>

            <div ref={contentRef} className="w-[8.3in] shrink-0 print:scale-90 my-3">
                <div className="uppercase font-medium text-center border-b border-black pb-3 mb-3">
                    CONVERSATION WITH {openedUser?.name}
                </div>
                <table className="table [&>tbody>tr]:border-none">
                    <tbody>
                        {conversations.map((convo, index) =>
                            convo.sender === openedUser?.id ? (
                                <tr key={index} className="[&>td]:py-1.5">
                                    <td className="w-40 text-[10pt] font-medium align-bottom">
                                        {openedUser?.name}
                                    </td>
                                    <td className="">
                                        <div className="p-2 px-3 rounded-md bg-gray-200 w-fit max-w-96 whitespace-pre-line break-words">
                                            {convo.message}
                                        </div>
                                    </td>
                                    <td className="w-40 text-[10pt] font-medium align-bottom"></td>
                                </tr>
                            ) : (
                                <tr key={index} className="[&>td]:py-1.5">
                                    <td className="w-40 text-[10pt] font-medium align-bottom"></td>
                                    <td className="">
                                        <div className="ml-auto p-2 px-3 rounded-3xl bg-blue-500 text-white w-fit max-w-96 whitespace-pre-line break-words">
                                            {convo.message}
                                        </div>
                                    </td>
                                    <td className="w-40 text-[10pt] font-medium align-bottom">
                                        You
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default ExportConversation;
