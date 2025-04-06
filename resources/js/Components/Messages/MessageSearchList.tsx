import React, { useEffect, useState } from "react";
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
import { Messages2 } from "iconsax-react";
import TypographySmall from "../Typography";

const MessageSearchList = ({ search }: { search: string }) => {
    const { selectConversation } = useMessage();
    const { close } = usePopover();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        setLoading(true);
        window.axios
            .get(route("messages.search", {_query: { search }}))
            .then((response) => {
                let data = response.data;
                setList(data);
            })
            .finally(() => setLoading(false));
    }, [search]);

    return (
        <div className="grow h-full">
            {loading ? (
                <div className="flex flex-col items-center gap-4 mx-auto py-8 w-full">
                    <div className="loading loading-spinner loading-md"></div>
                    <TypographySmall>
                        Please wait a moment...
                    </TypographySmall>
                </div>
            ) : list.length === 0 && !loading ? (
                <div
                    className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit h-fit mx-auto pointer-events-none"
                >
                    <Messages2
                        variant="Bulk"
                        className="text-primary size-24 opacity-30 mx-auto"
                    />
                    <TypographySmall className="text-foreground/40 select-none">
                        No results found for "{search}"
                    </TypographySmall>
                </div>
            ) : (
                <div className="relative group">
                    {list.map((item, index) => (
                        <Card
                            key={index}
                            className="rounded-md shadow-none border-none hover:bg-secondary transition duration-150"
                            role="button"
                            onClick={() => {
                                selectConversation(item, true);
                                close();
                            }}
                        >
                            <CardContent className="flex items-center p-2 px-3 gap-3">
                                <div className="size-fit my-auto">
                                    <ProfilePhoto
                                        className="size-10"
                                        src={item?.src}
                                    />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-medium leading-5 line-clamp-1">
                                        {item?.full_name}
                                    </CardTitle>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageSearchList;
