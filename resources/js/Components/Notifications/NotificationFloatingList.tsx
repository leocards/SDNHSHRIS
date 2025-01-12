import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "../ui/button";
import { Check, Expand } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import NotificationList from "./NotificationList";
import { TooltipLabel } from "../ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useAccount } from "../Provider/auth-account-provider";
import { Notification } from "iconsax-react";
import { useState } from "react";

const NotificationFloatingList = () => {
    const { notifications, unreadNotification, updateNotificationCounter, setNotifications } = useAccount()
    const [loading, setLoading] = useState(false)
    const [proccesMarkAllRead, setProccesMarkAllRead] = useState(false)

    const onChangeTab = (tab: "all"|"unread") => {
        if(proccesMarkAllRead) return

        setLoading(true)
        window.axios.get(route('notification', { _query: { filter: tab }}))
            .then((response) => {
                let data = response.data
                setNotifications(data)
            })
            .finally(() => setLoading(false))
    }

    const onMarkAllAsRead = () => {
        if(notifications.length === 0) return

        setProccesMarkAllRead(true)

        const list = [...notifications]

        window.axios.post(route('notification.read.all'))
            .then((response) => {
                list.map((notif) => {
                    const data = notif

                    if(!data.viewed)
                        data.viewed = true

                    return data
                })
                setNotifications(list)
                updateNotificationCounter(0, true)
            })
            .finally(() => setProccesMarkAllRead(false))
    }

    return (
        <Card className="grid grid-rows-[auto,auto,1fr,auto] w-[380px] h-[37rem] border-none shadow-none rounded-none relative">
            {proccesMarkAllRead && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 p-1 px-4 text-sm rounded-md bg-primary text-primary-foreground z-10">Loading...</div>
            )}
            <CardHeader className="relative !flex flex-row items-center justify-between py-4 border-b border-border mb-2">
                <div>
                    <CardTitle className="text-lg leading-4">Notifcations</CardTitle>
                    {unreadNotification!==0 && <CardDescription>You have {unreadNotification} unread notifications</CardDescription>}
                </div>
            </CardHeader>
            <Tabs defaultValue="all" className="px-6 mb-2" onValueChange={(value) => onChangeTab(value as "all"|"unread")}>
                <TabsList className="w-full rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="all" className="w-full" disabled={proccesMarkAllRead}>All</TabsTrigger>
                    <TabsTrigger value="unread" className="w-full" disabled={proccesMarkAllRead}>Unread</TabsTrigger>
                </TabsList>
            </Tabs>
            <ScrollArea className="grow">
                <CardContent className="text-sm space-y mt-3">
                    {loading ? (
                        <div className="w-fit mx-auto mt-32 text-center">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                            <div>Please wait a moment...</div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="w-fit mx-auto mt-32 opacity-50">
                            <Notification className="[&_path]:store-[2px] size-20 text-primary/40 mx-auto" variant="Bulk" />
                            <div>Empty Notification</div>
                        </div>
                    ) : (<NotificationList />)}
                </CardContent>
            </ScrollArea>
            <CardFooter className="mt-5">
                <Button className="w-full" onClick={onMarkAllAsRead} disabled={proccesMarkAllRead}>
                    <Check /> Mark all as read
                </Button>
            </CardFooter>
        </Card>
    );
};

export default NotificationFloatingList;
