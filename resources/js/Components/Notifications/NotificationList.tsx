import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { ProfilePhoto } from "../ui/avatar";
import { usePopover } from "../ui/popover";
import { Button } from "../ui/button";
import { Notification1 } from "iconsax-react";
import { TooltipLabel } from "../ui/tooltip";
import { useAccount } from "../Provider/auth-account-provider";
import { cn } from "@/Lib/utils";
import { router } from "@inertiajs/react";
import { useProcessIndicator } from "../Provider/process-indicator-provider";
import { format, formatDistanceToNow } from "date-fns";

const NotificationList = () => {
    const { close } = usePopover();
    const { setProcess } = useProcessIndicator();
    const { notifications, onMarkAsRead, onRedirectNotification } = useAccount();

    return notifications.map((list, index) => (
        <div key={index} className="relative group">
            <Card
                className="rounded-md shadow-none border-none hover:bg-secondary transition duration-150"
                role="button"
                onClick={() => {
                    setProcess(true)
                    close()
                    onRedirectNotification(list)
                }}
            >
                <CardContent
                    className={cn(
                        "flex items-center p-0 py-3 px-3 gap-3 min-h-16",
                        !list.viewed && "font-medium"
                    )}
                >
                    <div className="size-fit mb-auto">
                        <ProfilePhoto
                            className="size-12"
                            src={list.from_user?.avatar??''}
                        />
                    </div>
                    <div className="">
                        <span
                            className={cn(
                                "text-sm leading-4 line-clamp-4",
                                !list.viewed && "font-medium"
                            )}
                        >
                            <b>{list?.from_user?.role === "hr" ? "HR" : list?.from_user?.role === "principal" ? "Principal" : list.from_user?.full_name} {!list?.from_user && 'HR'}</b> {list.details?.message}
                        </span>
                        <div className="text-xs mt-1">{formatDistanceToNow(list.created_at).replace("about", "").concat(' ago')}</div>
                    </div>
                </CardContent>
            </Card>
            {!list.viewed && (
                <div className="size-2.5 bg-primary rounded-full absolute top-1/2 -translate-y-1/2 right-2.5"></div>
            )}
            {!list.viewed && <TooltipLabel
                label="Mark as read"
                className="size-fit rounded-full absolute top-1/2 -translate-y-1/2 right-2.5 shadow-none hidden group-hover:flex group-hover:bg-white dark:group-hover:bg-background hover:!bg-accent"
            >
                <Button
                    disabled={list.viewed}
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => onMarkAsRead(list)}
                >
                    <Notification1 />
                </Button>
            </TooltipLabel>}
        </div>
    ));
};

export default NotificationList;
