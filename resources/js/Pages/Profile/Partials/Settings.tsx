import { useTheme } from "@/Components/Provider/theme-provider";
import { useState } from "react";
import messageNotification from "@/Assets/sounds/message.mp3";
import notification from "@/Assets/sounds/notification.mp3";
import { usePage } from "@inertiajs/react";
import { Checkbox } from "@/Components/ui/checkbox";
import { Messages2, Notification } from "iconsax-react";
import { Slider } from "@/Components/ui/slider";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/Hooks/use-toast";

const Settings = () => {
    const { toast } = useToast();
    const { auth } = usePage().props;
    const { theme, setTheme } = useTheme();
    const [messageNotificationVolume, setMessageNotificationVolume] = useState(
        parseFloat(localStorage.getItem("message-volume") ?? "1.0")
    );
    const [newNotificationVolume, setNewNotificationVolume] = useState(
        parseFloat(localStorage.getItem("notification-volume") ?? "1.0")
    );

    const [enable, setEnable] = useState({
        notification: {
            enabled: auth.user.enable_email_notification,
            loading: false,
        },
        message: {
            enabled: auth.user.enable_email_message_notification,
            loading: false,
        },
        announcement: {
            enabled: auth.user.enable_email_announcement_reminder,
            loading: false,
        },
    });

    const [enableEmailNotif, setEnableEmailNotif] = useState({
            enabled: auth.user.enable_email_notification,
            loading: false,
        })
    const [enableEmailMessageNotif, setEmailMessageNotif] = useState({
            enabled: auth.user.enable_email_message_notification,
            loading: false,
        })
    const [enableEmailAnnounceNotif, setEmailAnnounceNotif] = useState({
            enabled: auth.user.enable_email_announcement_reminder,
            loading: false,
        })

    const enableEmailNotification = (status: boolean) => {
        const notification = {enabled: status, loading: status}
        setEnableEmailNotif(notification);
        window.axios
            .post(route("profile.settings"), {...notification, type: 'notification'})
            .then((response) => {
                let { data } = response
                if("status" in data) {
                    toast({
                        title: data.title,
                        description: data.message,
                        status: data.status
                    })
                }
            })
            .finally(() =>
                setEnableEmailNotif({enabled: status, loading: false })
            );
    };

    const enableEmailMessageNotification = (status: boolean) => {
        const notification = { enabled: status, loading: status }
        setEmailMessageNotif(notification);
        window.axios
            .post(route("profile.settings"), {...notification, type: 'message'})
            .then((response) => {
                let { data } = response
                if("status" in data) {
                    toast({
                        title: data.title,
                        description: data.message,
                        status: data.status
                    })
                }
            })
            .finally(() =>
                setEmailMessageNotif({ enabled: status, loading: false })
            );
    };

    const enableEmailAnnouncementNotification = (status: boolean) => {
        const notification = { enabled: status, loading: status }
        setEmailAnnounceNotif(notification);
        window.axios
            .post(route("profile.settings"), {...notification, type: 'announcement'})
            .then((response) => {
                let { data } = response
                if("status" in data) {
                    toast({
                        title: data.title,
                        description: data.message,
                        status: data.status
                    })
                }
            })
            .finally(() =>
                setEmailAnnounceNotif({enabled: status, loading: false })
            );
    };

    return (
        <div className="space-y-10 mx-auto max-w-fit flex-col mb-10">
            <div className="">
                <div className="text-lg font-medium">Apearance</div>
                <div className="text-sm">
                    Personalize your account's appearance
                </div>

                <div className="mt-5">
                    <div className="text-sm font-medium">Theme</div>
                    <div className="flex flex-wrap mt-1 gap-3">
                        <div className="">
                            <div
                                data-theme={theme}
                                className="overflow-hidden rounded-lg border border-border flex h-28 w-52 bg-white data-[theme=light]:ring ring-ring"
                                role="button"
                                onClick={() => setTheme("light")}
                            >
                                <div className="w-10 bg-fuchsia-600"></div>
                                <div className="grow">
                                    <div className="h-5 w-full border-b border-b-gray-100 flex">
                                        <div className="h-3 w-10 rounded my-auto mr-1 ml-auto bg-gray-100"></div>
                                        <div className="h-3 w-10 rounded my-auto mr-1 ml-px bg-gray-100"></div>
                                    </div>
                                    <div className="space-y-1 p-2">
                                        <div className="h-5 w-full rounded bg-gray-100"></div>
                                        <div className="h-5 w-full rounded bg-gray-100"></div>
                                        <div className="h-5 w-full rounded bg-gray-100"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-xs font-medium">
                                    Light Mode
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div
                                data-theme={theme}
                                className="overflow-hidden rounded-lg border border-border flex h-28 w-52 bg-zinc-900 data-[theme=dark]:ring ring-ring"
                                role="button"
                                onClick={() => setTheme("dark")}
                            >
                                <div className="w-10 bg-white/15"></div>
                                <div className="grow">
                                    <div className="h-5 w-full border-b  border-zinc-800 flex">
                                        <div className="h-3 w-10 rounded my-auto mr-1 ml-auto bg-white/10"></div>
                                        <div className="h-3 w-10 rounded my-auto mr-1 ml-px bg-white/10"></div>
                                    </div>
                                    <div className="space-y-1 p-2">
                                        <div className="h-5 w-full rounded bg-white/10"></div>
                                        <div className="h-5 w-full rounded bg-white/10"></div>
                                        <div className="h-5 w-full rounded bg-white/10"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-xs font-medium">
                                    Dark Mode
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div
                                data-theme={theme}
                                className="overflow-hidden rounded-lg border border-border flex h-28 w-52 data-[theme=system]:ring ring-ring"
                                role="button"
                                onClick={() => setTheme("system")}
                            >
                                <div className="flex w-1/2 overflow-hidden bg-white">
                                    <div className="flex grow">
                                        <div className="w-10 bg-fuchsia-600"></div>
                                        <div className="grow">
                                            <div className="h-5 w-full border-b border-gray-100 flex"></div>
                                            <div className="space-y-1 py-2 pl-2">
                                                <div className="h-5 w-full rounded-l bg-gray-100"></div>
                                                <div className="h-5 w-full rounded-l bg-gray-100"></div>
                                                <div className="h-5 w-full rounded-l bg-gray-100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-1/2 overflow-hidden bg-zinc-900">
                                    <div className="flex grow">
                                        <div className="grow">
                                            <div className="h-5 w-full border-b border-zinc-800 flex">
                                                <div className="h-3 w-10 rounded my-auto mr-1 ml-auto bg-white/10"></div>
                                                <div className="h-3 w-10 rounded my-auto mr-1 ml-px bg-white/10"></div>
                                            </div>
                                            <div className="space-y-1 py-2 pr-2">
                                                <div className="h-5 w-full rounded-r bg-white/10"></div>
                                                <div className="h-5 w-full rounded-r bg-white/10"></div>
                                                <div className="h-5 w-full rounded-r bg-white/10"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-xs font-medium">
                                    System Mode
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="text-lg font-medium">Notifications</div>
                <div className="text-sm">
                    Enable or disable email notifications
                </div>

                <div className="mt-5">
                    <div className="space-y-3 mt-5">
                        <div className="flex items-center">
                            <Checkbox
                                className="text-primary"
                                checked={
                                    enableEmailNotif.enabled
                                }
                                disabled={
                                    enableEmailNotif.loading
                                }
                                onCheckedChange={enableEmailNotification}
                            />
                            <div className="ml-3">
                                Enable email notifications
                            </div>
                            {enableEmailNotif.loading && (
                                <div className="flex items-center ml-4 text-sm gap-2">
                                    <div className="loading loading-spinner loading-sm"></div>
                                    <div className="text-foreground/60">
                                        Saving...
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                className="text-primary"
                                checked={
                                    enableEmailMessageNotif.enabled
                                }
                                disabled={
                                    enableEmailMessageNotif.loading
                                }
                                onCheckedChange={enableEmailMessageNotification}
                            />
                            <div className="ml-3">
                                Enable email notification for new messages
                            </div>
                            {enableEmailMessageNotif.loading && (
                                <div className="flex items-center ml-4 text-sm gap-2">
                                    <div className="loading loading-spinner loading-sm"></div>
                                    <div className="text-foreground/60">
                                        Saving...
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                className="text-primary"
                                checked={
                                    enableEmailAnnounceNotif.enabled
                                }
                                disabled={
                                    enableEmailAnnounceNotif.loading
                                }
                                onCheckedChange={enableEmailAnnouncementNotification}
                            />
                            <div className="ml-3">
                                Enable email notification for announcement
                            </div>
                            {enableEmailAnnounceNotif.loading && (
                                <div className="flex items-center ml-4 text-sm gap-2">
                                    <div className="loading loading-spinner loading-sm"></div>
                                    <div className="text-foreground/60">
                                        Saving...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="text-lg font-medium">Volume</div>
                <div className="text-sm">
                    Adjust the volume of notification sounds
                </div>

                <div className="mt-5 space-y-5">
                    <div>
                        <div className="flex items-center gap-3 mb-2 ">
                            <Messages2 className="size-5 [&>path]:stroke-[1.75]" />
                            <div className="font-medium">Message</div>
                        </div>
                        <div className="border border-border rounded-md p-3 flex items-center gap-3">
                            <div className="size-5 flex justify-end">
                                {messageNotificationVolume > 0.8 && (
                                    <Volume2
                                        className="size-5"
                                        strokeWidth={1.77}
                                    />
                                )}
                                {messageNotificationVolume > 0.25 &&
                                    messageNotificationVolume <= 0.8 && (
                                        <Volume1
                                            className="size-5"
                                            strokeWidth={1.77}
                                        />
                                    )}
                                {messageNotificationVolume > 0 &&
                                    messageNotificationVolume <= 0.25 && (
                                        <Volume
                                            className="size-5"
                                            strokeWidth={1.77}
                                        />
                                    )}
                                {messageNotificationVolume === 0 && (
                                    <VolumeX
                                        className="size-5"
                                        strokeWidth={1.77}
                                    />
                                )}
                            </div>
                            <Slider
                                defaultValue={[
                                    parseFloat(
                                        localStorage.getItem(
                                            "message-volume"
                                        ) ?? "1.0"
                                    ),
                                ]}
                                max={1}
                                step={0.01}
                                onValueChange={(volume) => {
                                    setMessageNotificationVolume(volume[0]);
                                }}
                                onValueCommit={(volume) => {
                                    const sound = new Audio(
                                        messageNotification
                                    );
                                    sound.volume = volume[0];
                                    sound.play();

                                    localStorage.setItem(
                                        "message-volume",
                                        volume[0].toString()
                                    );
                                }}
                            />
                            <div className="tabular-nums">
                                {(messageNotificationVolume * 100).toFixed(0)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2 ">
                            <Notification className="size-5 [&>path]:stroke-[1.75]" />
                            <div className="font-medium">Notification</div>
                        </div>
                        <div className="border border-border rounded-md p-3 flex items-center gap-3">
                            <div className="size-5 flex justify-end">
                                {newNotificationVolume > 0.8 && (
                                    <Volume2
                                        className="size-5"
                                        strokeWidth={1.77}
                                    />
                                )}
                                {newNotificationVolume > 0.25 &&
                                    newNotificationVolume <= 0.8 && (
                                        <Volume1
                                            className="size-5"
                                            strokeWidth={1.77}
                                        />
                                    )}
                                {newNotificationVolume > 0 &&
                                    newNotificationVolume <= 0.25 && (
                                        <Volume
                                            className="size-5"
                                            strokeWidth={1.77}
                                        />
                                    )}
                                {newNotificationVolume === 0 && (
                                    <VolumeX
                                        className="size-5"
                                        strokeWidth={1.77}
                                    />
                                )}
                            </div>
                            <Slider
                                defaultValue={[
                                    parseFloat(
                                        localStorage.getItem(
                                            "notification-volume"
                                        ) ?? "1.0"
                                    ),
                                ]}
                                max={1}
                                step={0.01}
                                onValueChange={(volume) => {
                                    setNewNotificationVolume(volume[0]);
                                }}
                                onValueCommit={(volume) => {
                                    const sound = new Audio(notification);
                                    sound.volume = volume[0];
                                    sound.play();

                                    localStorage.setItem(
                                        "notification-volume",
                                        volume[0].toString()
                                    );
                                }}
                            />
                            <div className="tabular-nums">
                                {(newNotificationVolume * 100).toFixed(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
