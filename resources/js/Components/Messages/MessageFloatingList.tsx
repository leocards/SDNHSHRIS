import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "../ui/button";
import { Check, Plus, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import MessageList from "./MessageList";
import { TooltipLabel } from "../ui/tooltip";
import { MessageAdd1, SearchNormal1 } from "iconsax-react";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/Hooks/useDebounce";
import NewMessageSearchList from "./NewMessageSearchList";
import { useMessage } from "../Provider/message-provider";
import MessageSearchList from "./MessageSearchList";

const MessageFloatingList = () => {
    const { unreadMessages } = useMessage();
    const searchRef = useRef<HTMLInputElement>(null);
    const [newMessage, setNewMessage] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);

    useEffect(() => {
        if (search) {
            setSearch("");
        }
    }, [newMessage]);

    return (
        <Card className="grid grid-rows-[auto,auto,1fr,auto] w-[380px] h-[37rem] border-none shadow-none rounded-none">
            <CardHeader className="relative !flex flex-row items-center justify-between py-4 border-b border-border">
                <div>
                    <CardTitle className="text-lg leading-4">
                        Messages
                    </CardTitle>
                    <CardDescription>
                        You have 3 unread messages
                    </CardDescription>
                </div>
                <TooltipLabel label="New Message" className="!mt-0">
                    <Button
                        className="size-8"
                        variant="outline"
                        size="icon"
                        onClick={() => setNewMessage(!newMessage)}
                    >
                        <MessageAdd1
                            className="!size-4 absolute rotate-0 scale-100 data-[invisible]:rotate-90 data-[invisible]:scale-0 transition duration-300"
                            data-invisible={newMessage ? true : undefined}
                        />
                        <X
                            className="!size-4 absolute rotate-90 scale-0 data-[invisible]:rotate-0 data-[invisible]:scale-100 transition duration-300"
                            data-invisible={newMessage ? true : undefined}
                        />
                    </Button>
                </TooltipLabel>
            </CardHeader>
            <div className="p-2.5 pb-0">
                <div className="mb-2.5 sticky top-0 z-10">
                    <Input
                        ref={searchRef}
                        className="formInput pr-11"
                        placeholder={
                            newMessage
                                ? "Search new user to message"
                                : "Search user"
                        }
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            search && setSearch("");
                            searchRef.current?.focus();
                        }}
                        variant="ghost"
                        size="icon"
                        className="size-7 absolute top-1/2 -translate-y-1/2 right-1.5"
                    >
                        <SearchNormal1
                            data-search={search ? true : undefined}
                            className="absolute !size-4 scale-100 rotate-0 data-[search]:scale-0 data-[search]:rotate-90 transition duration-300"
                        />
                        <X
                            data-search={search ? true : undefined}
                            className="absolute scale-0 rotate-90 data-[search]:rotate-0 data-[search]:scale-100 transition duration-300"
                        />
                    </Button>
                </div>
            </div>
            <CardContent className="text-sm space-y px-3 relative ">
                {newMessage && (
                    <NewMessageSearchList search={debouncedSearch} />
                )}
                {!newMessage && search && (
                    <MessageSearchList search={debouncedSearch} />
                )}
                {!newMessage && !search && <MessageList />}
            </CardContent>
            {!newMessage && !search && (
                <CardFooter className="mt-5 h-[56px]">
                    <Button className="w-full" disabled={!unreadMessages}>
                        <Check /> Mark all as read
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default MessageFloatingList;
