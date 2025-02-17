import Modal, { ModalProps } from "@/Components/Modal";
import { ANNOUNCEMENT } from "./Announcement";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { useToast } from "@/Hooks/use-toast";

type Props = ModalProps & {
    announcement: ANNOUNCEMENT | null;
};

const AnnouncementDeleteConfirmation = ({
    show,
    announcement,
    onClose,
}: Props) => {
    const { setProcess } = useProcessIndicator()
    const { toast } = useToast()

    return (
        <Modal show={show} onClose={onClose} title="Delete Announcement" maxWidth="md" center>
            <div className=" text-center my-8">
                Please confirm if you would like to delete {announcement?.title}. Once deleted, it cannot be restored.
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => onClose()}>
                    Cancel
                </Button>

                <Button variant="default" onClick={() => {
                    if(announcement)
                        router.post(route('announcement.delete', [announcement.id]), undefined, {
                            onBefore: () => setProcess(true),
                            onSuccess: (page) => {
                                let response = page.props.flash
                                if(response.status === "success") {
                                    onClose(true)
                                }

                                toast({
                                    title: response.title,
                                    description: response.message,
                                    status: response.status
                                })
                            },
                            onError: (error) => {
                                console.log(error)
                            }
                        })
                }}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
};

export default AnnouncementDeleteConfirmation;
