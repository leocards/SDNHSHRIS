import { PAGINATEDDATA, User } from "@/Types";
import { router } from "@inertiajs/react";
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { useProcessIndicator } from "./process-indicator-provider";
import notificationSound from "@/Assets/sounds/notification.mp3";
import { useToast } from "@/Hooks/use-toast";

type ACTIVEUSERSTYPE = { id: number; name: string; active_at: string };
type ACTIVEUSERSLIST = Array<ACTIVEUSERSTYPE>;

type NOTIFICATION = {
    id: number;
    from_user: Pick<
        User,
        | "id"
        | "firstname"
        | "middlename"
        | "lastname"
        | "role"
        | "avatar"
        | "full_name"
        | "name"
    >;
    type: string;
    details: any;
    viewed: boolean;
    created_at: string;
};

type AccountState = {
    auth: User | null;
    logout: boolean;
    setLogout: () => void;
    activeUsers: ACTIVEUSERSLIST;
    unreadNotification: number;
    notifications: NOTIFICATION[];
    setNotifications: (notifs: NOTIFICATION[]) => void;
    onRedirectNotification: (notification: NOTIFICATION) => void;
    onMarkAsRead: (notification: NOTIFICATION) => void;
    updateNotificationCounter: (counter: number, reset?: boolean) => void;
};

const initialState = {
    auth: null,
    logout: false,
    setLogout: () => {},
    activeUsers: [],
    unreadNotification: 0,
    onMarkAsRead: () => null,
    onRedirectNotification: () => null,
    notifications: [],
    setNotifications: () => null,
    updateNotificationCounter: () => null,
};

const AccountContext = createContext<AccountState>(initialState);

type AccountProviderProps = PropsWithChildren & {
    auth: User | null;
};

const AccountProvider: React.FC<AccountProviderProps> = ({
    children,
    ...props
}) => {
    const { setProcess } = useProcessIndicator();
    const { toast } = useToast();
    const [auth] = useState<User | null>(props.auth);
    const [logout, setLogout] = useState(false);
    const [activeUsers, setActiveUsers] = useState<ACTIVEUSERSLIST>([]);
    const [notifications, setNotifications] = useState<NOTIFICATION[]>([]);
    const [newNotification, setNewNotification] = useState<NOTIFICATION | null>(
        null
    );
    const [unreadNotification, setUnreadNotification] = useState<number>(0);

    const onLogout = () => {
        setLogout(true);
        window.axios
            .post(route("logout"))
            .then((response) => {
                const status = response.data.status;

                if (status === "success") window.location.href = "/";
            })
            .catch((error) => {});
    };

    const updateNotificationCounter = (count: number, reset?: boolean) => {
        if (reset) {
            setUnreadNotification(0);
        } else {
            setUnreadNotification(unreadNotification + count);
        }
    };

    const onMarkAsRead = (notification: NOTIFICATION) => {
        const list = [...notifications];

        let notifindex = list.findIndex((n) => n.id === notification.id);
        list[notifindex].viewed = true;

        window.axios
            .get(route("notification.read", [notification.id]))
            .then(() => {
                unreadNotification !== 0 && updateNotificationCounter(-1);
                setNotifications(list);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onRedirectNotification = (notification: NOTIFICATION) => {
        if (!notification.viewed) onMarkAsRead(notification);

        router.get(
            route("notification.view", [notification.id]),
            {},
            {
                onBefore: () => setProcess(true),
            }
        );
    };

    useEffect(() => {
        if (auth) {
            window.Echo.join("active")
                .here((users: ACTIVEUSERSLIST) => {
                    setActiveUsers(users);
                    console.log(users);
                })
                .joining((user: ACTIVEUSERSTYPE) => {
                    let active_user = activeUsers.find(
                        (au) => au.id === user.id
                    );

                    if (!active_user) setActiveUsers([...activeUsers, user]);

                    console.log(user);
                })
                .leaving((user: ACTIVEUSERSTYPE) => {
                    let active_users = [...activeUsers];

                    let active_user_index = active_users.findIndex(
                        (aui) => aui.id === user.id
                    );

                    active_users.splice(active_user_index, 1);

                    setActiveUsers(active_users);
                })
                .error((error: ACTIVEUSERSTYPE) => {
                    console.log("error", error);
                });

            window.Echo.private("notification." + auth.id).listen(
                "NotificationEvent",
                (notification: any) => {
                    let notif = notification.notification as NOTIFICATION;

                    notif.details =
                        typeof notif.details === "string"
                            ? JSON.parse(notif.details)
                            : notif.details;

                    setNewNotification(notif);
                }
            );

            window.axios
                .get<NOTIFICATION[]>(route("notification"))
                .then((response) => {
                    let data = response.data;
                    const unread = data.filter((n) => !n.viewed);

                    setUnreadNotification(unread.length);

                    setNotifications(data);
                });
        }
    }, []);

    useEffect(() => {
        if (newNotification) {
            const newNotificationVolume = localStorage.getItem(
                "notification-volume"
            );

            updateNotificationCounter(1);
            setNotifications([newNotification, ...notifications]);

            if (!document.hasFocus()) {
                const sound = new Audio(notificationSound);
                sound.volume = newNotificationVolume
                    ? parseFloat(newNotificationVolume)
                    : 1;
                sound.play().catch(() => {});
            }

            toast({
                title: "New notification",
                description:
                    (newNotification?.from_user.role === "hr"
                        ? "HR"
                        : newNotification?.from_user.role === "principal"
                        ? "Principal"
                        : newNotification?.from_user?.full_name) +
                          " " +
                          newNotification?.details.message,
                status: "notification",
            });
        }
    }, [newNotification]);

    const value = {
        auth,
        logout,
        setLogout: onLogout,

        activeUsers,

        unreadNotification,
        updateNotificationCounter,

        notifications,
        setNotifications,

        onRedirectNotification,
        onMarkAsRead,
    };

    return (
        <AccountContext.Provider value={value} {...props}>
            {children}
        </AccountContext.Provider>
    );
};

const useAccount = () => {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error("useAccount must be used within a AccountProvider.");
    }

    return context;
};

export { AccountProvider, useAccount };
