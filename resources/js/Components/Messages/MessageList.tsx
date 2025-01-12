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

const MessageList = () => {
    const { messages, selectConversation } = useMessage()
    const { close } = usePopover();
    const userid = usePage().props.auth.user.id

    return messages.map((message, index) => (
        <div key={index} className="relative group">
            <Card
                className="rounded-md shadow-none border-none hover:bg-secondary transition duration-150"
                role="button"
                onClick={() => {
                    selectConversation(message)
                    close()
                }}
            >
                <CardContent className="flex items-center p-0 px-3 gap-3 h-16">
                    <div className="size-fit my-auto">
                        <ProfilePhoto className="size-10" src={message.user.avatar??""} />
                    </div>
                    <div className="grow">
                        <CardTitle className="text-base font-medium leading-5 line-clamp-1">
                            {message.user.full_name}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                            <div className="line-clamp-1 pr-3">{(message.conversations.sender == userid ? "You:":"")} {message.conversations.message}</div>
                            <TypographySmall role="div" className="text-xs ml-auto">{getTimeFromNow(message.conversations.created_at)}</TypographySmall>
                        </CardDescription>
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
                        <MenubarItem className="gap-2">
                            <Check />
                            <div>Mark as read</div>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem className="gap-2 !text-red-500 hover:!bg-red-100">
                            <Trash2 />
                            <div>Delete Messages</div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    ));
};

export default MessageList;
