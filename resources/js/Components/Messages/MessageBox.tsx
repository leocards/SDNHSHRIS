import { ProfilePhoto } from "../ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { TooltipLabel } from "../ui/tooltip";
import { BellOff, EllipsisVertical, Minus, X } from "lucide-react";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "../ui/menubar";
import {
    ExportCurve,
    Maximize2,
    MessageSearch,
    Send2,
    Trash,
} from "iconsax-react";
import {
    MESSAGESCHEMA,
    useMessage,
} from "@/Components/Provider/message-provider";
import { Form, FormTextArea } from "../ui/form";
import { z } from "zod";
import MessageBubble, { MessagePosition } from "./MessageBubble";
import { usePage } from "@inertiajs/react";
import { useAccount } from "../Provider/auth-account-provider";

const MessageBox = () => {
    const authid = usePage().props.auth.user.id;
    const {
        form,
        minimize,
        openedUser,
        conversations,
        setMessages,
        setMinimize,
        closeMessageBox,
        setConversations,
    } = useMessage();
    const { activeUsers } = useAccount();

    const onSubmit = (data: z.infer<typeof MESSAGESCHEMA>) => {
        window.axios.post(route("messages.send"), data).then((response) => {
            let newSentMessage = response.data.message;

            setConversations(response.data.message.conversations);

            setMessages(newSentMessage);

            console.log(newSentMessage);
        });

        form.setValue("message", "");
    };

    function checkNextEqual(message: any, index: number) {
        return (
            conversations[index + 1] &&
            message.sender == conversations[index + 1]?.sender
        );
    }

    function checkPrevEqual(message: any, index: number) {
        return (
            index !== 0 && conversations[index - 1]?.sender == message.sender
        );
    }

    const formatMessage = (messenger: any, index: number): MessagePosition => {
        if (messenger.sender === authid) {
            if (
                checkNextEqual(messenger, index) &&
                checkPrevEqual(messenger, index)
            ) {
                return "sender-m";
            } else if (checkNextEqual(messenger, index)) return "sender-t";
            else if (checkPrevEqual(messenger, index)) return "sender-b";
            else return "sender";
        } else {
            if (
                checkNextEqual(messenger, index) &&
                checkPrevEqual(messenger, index)
            ) {
                return "receiver-m";
            } else if (checkNextEqual(messenger, index)) return "receiver-t";
            else if (checkPrevEqual(messenger, index)) return "receiver-b";
            else return "receiver";
        }
    };

    return (
        <Card
            className="fixed bottom-0 transition-all !shadow-lg duration-200 data-[view=true]:h-[48.8px] right-4 sm:right-16 w-[360px] h-[477.2px] grid grid-rows-[auto,1fr,auto] rounded-md rounded-b-none z-40 overflow-hidden"
            data-view={minimize}
        >
            <CardHeader className="border-b border-border flex !flex-row gap-1 items-center p-1.5">
                <Menubar className="h-fit !m-0 shadow-none dark:bg-transparent">
                    <MenubarMenu>
                        <TooltipLabel label="More">
                            <MenubarTrigger
                                className="size-7 m-0"
                                variant="ghost"
                            >
                                <EllipsisVertical className="!size-4" />
                            </MenubarTrigger>
                        </TooltipLabel>
                        <MenubarContent align="end">
                            <MenubarItem className="gap-2">
                                <MessageSearch />
                                <div>Search Message</div>
                            </MenubarItem>
                            <MenubarItem className="gap-2">
                                <ExportCurve />
                                <div>Export Messages</div>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="gap-2 !text-red-500 dark:hover:!bg-destructive/30 hover:!bg-red-100">
                                <Trash />
                                <div>Delete Messages</div>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <div className="size-fit !m-0">
                    <ProfilePhoto src={openedUser?.avatar ?? ""} />
                </div>
                <div className="grow !m-0 !ml-3">
                    <CardTitle className="font-medium line-clamp-1">
                        {openedUser?.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {activeUsers.find(({id}) => id === openedUser?.id) ? "Active" : "Offline"}
                    </CardDescription>
                </div>
                <div className="!mt-0 mr-1 flex items-center gap-1">
                    <TooltipLabel label="Minimize">
                        <Button
                            className="size-7 m-0 relative"
                            variant="ghost"
                            size="icon"
                            onClick={() => setMinimize(!minimize)}
                        >
                            {minimize ? (
                                <Maximize2 className="!size-4" />
                            ) : (
                                <Minus className="!size-4" />
                            )}
                        </Button>
                    </TooltipLabel>
                    <TooltipLabel label="Close">
                        <Button
                            className="size-7 m-0"
                            variant="ghost"
                            size="icon"
                            onClick={closeMessageBox}
                        >
                            <X className="!size-4" />
                        </Button>
                    </TooltipLabel>
                </div>
            </CardHeader>
            <CardContent className="transition-all duration-200 flex flex-col-reverse overflow-y-auto py-2 p-0 relative">
                <div className="">
                    <div className="flex flex-col">
                        <div className="flex gap-0.5 flex-col py-2">
                            {conversations.map((item, index) => (
                                <MessageBubble
                                    key={index}
                                    position={formatMessage(item, index)}
                                    conversation={item}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter
                data-view={minimize}
                className="p-2 data-[view=true]:h-0 border-t border-border transition-all duration-200 shadow overflow-hidden"
            >
                <div className="relative w-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-[1fr,auto] items-end gap-2 w-full"
                        >
                            <FormTextArea
                                form={form}
                                name="message"
                                label=""
                                required={false}
                                minHeight={-1}
                                placeholder="Aa"
                                textAreaClass="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none px-2 py-1 pt-2 focus-visible:border-primary"
                            />

                            <Button className="size-[38px]" size="icon">
                                <Send2 />
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardFooter>
        </Card>
    );
};

export default MessageBox;
