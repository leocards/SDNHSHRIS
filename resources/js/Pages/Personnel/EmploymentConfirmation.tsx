import Modal, { ModalProps } from "@/Components/Modal";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";
import { User } from "@/Types";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

type Props = ModalProps & {
    action?: "retired" | "resigned" | "transferred" | null;
    personnel: User | null;
};

const EmploymentConfirmation: React.FC<Props> = ({
    show,
    onClose,
    action,
    personnel,
}) => {
    const [details, setDetails] = useState({
        personnel: personnel?.full_name,
        action: action,
    });
    const { setProcess } = useProcessIndicator();
    const { toast } = useToast();

    const onConfirm = () => {
        setProcess(true)
        router.post(
            route("personnel.employment.update", [personnel?.id]),
            {
                action: action,
            },
            {
                onSuccess: (page) => {
                    const { title, message, status } = page.props.flash;
                    toast({
                        title,
                        description: message,
                        status,
                    });

                    if (page.props.flash.status === "success") {
                        onClose()
                    }
                },
                onFinish: () => {
                    setProcess(false)
                }
            }
        );
    };

    useEffect(() => {
        if (show) {
            setDetails({ personnel: personnel?.full_name, action });
        }
    }, [show]);

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Employment Confirmation"
            maxWidth="md"
        >
            <div className="text-center px-10 py-7">
                <div className="">
                    You are about to mark <b>{details.personnel}</b> as{" "}
                    <b className="capitalize">{details.action}</b>.
                </div>
            </div>

            <div className="flex justify-between mt-3">
                <Button variant={"outline"} onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button variant={"default"} onClick={onConfirm}>Confirm</Button>
            </div>
        </Modal>
    );
};

export default EmploymentConfirmation;
