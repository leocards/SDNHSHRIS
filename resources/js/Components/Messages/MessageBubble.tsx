import { User } from "@/Types";
import { COVERSATIONTYPE, useMessage } from "../Provider/message-provider";
import { useState } from "react";
import { cn } from "@/Lib/utils";
import { usePage } from "@inertiajs/react";

export type MessagePosition =
    | "sender-t"
    | "sender-m"
    | "sender-b"
    | "sender"
    | "receiver-b"
    | "receiver-t"
    | "receiver-m"
    | "receiver";

const MessageBubble: React.FC<{
    conversation: COVERSATIONTYPE;
    position: MessagePosition;
}> = ({ conversation, position }) => {
    const authid = usePage().props.auth.user.id
    // const { openedUser } = useMessage()

    // const [isSearched, setIsSearched] = useState(false)

    const messageBubbleVariant = {
        sender: "ml-auto mr-2 bg-blue-600 text-white",
        receiver: "ml-2 bg-accent",
    }[conversation?.sender === authid ? "sender" : "receiver"];

    const roundedBox = {
        "sender-t": "rounded-[1.25rem] rounded-br-md !mt-2",
        "sender-m": "rounded-[1.25rem] rounded-e-md",
        "sender-b": "rounded-[1.25rem] rounded-tr-md",
        sender: "rounded-[1.25rem]",
        "receiver-t": "rounded-[1.25rem] rounded-bl-md !mt-2",
        "receiver-m": "rounded-[1.25rem] rounded-s-md",
        "receiver-b": "rounded-[1.25rem] rounded-tl-md",
        receiver: "rounded-[1.25rem]",
    }[position];

    // useEffect(() => {
    //     if(searchConversation && searchConversation == message.id) {
    //         setIsSearched(true)
    //     }
    // }, [searchConversation])

    return (
        <div
            className={cn(
                "max-w-60 w-fit py-2 px-3",
                messageBubbleVariant,
                roundedBox,
                // isSearched && "!ring-1 !ring-ring !ring-offset-2 !ring-offset-slate-400"
            )}
            // id={"conversation_" + message.id?.toString()}
        >
            <div className="whitespace-pre-line break-words">
                {conversation.message}
            </div>
        </div>
    );
};

export default MessageBubble
