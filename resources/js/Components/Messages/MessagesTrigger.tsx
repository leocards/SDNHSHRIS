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

const MessagesTrigger = () => {
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
                                </Button>
                            </PopoverTrigger>
                        </TooltipLabel>

                        <PopoverContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            className="w-fit p-0 rounded-md overflow-hidden mt-1 max-sm:-mr-20 transition-all duration-200"
                            align="end"
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
