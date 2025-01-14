import React, { useEffect, useRef, useState } from "react";
import Modal, { ModalProps } from "../Modal";
import { COVERSATIONTYPE, useMessage } from "../Provider/message-provider";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Messages2, MessageText1, SearchNormal1 } from "iconsax-react";
import { X } from "lucide-react";
import useDebounce from "@/Hooks/useDebounce";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ProfilePhoto } from "../ui/avatar";
import TypographySmall from "../Typography";
import { getTimeFromNow } from "@/Types/types";
import { User } from "@/Types";

type Props = ModalProps & {};

const SearchMessage = ({ show, onClose }: Props) => {
    const { form, setSearchedConversation } = useMessage();
    const searchRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);
    const [conversations, setConversations] = useState<
        ({ sender: User } & Pick<
            COVERSATIONTYPE,
            "id" | "message" | "created_at"
        >)[]
    >([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (debouncedSearch) {
            setLoading(true);
            window.axios
                .get(
                    route("messages.search.conversation", {
                        userid: form.watch("userid"),
                        _query: {
                            search,
                        },
                    })
                )
                .then((response) => {
                    let data = response.data;

                    console.log(data);

                    setConversations(data);
                })
                .finally(() => setLoading(false));
        } else {
            setConversations([])
        }
    }, [debouncedSearch]);

    useEffect(() =>{
        if(show) {
            setConversations([])
            setSearch("")
        }
    }, [show])

    return (
        <Modal show={show} onClose={onClose} title="Search Conversation" center>
            <Button
                variant="outline"
                size="icon"
                className="size-8 absolute top-4 right-6"
                onClick={() => onClose(false)}
            >
                <X />
            </Button>

            <div className="mb-2.5 sticky top-0 z-10">
                <Input
                    ref={searchRef}
                    className="formInput pr-11"
                    placeholder="Search Conversation"
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

            <div className="h-[30rem] space-y-2 relative">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 mx-auto py-8 w-full absolute top-14">
                        <div className="loading loading-spinner loading-md"></div>
                        <TypographySmall>
                            Searching... please wait a moment.
                        </TypographySmall>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-fit mx-auto pointer-events-none">
                        <MessageText1
                            variant="Bulk"
                            className="text-primary size-24 opacity-30 mx-auto"
                        />
                        <TypographySmall className="text-foreground/40 select-none">
                            {!loading && debouncedSearch ? (
                                <span>No results found for "{search}"</span>
                            ) : (
                                <span>Start searching conversation</span>
                            )}
                        </TypographySmall>
                    </div>
                ) : (
                    conversations.map((convo, index) => (
                        <Card
                            key={index}
                            role="button"
                            className="hover:bg-secondary/60"
                            onClick={() => {
                                onClose(false);
                                setSearchedConversation(convo.id);
                            }}
                        >
                            <CardContent className="p-3 grid grid-cols-[auto,1fr] gap-4">
                                <div>
                                    <ProfilePhoto src={convo.sender.avatar} />
                                </div>
                                <div>
                                    <TypographySmall>
                                        {convo.sender.full_name}
                                    </TypographySmall>
                                    <div className="text-sm line-clamp-2">
                                        {convo.message}
                                    </div>
                                    <div className="text-xs text-foreground/60">
                                        {getTimeFromNow(convo.created_at)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </Modal>
    );
};

export default SearchMessage;
