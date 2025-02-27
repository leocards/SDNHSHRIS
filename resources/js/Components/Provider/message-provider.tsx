import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAccount } from "./auth-account-provider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import messageNotification from "@/Assets/sounds/message.mp3";
import newNotificationSound from "@/Assets/sounds/notification.mp3";
import { useToast } from "@/Hooks/use-toast";
import { formatDateToCustomISO } from "@/Types/types";

const MESSAGESCHEMA = z.object({
    userid: z.number(),
    message: z.string().optional().default(""),
});

type USER = { id: number; name: string; avatar: string } | null;

type COVERSATIONTYPE = {
    id: number | null;
    message_id: number;
    sender: number;
    message: string;
    seen_at: string | null;
    created_at: string;
};
type CONVERSATIONLIST = Array<COVERSATIONTYPE>;

type MESSAGELISTTYPE = {
    id: number;
    sender: number;
    receiver: number;
    conversations: COVERSATIONTYPE;
    user: { id: number; full_name: string; avatar: string | null };
};
type MESSAGELIST = Array<MESSAGELISTTYPE>;

type MessageState = {
    openMessageBox: boolean;
    closeMessageBox: () => void;

    selectConversation: (
        messageid: any,
        fromsearch?: boolean,
        fromnewsearch?: boolean
    ) => void;

    minimize: boolean;
    setMinimize: (value: boolean) => void;

    messages: MESSAGELIST;
    setMessages: (message: MESSAGELISTTYPE) => void;

    setNewMessagesList: (list: MESSAGELIST) => void;

    conversations: CONVERSATIONLIST;
    setConversations: (conversation: COVERSATIONTYPE) => void;

    setMessage: (message: MESSAGELISTTYPE) => void;

    openedUser: USER;

    unreadMessages: number;

    searchedConversation: number | null;
    setSearchedConversation: (convoid: number | null) => void;

    setMessageAsSeen: (convoid: number, messageid: number) => void;
    setAllMessageAsSeen: () => void;

    form: any;
};

const MessageContextProvider = createContext<MessageState>({
    openMessageBox: false,
    closeMessageBox: () => {},

    selectConversation: () => {},

    minimize: false,
    setMinimize: () => {},

    messages: [],
    setMessages: () => {},

    setNewMessagesList: () => {},

    conversations: [],
    setConversations: () => null,

    setMessage: () => null,

    openedUser: null,

    unreadMessages: 0,

    searchedConversation: null,
    setSearchedConversation: () => {},

    setMessageAsSeen: () => {},
    setAllMessageAsSeen: () => {},

    form: null,
});

const MessageProvider: React.FC<PropsWithChildren> = ({
    children,
    ...props
}) => {
    const { auth } = useAccount();
    const { toast } = useToast();
    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [minimize, setMinimize] = useState(false);
    const [messages, setMessages] = useState<MESSAGELIST>([]);
    const [conversations, setConversations] = useState<CONVERSATIONLIST>([]);
    const [newMessage, setNewMessage] = useState<MESSAGELISTTYPE>();
    const [openedUser, setOpenedUser] = useState<USER>(null); // selected user
    const [unreadMessages, setUnreadMessages] = useState<number>(0);
    const [searchedConversation, setSearchedConversation] = useState<
        number | null
    >(null);

    const messageNotificationVolume = localStorage.getItem("message-volume");

    const form = useForm<z.infer<typeof MESSAGESCHEMA>>({
        resolver: zodResolver(MESSAGESCHEMA),
        defaultValues: { message: "" },
    });

    const watchUserId = form.watch("userid");

    const pushNewSentMessage = (message: COVERSATIONTYPE) => {
        setConversations((m) => [...m, message]);
    };

    const onSetMessage = (newMessage: MESSAGELISTTYPE) => {
        let messagesCopy = [...messages];
        // Find the index of the user in the message list
        const messageIndex = messagesCopy.findIndex(
            (ml) => ml.id === newMessage.id
        );

        if (messageIndex !== -1) {
            const [element] = messagesCopy.splice(messageIndex, 1);

            element.conversations.message = newMessage.conversations.message;
            element.conversations.seen_at = new Date().toISOString();
            element.conversations.created_at =
                newMessage.conversations.created_at;

            messagesCopy.unshift(element);

            // Update the state with the new message list
            setMessages(messagesCopy);
        } else {
            setMessages((m) => [newMessage, ...m]);
        }
    };

    const getConversation = () => {
        window.axios
            .get(route("messages.conversation", [watchUserId]))
            .then((response) => {
                setConversations(response.data.conversations);
            });
    };

    useEffect(() => {
        if (newMessage) {
            let messagesList = [...messages];

            let mIndex = messagesList.findIndex((m) => m.id === newMessage.id);

            // if the message is not on the list, append the new message, otherwise move the message at the beginning
            if (mIndex === -1) {
                messagesList.unshift(newMessage);
            } else {
                // remove the element on the list and assign it to element
                const [element] = messagesList.splice(mIndex, 1);

                element.conversations.message =
                    newMessage.conversations.message;
                element.conversations.created_at = new Date().toISOString();

                if(!openMessageBox || (openedUser && openedUser.id !== newMessage.user.id))
                    element.conversations.seen_at = null

                // check if the user is on chatbox
                if (openMessageBox) {
                    if (openedUser?.id === newMessage.user.id) {
                        element.conversations.seen_at = new Date().toISOString();

                        // mark message as seen on the server
                        window.axios
                            .post(
                                route("messages.seen", [
                                    element.conversations.id,
                                ])
                            )
                            .then((response) => {
                                // console.log('message seen')
                            });

                        pushNewSentMessage(newMessage.conversations);
                    }
                }

                if (!openedUser) {
                    toast({
                        title: "New message",
                        description:
                            newMessage.user.full_name + " sent you a message.",
                        status: "message",
                    });
                    setUnreadMessages((u) => u + 1);
                }

                // append the remove element
                messagesList.unshift(element);
                // update messages
                setMessages(messagesList);
            }

            if (
                !document.hasFocus() ||
                !openedUser ||
                (openedUser && openedUser.id !== newMessage.user.id)
            ) {
                const sound = new Audio(messageNotification);
                sound.volume = messageNotificationVolume
                    ? parseFloat(messageNotificationVolume)
                    : 1;
                sound.play().catch(() => {});
            }

            console.log(newMessage);
        }
    }, [newMessage]);

    useEffect(() => {
        if (auth) {
            // get the messages and add it to the message list
            if (messages.length === 0) {
                window.axios
                    .get<MESSAGELIST>(route("messages"))
                    .then((response) => {
                        let messages = response.data;
                        const unread = messages.filter(
                            (n) =>
                                !n.conversations.seen_at &&
                                n.conversations.sender != auth.id
                        );

                        setUnreadMessages(unread.length);
                        setMessages(messages);
                    })
                    .catch((error) => console.log(error));
            }

            // receive new message
            window.Echo.private(`message.${auth.id}`).listen(
                "MessageEvent",
                (message: any) => {
                    let newMessage: MESSAGELISTTYPE = message.message;
                    setNewMessage(newMessage);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (watchUserId) {
            getConversation();
        }
    }, [watchUserId]);

    return (
        <MessageContextProvider.Provider
            value={{
                openMessageBox,
                closeMessageBox: () => {
                    setOpenMessageBox(false);

                    if (minimize) setMinimize(false);

                    setOpenedUser(null);
                },

                selectConversation: (
                    message: any,
                    fromsearch?: boolean,
                    fromnewsearch?: boolean
                ) => {
                    setMinimize(false);
                    setOpenMessageBox(true);

                    if (fromsearch && !fromnewsearch) {
                        form.setValue("userid", message.id);
                        setOpenedUser({
                            id: message.id,
                            name: message.full_name,
                            avatar: message.avatar,
                        });
                    } else if (!fromsearch && fromnewsearch) {
                        form.setValue("userid", message.id);
                        setOpenedUser({
                            id: message.id,
                            name: message.full_name,
                            avatar: message.avatar,
                        });
                    } else {
                        form.setValue("userid", message.user.id);
                        setOpenedUser({
                            id: message.user.id,
                            name: message.user.full_name,
                            avatar: message.user.avatar,
                        });
                    }
                },

                messages,
                setMessages: onSetMessage,

                conversations,
                setConversations: pushNewSentMessage,

                minimize,
                setMinimize,

                setMessage: onSetMessage,

                setNewMessagesList: (list: MESSAGELIST) => {
                    setMessages(list);
                },

                openedUser,

                unreadMessages,

                searchedConversation,
                setSearchedConversation,

                setMessageAsSeen: (convoid: number, messageid: number) => {
                    window.axios
                        .post(route("messages.seen", [convoid]))
                        .then((response) => {
                            let mess = [...messages]

                            let updateMessageIndex = mess.findIndex(({ id }) => id === messageid)

                            if(updateMessageIndex >= 0) {
                                mess[updateMessageIndex].conversations.seen_at = formatDateToCustomISO(new Date)
                            }

                            setMessages(mess)

                            if(unreadMessages > 0)
                                setUnreadMessages(unreadMessages - 1)
                        });
                },

                setAllMessageAsSeen: () => {
                    window.axios
                        .post(route("messages.seen.all"))
                        .then((response) => {
                            let mess = [...messages]

                            mess = mess.map((m) => {
                                if(!m.conversations.seen_at)
                                    m.conversations.seen_at = new Date().toISOString()

                                return m
                            })

                            setMessages(mess)

                            setUnreadMessages(0)
                        });
                },

                form,
            }}
            {...props}
        >
            {children}
        </MessageContextProvider.Provider>
    );
};

const useMessage = () => {
    const context = useContext(MessageContextProvider);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }

    return context;
};

export { MessageProvider, useMessage, MESSAGESCHEMA, type COVERSATIONTYPE };
