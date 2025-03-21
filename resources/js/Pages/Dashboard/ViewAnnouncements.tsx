import Modal, { ModalProps } from "@/Components/Modal";
import React from "react";
import { ANNOUNCEMENT, timeConverter } from "./Announcement";
import { format } from "date-fns";
import TypographySmall from "@/Components/Typography";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";

type Porps = ModalProps & {
    announcement: ANNOUNCEMENT | null;
};

const ViewAnnouncements = ({ announcement, show, onClose }: Porps) => {
    return (
        <Modal show={show} onClose={onClose} title={announcement?.title}>
            <Button
                className="absolute top-2 right-2"
                variant="outline"
                size="icon"
                onClick={() => onClose(false)}
            >
                <X className="!size-4" />
            </Button>
            {announcement?.details.date && (
                <div className="flex items-center gap-2">
                    <TypographySmall className="text-base">
                        Date
                    </TypographySmall>
                    :
                    <TypographySmall>
                        {format(announcement?.details.date, "MMMM dd, y")}
                    </TypographySmall>
                </div>
            )}
            {announcement?.details.time && (
                <div className="flex items-center gap-2">
                    <TypographySmall className="text-base">
                        Time
                    </TypographySmall>
                    :
                    <TypographySmall>
                        {format(
                            timeConverter(announcement?.details.time),
                            "hh:m aaa"
                        )}
                    </TypographySmall>
                </div>
            )}
            {announcement?.details?.venue && (
                <div className="flex items-center gap-2">
                    <TypographySmall className="text-base">
                        Venue
                    </TypographySmall>
                    :
                    <TypographySmall>
                        {announcement?.details.venue}
                    </TypographySmall>
                </div>
            )}

            <div className="bg-secondary p-3 mt-5 rounded-lg">
                <div className="mb-3">
                    <TypographySmall className="text-foreground/40 italic">
                        Subject:
                    </TypographySmall>
                </div>
                <div className="whitespace-pre-line break-words text-wrap">
                    {announcement?.details.description}
                </div>
            </div>
        </Modal>
    );
};

export default ViewAnnouncements;
