import Modal, { ModalProps } from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { useMessage } from "../Provider/message-provider";
import { useProcessIndicator } from "../Provider/process-indicator-provider";

type Props = {} & ModalProps;

const DeleteConversationConfirmation: React.FC<Props> = ({ show, onClose }) => {
    const { toast } = useToast()
    const { openedUser, messages, setNewMessagesList, closeMessageBox } = useMessage()
    const { setProcess } = useProcessIndicator()

    const onDelete = () => {
        router.post(route('messages.delete', [openedUser?.id]), {}, {
            onBefore: () => setProcess(true),
            onSuccess: (page) => {
                toast({
                    title: page.props.flash.title,
                    status: page.props.flash.status,
                    description: page.props.flash.message
                })

                if(page.props.flash.status === "success") {
                    let newMessages = [...messages]

                    newMessages = newMessages.filter(({ user }) => user.id !== openedUser?.id)

                    setNewMessagesList(newMessages)

                    closeMessageBox()
                }
            }
        })
    }

    return (
        <Modal show={show} onClose={() => onClose(false)} maxWidth="md">
                    <div className="font-bold text-xl px-1 text-destructive">
                        Delete Conversation
                    </div>

                    <div className="my-8 px-1 text-center">
                        Are you sure you want to delete your conversation with {" "}
                        <span className="font-semibold">{openedUser?.name}</span> ?
                    </div>

                    <div className="flex justify-between">
                        <Button className="px-8" variant="ghost" onClick={() => onClose(false)}>
                            <span>No</span>
                        </Button>

                        <Button variant="destructive" onClick={onDelete}>
                            <span>Yes, delete</span>
                        </Button>
                    </div>
        </Modal>
    )
}

export default DeleteConversationConfirmation;
