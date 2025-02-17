import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { ProfilePhoto } from "../ui/avatar";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "../ui/menubar";
import { BellOff, Check, Ellipsis, Trash2 } from "lucide-react";
import { usePopover } from "../ui/popover";
import { useMessage } from "@/Components/Provider/message-provider";
import TypographySmall from "../Typography";
import { getTimeFromNow } from "@/Types/types";
import { usePage } from "@inertiajs/react";
import { cn } from "@/Lib/utils";
import { Messages2 } from "iconsax-react";

type Props = {
    onDeleteMessage: (user: { id: number; name: string }) => void;
};

const MessageList = ({ onDeleteMessage }: Props) => {
    const { messages, selectConversation, setMessageAsSeen } = useMessage();
    const { close } = usePopover();
    const userid = usePage().props.auth.user.id;

    return messages.length === 0 ? (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit h-fit mx-auto pointer-events-none">
            <Messages2
                variant="Bulk"
                className="text-primary size-24 opacity-30 mx-auto"
            />
            <TypographySmall className="text-foreground/40 select-none">
                No messages
            </TypographySmall>
        </div>
    ) : (
        messages.map((message, index) => (
            <div key={index} className="relative group">
                <Card
                    className="rounded-md shadow-none border-none hover:bg-secondary transition duration-150"
                    role="button"
                    onClick={() => {
                        setMessageAsSeen(
                            message?.conversations?.id!,
                            message.id
                        );
                        selectConversation(message);
                        close();
                    }}
                >
                    <CardContent className="flex items-center p-0 px-3 gap-3 h-16">
                        <div className="size-fit my-auto">
                            <ProfilePhoto
                                className="size-10"
                                src={message?.user?.avatar ?? ""}
                            />
                        </div>
                        <div className="grow">
                            <CardTitle className="text-base font-medium leading-5 line-clamp-1">
                                {message?.user?.full_name}
                            </CardTitle>
                            <CardDescription
                                className={cn(
                                    "flex items-center",
                                    !message?.conversations?.seen_at &&
                                        userid !=
                                            message?.conversations?.sender &&
                                        "text-foreground font-medium"
                                )}
                            >
                                <div className="line-clamp-1 pr-1">
                                    {message?.conversations.sender == userid
                                        ? "You:"
                                        : ""}{" "}
                                    {message?.conversations.message}
                                </div>
                                <TypographySmall role="div" className="text-xs">
                                    &#8226;{" "}
                                    {getTimeFromNow(
                                        message?.conversations.created_at
                                    )}
                                </TypographySmall>
                            </CardDescription>
                            {!message?.conversations?.seen_at &&
                                userid != message?.conversations?.sender && (
                                    <div className="size-2.5 bg-primary rounded-full absolute top-1/2 -translate-y-1/2 right-2.5"></div>
                                )}
                        </div>
                    </CardContent>
                </Card>
                <Menubar className="rounded-full absolute top-1/2 -translate-y-1/2 right-2.5 shadow-none hidden group-hover:flex [&:has(button[data-state=open])]:flex">
                    <MenubarMenu>
                        <MenubarTrigger
                            className="rounded-full"
                            variant="ghost"
                            size="icon"
                        >
                            <Ellipsis />
                        </MenubarTrigger>
                        <MenubarContent className="">
                            <MenubarItem
                                className="gap-2"
                                onClick={() => {
                                    setMessageAsSeen(
                                        message?.conversations?.id!,
                                        message.id
                                    );
                                }}
                            >
                                <Check />
                                <div>Mark as read</div>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                                className="gap-2 !text-red-500 hover:!bg-red-100"
                                onClick={() => {
                                    onDeleteMessage({
                                        id: message?.user?.id,
                                        name: message?.user?.full_name,
                                    });
                                }}
                            >
                                <Trash2 />
                                <div>Delete Messages</div>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        ))
    );
};

export default MessageList;
