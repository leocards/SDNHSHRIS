import { Button } from "@/Components/ui/button";
import { AddSquare, Edit, Refresh2, Trash } from "iconsax-react";
import empty from "@/Assets/empty-announcement.svg";
import { Card } from "@/Components/ui/card";
import { usePage } from "@inertiajs/react";
import { Fragment, useEffect, useState } from "react";
import { cn } from "@/Lib/utils";
import NewAnnouncement from "./NewAnnouncement";
import TypographySmall from "@/Components/Typography";
import { format } from "date-fns";
import ViewAnnouncements from "./ViewAnnouncements";
import AnnouncementDeleteConfirmation from "./AnnouncementDeleteConfirmation";

export type ANNOUNCEMENT = {
    id: number;
    title: string;
    details: any;
    created_at: string;
    updated_at: string;
};

type Props = {
    announcements: ANNOUNCEMENT[];
};

const Announcement = ({ announcements }: Props) => {
    const role = usePage().props.auth.user.role;
    const [refresh, setRefresh] = useState(false);
    const [selected, setSelected] = useState<ANNOUNCEMENT | null>(null);
    const [newAnnounemcent, setNewAnnounemcent] = useState(false);
    const [view, setView] = useState(false);
    const [announceList, setAnnounceList] =
        useState<ANNOUNCEMENT[]>(announcements);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)


    const onRefresh = () => {
        if (!refresh) {
            setRefresh(true);

            window.axios
                .get(route("announcement"))
                .then((response) => {
                    setAnnounceList(response.data);
                })
                .finally(() => setRefresh(false));
        }
    };

    useEffect(() => {
        if(announcements) {
            setAnnounceList(announcements)
        }
    }, [announcements])

    return (
        <Card className="shadow-sm border border-border rounded-lg grid grid-rows-[auto,1fr]">
            <div className="px-2 py-2 border-b border-border flex items-center gap-2 h-fit">
                {role !== "hr" && (
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={refresh}
                        className={cn("size-8")}
                        onClick={onRefresh}
                    >
                        <Refresh2
                            className={cn(
                                "!size-4",
                                refresh && "animate-spin-clockwise"
                            )}
                        />
                    </Button>
                )}
                <div className="font-medium">Announcements</div>

                {role === "hr" && (
                    <Button
                        variant="outline"
                        className="h-8 px-2 ml-auto"
                        onClick={() => setNewAnnounemcent(true)}
                    >
                        <AddSquare className="!size-4" />
                        Add new
                    </Button>
                )}
            </div>
            <div className="p-2 overflow-y-auto relative space-y-2">
                {announcements.length === 0 && (
                    <div className="flex flex-col items-center absolute inset-0 justify-center top-0">
                        <img
                            className="size-24 opacity-40 dark:opacity-65"
                            src={empty}
                        />
                        <div className="text-sm font-medium text-foreground/50">
                            No announcements yet.
                        </div>
                    </div>
                )}

                {announceList.map((announce, index) => (
                    <div key={index} className="relative">
                        {role === "hr" && (
                            <Fragment>
                                <Button
                                    className="size-7 absolute top-1 right-9"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelected(announce);
                                        setNewAnnounemcent(true);
                                    }}
                                >
                                    <Edit className="!size-4" />
                                </Button>
                                <Button
                                    className="size-7 absolute top-1 right-1 !text-destructive"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelected(announce);
                                        setShowDeleteConfirmation(true);
                                    }}
                                >
                                    <Trash className="!size-4" />
                                </Button>
                            </Fragment>
                        )}
                        <Card
                            className="p-3"
                            role="button"
                            onClick={() => {
                                setSelected(announce);
                                setView(true);
                            }}
                        >
                            <div className="flex flex-col gap-0">
                                <TypographySmall className="text-base">
                                    {announce.title}
                                </TypographySmall>
                                <TypographySmall className="text-xs font-foreground/70">
                                    {announce.details.date
                                        ? format(
                                              announce.details.date,
                                              "MMM dd, y"
                                          ) +
                                          (announce.details.time
                                              ? " | " +
                                                format(
                                                    timeConverter(
                                                        announce.details.time
                                                    ),
                                                    "hh:m aaa"
                                                )
                                              : "")
                                        : ""}
                                </TypographySmall>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <NewAnnouncement
                announcement={selected}
                show={newAnnounemcent}
                onClose={() => {
                    setNewAnnounemcent(false);
                    setTimeout(() => {
                        setSelected(null);
                    }, 300);
                }}
            />

            <ViewAnnouncements
                announcement={selected}
                show={view}
                onClose={setView}
            />

            <AnnouncementDeleteConfirmation
                show={showDeleteConfirmation}
                onClose={() => {
                    setShowDeleteConfirmation(false)
                    setTimeout(() => {
                        setSelected(null);
                    }, 300);
                }}
                announcement={selected}
            />
        </Card>
    );
};

export const timeConverter = (time: string) => {
    const [hours, minutes] = time?.split(":").map(Number);

    // Create a new Date object for the current date
    const date = new Date();

    // Set the hours and minutes on the Date object
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export default Announcement;
