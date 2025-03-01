import {
    PopoverContainer,
    PopoverContent,
    PopoverProvider,
    PopoverTrigger,
} from "../ui/popover";
import { TooltipLabel } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Messages2 } from "iconsax-react";
import MessageFloatingList from "./MessageFloatingList";
import { useMessage } from "../Provider/message-provider";

const MessagesTrigger = () => {
    const { unreadMessages } = useMessage()

    return (
        <PopoverProvider>
            <PopoverContainer>
                {({ open }) => (
                    <>
                        <TooltipLabel label="Messages">
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="data-[state=true]:bg-accent data-[state=true]:text-accent-foreground"
                                    data-state={open}
                                >
                                    <Messages2
                                        color="currentColor"
                                        variant={open ? "Bold" : "Outline"}
                                    />

                                    {unreadMessages !== 0 && (
                                        <span className="flex h-3 w-3 absolute top-1 right-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                        </TooltipLabel>

                        <PopoverContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            className="w-[calc(100vw-12px)] xs:w-fit p-0 rounded-md overflow-hidden mt-1 max-xs:mr-2 max-sm:mr-10 transition-all duration-200 max-sm:px-2"
                            align="center"
                        >
                            <MessageFloatingList />
                        </PopoverContent>
                    </>
                )}
            </PopoverContainer>
        </PopoverProvider>
    );
};

export default MessagesTrigger;
