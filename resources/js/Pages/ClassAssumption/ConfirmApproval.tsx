import Modal, { ModalProps } from "@/Components/Modal";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Hooks/use-toast";
import { cn } from "@/Lib/utils";
import { PageProps, User } from "@/Types";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import React from "react";

type ConfirmApprovalProps = ModalProps & {
    approval: "approved" | "disapproved" | null;
    user: User;
    id: number;
    type: 'business' | 'sick'
};

const ConfirmApproval: React.FC<ConfirmApprovalProps> = ({
    id,
    show,
    user,
    type,
    approval,
    onClose,
}) => {
    const { setProcess } = useProcessIndicator()
    const { toast } = useToast()

    const verdict = {
        approved: "Approve",
        disapproved: "Disapprove",
    }[approval ?? "approved"];

    const onConfirm = (approval: string) => {
        router.post(route('myapproval.classassumption.approval', [id]), {
            status: approval
        }, {
            onBefore: () => setProcess(true),
            onSuccess: (page: any) => {
                toast({
                    title: page.props.flash.title,
                    description: page.props.flash.message,
                    status: page.props.flash.status,
                })

                if(page.props.flash.status === 'success') {
                    onClose(false)
                }
            },
            onError: (error: any) => {
                console.log(error)
            }
        })
    }

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={`${verdict} Class Assumption for ${{business: 'Official Business', sick: 'Sick Leave'}[type]}`}
            maxWidth="lg"
        >
            {approval ===  'approved' && <div className="text-center my-10">
                Please confirm your approval of the  <br /> Class Assumption for {{business: 'Official Business', sick: 'Sick Leave'}[type]} of <br /> {user.full_name}
            </div>}

            {approval ===  'disapproved' && <div className="text-center my-10">
                Please confirm your disapproval of the  <br /> Class Assumption for {{business: 'Official Business', sick: 'Sick Leave'}[type]} of <br /> {user.full_name}
            </div>}

            <div className="flex items-center mt-8 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose(false)}
                >
                    Cancel
                </Button>
                <Button
                    className={cn(
                        "ml-auto capitalize",
                        approval === "disapproved"
                            ? "bg-destructive hover:bg-destructive/90"
                            : "bg-green-600 hover:bg-green-500"
                    )}
                    onClick={() => onConfirm(approval === "disapproved" ? 'disapprove' : 'approve')}
                >
                    {verdict}
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmApproval;
