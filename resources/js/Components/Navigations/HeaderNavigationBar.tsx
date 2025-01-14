import { SidebarTrigger, useSidebar } from "@/Components/ui/sidebar";
import { ChevronDown, Menu, Plus, Settings, SquarePen, X } from "lucide-react";
import { ProfilePhoto } from "../ui/avatar";
import { router, usePage } from "@inertiajs/react";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "../ui/menubar";
import { TooltipLabel } from "../ui/tooltip";
import { Add, Edit, LogoutCurve, Setting2, UserSquare } from "iconsax-react";
import MessagesTrigger from "../Messages/MessagesTrigger";
import NotificationTrigger from "../Notifications/NotificationTrigger";
import { useAccount } from "@/Components/Provider/auth-account-provider";
import SchoolYear from "@/Pages/SchoolYear/SchoolYear";
import { useProcessIndicator } from "../Provider/process-indicator-provider";

interface Props {}

const HeaderNavigationBar: React.FC<Props> = ({}) => {
    const { open } = useSidebar();
    const { user } = usePage().props.auth;
    const { setLogout } = useAccount();
    const { setProcess } = useProcessIndicator();

    return (
        <div className="header-nav">
            <SidebarTrigger />

            <div className="ml-auto relative">
                <MessagesTrigger />
            </div>

            <div className="ml-1.5 relative">
                <NotificationTrigger />
            </div>

            <div className="border-l border-border mx-3 h-7" />

            <div className="flex items-center max-sm:hidden">
                <SchoolYear />

                <div className="border-l border-border mx-3 h-7" />

                <Menubar className="size-fit shadow-none">
                    <MenubarMenu>
                        <TooltipLabel label="Account">
                            <MenubarTrigger
                                asChild
                                className="px-1.5 pr-2 py-1 !h-10"
                            >
                                <ProfilePhoto src={user.avatar} className="size-7" />

                                <div className="text-left max-lg:hidden min-w-20">
                                    <div className="line-clamp-1">
                                        {user?.firstname} {user?.lastname}
                                    </div>
                                    <div className="text-[11px] leading-3 mb-px">
                                        SDNHS-{user?.position??"HR"}
                                    </div>
                                </div>

                                <div>
                                    <ChevronDown className="!size-3.5" />
                                </div>
                            </MenubarTrigger>
                        </TooltipLabel>

                        <MenubarContent
                            align="end"
                            alignOffset={0}
                            className="min-w-[10.5rem]"
                        >
                            <MenubarItem
                                className="space-x-2"
                                onClick={() =>
                                    router.get(
                                        route("profile.edit"),
                                        {},
                                        {
                                            onBefore: () => setProcess(true),
                                        }
                                    )
                                }
                            >
                                <UserSquare variant="Outline" />
                                <div>Account</div>
                            </MenubarItem>
                            <MenubarItem
                                className="space-x-2"
                                onClick={() =>
                                    router.get(
                                        route("profile.edit"),
                                        {
                                            t: 'settings'
                                        },
                                        {
                                            onBefore: () => setProcess(true),
                                        }
                                    )
                                }
                            >
                                <Setting2 variant="Outline" />
                                <div>Settings</div>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem
                                className="space-x-2"
                                onClick={setLogout}
                            >
                                <LogoutCurve variant="Outline" />

                                <div>Log out</div>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>

            <Menubar className="size-fit shadow-none sm:hidden">
                <MenubarMenu>
                    <MenubarTrigger
                        asChild
                        className="relative group"
                        size={"icon"}
                    >
                        <Menu className="size-7 absolute rotate-0 scale-100 transition-all group-data-[state=open]:rotate-90 group-data-[state=open]:scale-0" />
                        <X className="size-7 absolute rotate-90 scale-0 transition-all group-data-[state=open]:rotate-0 group-data-[state=open]:scale-100" />
                    </MenubarTrigger>
                    <MenubarContent
                        align="end"
                        alignOffset={0}
                        className="min-w-[12rem] max-w-[14rem]"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ProfilePhoto src={user.avatar}
                                className="size-7"
                                fallbackSize={15}
                            />
                            <div className="text-left min-w-20 opacity-80">
                                <div className="line-clamp-1">
                                    {user?.firstname} {user?.lastname}
                                </div>
                                <div className="text-[11px] leading-3 mb-px">
                                    SDNHS-{user?.position??"HR"}
                                </div>
                            </div>
                        </div>

                        <MenubarSeparator />

                        <MenubarSub>
                            <MenubarSubTrigger>SY 2024-2025</MenubarSubTrigger>
                            <MenubarSubContent className="[@media_(max-width:360px)]:!-mr-[8rem] [@media_(max-width:360px)]:mt-9">
                                <MenubarItem className="space-x-2">
                                    <Plus />
                                    <div>New School Year</div>
                                </MenubarItem>
                                <MenubarItem className="space-x-2">
                                    <SquarePen />
                                    <div>Edit School Year</div>
                                </MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>

                        <MenubarSeparator />

                        <MenubarItem
                            className="space-x-2"
                            onClick={() =>
                                router.get(
                                    route("profile.edit"),
                                    {},
                                    {
                                        onBefore: () => setProcess(true),
                                    }
                                )
                            }
                        >
                            <UserSquare variant="Outline" />
                            <div>Account</div>
                        </MenubarItem>
                        <MenubarItem className="space-x-2">
                            <Settings />
                            <div>Settings</div>
                        </MenubarItem>

                        <MenubarSeparator />

                        <MenubarItem className="space-x-2" onClick={setLogout}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                />
                            </svg>

                            <div>Log out</div>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
};

export default HeaderNavigationBar;
