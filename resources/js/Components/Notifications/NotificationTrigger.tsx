import {
    PopoverContainer,
    PopoverContent,
    PopoverProvider,
    PopoverTrigger,
} from "../ui/popover";
import { TooltipLabel } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Messages2 } from "iconsax-react";
import NotificationFloatingList from "../Notifications/NotificationFloatingList";
import { useAccount } from "../Provider/auth-account-provider";

const NotificationTrigger = () => {
    const { unreadNotification } = useAccount();

    return (
        <PopoverProvider>
            <PopoverContainer>
                {({ open }) => (
                    <>
                        <TooltipLabel label="Notifications">
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="data-[state=true]:bg-accent data-[state=true]:text-accent-foreground relative"
                                    data-state={open}
                                >
                                    {!open ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.75}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}

                                    {unreadNotification !== 0 && (
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
                            className="w-fit p-0 rounded-md overflow-hidden mt-1 max-sm:-mr-10 transition-all duration-200"
                            align="end"
                        >
                            <NotificationFloatingList />
                        </PopoverContent>
                    </>
                )}
            </PopoverContainer>
        </PopoverProvider>
    );
};

export default NotificationTrigger;
