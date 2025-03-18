import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "../ui/sidebar";
import sdnhslogo from "@/Assets/images/sdnhs-logo.png";
import { cn } from "@/Lib/utils";
import {
    ArchiveBox,
    ArrowDown2,
    Chart2,
    ChartSuccess,
    DocumentForward,
    DocumentText,
    DocumentText1,
    FavoriteChart,
    Home2,
    Note,
    Profile,
    Profile2User,
    Receipt1,
    SearchNormal1,
    TaskSquare,
    UserSquare,
    UserTick,
} from "iconsax-react";
import { router, usePage } from "@inertiajs/react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import { useProcessIndicator } from "../Provider/process-indicator-provider";
import { X } from "lucide-react";

const SideNavigationBar = () => {
    const { url, props } = usePage();
    const { state, isMobile, toggleSidebar, setOpen } = useSidebar();
    const { setProcess } = useProcessIndicator();

    const navigateTo = (url: URL | string, options?: any) => {
        router.get(
            url,
            {},
            {
                ...options,
                onBefore: () => setProcess(true),
            }
        );
    };

    return (
        <Sidebar collapsible="icon">
            {isMobile && (
                <SidebarTrigger className="absolute top-2 -right-4 bg-background z-40 text-foreground" icon={<X />} />
            )}
            <SidebarHeader className="mb-4">
                <SidebarMenu>
                    <SidebarMenuItem
                        className={cn(
                            "flex items-center font-bold text-lg",
                            state == "expanded" ? "px-3" : "px-1.5"
                        )}
                    >
                        <div
                            className={cn(
                                "size-11 shrink-0",
                                state == "collapsed" && "size-9 "
                            )}
                        >
                            <img src={sdnhslogo} />
                        </div>
                        <div
                            className={cn(
                                "grow pl-4 text-nowrap overflow-x-hidden",
                                (state == "collapsed" && !isMobile) && "hidden"
                            )}
                        >
                            SDNHS - HRIS
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-3 pb-4">
                <SidebarMenu
                    className={cn(state == "collapsed" && "items-ce nter")}
                >
                    <AuthTabs tab="generalsearch">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="General Search"
                                isActive={url.startsWith("/general-search")}
                                onClick={() => navigateTo(route("general-search"))}
                            >
                                <SearchNormal1
                                    variant={
                                        url.startsWith("/general-search")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    General Search
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarSeparator className="my-3" />
                    </AuthTabs>

                    <AuthTabs tab="dashboard">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Dashboard"
                                isActive={url.startsWith("/dashboard")}
                                onClick={() => navigateTo(route("dashboard"))}
                            >
                                <Home2
                                    variant={
                                        url.startsWith("/dashboard")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    Dashboard
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>

                    <AuthTabs tab="personnel">
                        <CollapsibleSidebarItem
                            isActive={url.startsWith("/personnel")}
                            defaultOpen={url.startsWith("/personnel")}
                        >
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip="Personnel"
                                    isActive={url.startsWith("/personnel")}
                                    isNav={false}
                                >
                                    <Profile2User
                                        variant={
                                            url.startsWith("/personnel")
                                                ? "Bulk"
                                                : "Linear"
                                        }
                                    />
                                    <span
                                        className={cn(
                                            (state == "collapsed" && !isMobile) && "hidden"
                                        )}
                                    >
                                        Personnel
                                    </span>

                                    {state == "expanded" && (
                                        <ArrowDown2 className="!size-4 ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                                    )}
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <AuthTabs tab="personnel.teaching">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                isActive={
                                                    url.startsWith(
                                                        "/personnel/r/teaching"
                                                    ) ||
                                                    url.startsWith(
                                                        "/personnel/create/teaching"
                                                    )
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("personnel", [
                                                            "teaching",
                                                        ])
                                                    )
                                                }
                                            >
                                                <UserSquare
                                                    variant={
                                                        url.startsWith(
                                                            "/personnel/r/teaching"
                                                        ) ||
                                                        url.startsWith(
                                                            "/personnel/create/teaching"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Teaching</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="personnel.non-teaching">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                isActive={
                                                    url.startsWith(
                                                        "/personnel/r/non-teaching"
                                                    ) ||
                                                    url.startsWith(
                                                        "/personnel/create/non-teaching"
                                                    )
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("personnel", [
                                                            "non-teaching",
                                                        ])
                                                    )
                                                }
                                            >
                                                <Profile
                                                    variant={
                                                        url.startsWith(
                                                            "/personnel/r/non-teaching"
                                                        ) ||
                                                        url.startsWith(
                                                            "/personnel/create/non-teaching"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Non-teaching</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="personnel.tardiness">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                isActive={url.startsWith(
                                                    "/personnel/tardiness"
                                                )}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route(
                                                            "personnel.tardiness"
                                                        )
                                                    )
                                                }
                                            >
                                                <UserTick
                                                    variant={
                                                        url.startsWith(
                                                            "/personnel/tardiness"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Tardiness</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="personnel.archive">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                isActive={
                                                    url.startsWith(
                                                        "/personnel/personnel-archive"
                                                    )
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("personnel.archive")
                                                    )
                                                }
                                            >
                                                <ArchiveBox
                                                    variant={
                                                        url.startsWith(
                                                            "/personnel/personnel-archive"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Personnel Archive</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </CollapsibleSidebarItem>
                    </AuthTabs>

                    <AuthTabs tab="myapprovals">
                        <CollapsibleSidebarItem
                            isActive={url.startsWith("/myapproval")}
                            defaultOpen={url.startsWith("/myapproval")}
                        >
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="My Approval" isNav={false}>
                                    <TaskSquare
                                        variant={
                                            url.startsWith("/myapproval")
                                                ? "Bulk"
                                                : "Linear"
                                        }
                                    />
                                    <span
                                        className={cn(
                                            (state == "collapsed" && !isMobile) && "hidden",
                                            "text-nowrap"
                                        )}
                                    >
                                        My Approval
                                    </span>

                                    {state == "expanded" && (
                                        <ArrowDown2 className="!size-4 ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                                    )}
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <AuthTabs tab="myapprovals.leave">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route(
                                                            "myapproval.leave"
                                                        )
                                                    )
                                                }
                                                isActive={url.startsWith(
                                                    "/myapproval/leave"
                                                )}
                                            >
                                                <DocumentForward
                                                    variant={
                                                        url.startsWith(
                                                            "/myapproval/leave"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Leave</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myapprovals.locatorslip">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route(
                                                            "myapproval.locatorslip"
                                                        )
                                                    )
                                                }
                                                isActive={url.startsWith(
                                                    "/myapproval/locatorslip"
                                                )}
                                            >
                                                <DocumentText1
                                                    variant={
                                                        url.startsWith(
                                                            "/myapproval/locatorslip"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Locator Slip</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myapprovals.pds">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                isActive={url.startsWith(
                                                    "/myapproval/pds"
                                                )}
                                                onClick={() => {
                                                    navigateTo(
                                                        route("myapproval.pds")
                                                    );
                                                }}
                                            >
                                                <DocumentText
                                                    variant={
                                                        url.startsWith(
                                                            "/myapproval/pds"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Personal Data Sheet</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myapprovals.saln">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                isActive={url.startsWith(
                                                    "/myapproval/saln"
                                                )}
                                                onClick={() => {
                                                    navigateTo(
                                                        route("myapproval.saln")
                                                    );
                                                }}
                                            >
                                                <Receipt1
                                                    variant={
                                                        url.startsWith(
                                                            "/myapproval/saln"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>SALN</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myapprovals.sr">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                isActive={url.startsWith(
                                                    "/myapproval/service-record"
                                                )}
                                                onClick={() => {
                                                    navigateTo(
                                                        route("myapproval.sr")
                                                    );
                                                }}
                                            >
                                                <ChartSuccess
                                                    variant={
                                                        url.startsWith(
                                                            "/myapproval/service-record"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Service Record</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </CollapsibleSidebarItem>
                    </AuthTabs>

                    <AuthTabs tab="myreports">
                        <CollapsibleSidebarItem
                            isActive={url.startsWith("/myreports")}
                            defaultOpen={url.startsWith("/myreports")}
                        >
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="My Reports" isNav={false}>
                                    <Chart2
                                        variant={
                                            url.startsWith("/myreports")
                                                ? "Bulk"
                                                : "Linear"
                                        }
                                    />
                                    <span
                                        className={cn(
                                            (state == "collapsed" && !isMobile) && "hidden",
                                            "text-nowrap"
                                        )}
                                    >
                                        My Reports
                                    </span>

                                    {state == "expanded" && (
                                        <ArrowDown2 className="!size-4 ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                                    )}
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <AuthTabs tab="myreports.lp">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("myreports.lp")
                                                    )
                                                }
                                                isActive={url.startsWith(
                                                    "/myreports/list-of-personnel"
                                                )}
                                            >
                                                <Profile2User
                                                    variant={
                                                        url.startsWith(
                                                            "/myreports/list-of-personnel"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>List of Personnel</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myreports.ipcr">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("myreports.ipcr")
                                                    )
                                                }
                                                isActive={url.startsWith(
                                                    "/myreports/ipcr"
                                                )}
                                            >
                                                <FavoriteChart
                                                    variant={
                                                        url.startsWith(
                                                            "/myreports/ipcr"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>IPCR</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myreports.saln">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("myreports.saln")
                                                    )
                                                }
                                                isActive={url.startsWith(
                                                    "/myreports/saln"
                                                )}
                                            >
                                                <Receipt1
                                                    variant={
                                                        url.startsWith(
                                                            "/myreports/saln"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>SALN</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                    <AuthTabs tab="myreports.logs">
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigateTo(
                                                        route("myreports.logs")
                                                    )
                                                }
                                                isActive={url.startsWith(
                                                    "/myreports/logs"
                                                )}
                                            >
                                                <Note
                                                    variant={
                                                        url.startsWith(
                                                            "/myreports/logs"
                                                        )
                                                            ? "Bulk"
                                                            : "Linear"
                                                    }
                                                />
                                                <span>Logs</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </AuthTabs>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </CollapsibleSidebarItem>
                    </AuthTabs>

                    <AuthTabs tab="pds">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Personal Data Sheet"
                                isActive={url.startsWith("/pds")}
                                onClick={() => {
                                    navigateTo(route("pds"));
                                }}
                            >
                                <DocumentText
                                    variant={
                                        url.startsWith("/pds")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    Personal Data Sheet
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>

                    <AuthTabs tab="sr">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Service Record"
                                isActive={url.startsWith(
                                    "/service-record"
                                )}
                                onClick={() => {
                                    navigateTo(route("sr"));
                                }}
                            >
                                <ChartSuccess
                                    variant={
                                        url.startsWith("/sr")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    Service Record
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>

                    <AuthTabs tab="tardiness">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Tardiness"
                                isActive={url.startsWith("/tardiness")}
                                onClick={() => navigateTo(route("tardiness"))}
                            >
                                <UserTick
                                    variant={
                                        url.startsWith("/tardiness")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    Tardiness
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>

                    <AuthTabs tab="leave">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Leave"
                                isActive={url.startsWith("/leave")}
                                onClick={() => {
                                    navigateTo(route("leave"));
                                }}
                            >
                                <DocumentForward
                                    variant={
                                        url.startsWith("/leave")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    {props.auth.user.role === "principal" &&
                                        "My"}{" "}
                                    Leave
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>

                    <AuthTabs tab="locatorslip">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Leave"
                                isActive={url.startsWith("/locatorslip")}
                                onClick={() => {
                                    navigateTo(route("locatorslip"));
                                }}
                            >
                                <DocumentText1
                                    variant={
                                        url.startsWith("/locatorslip")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    {props.auth.user.role === "principal" &&
                                        "My"}{" "}
                                    Locator Slip
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>

                    <AuthTabs tab="saln">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="SALN"
                                onClick={() => {
                                    navigateTo(route("saln"));
                                }}
                                isActive={url.startsWith("/saln")}
                            >
                                <Receipt1
                                    variant={
                                        url.startsWith("/saln")
                                            ? "Bulk"
                                            : "Linear"
                                    }
                                />
                                <span
                                    className={cn(
                                        (state == "collapsed" && !isMobile) && "hidden"
                                    )}
                                >
                                    SALN
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AuthTabs>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
};

const CollapsibleSidebarItem: React.FC<
    { isActive?: boolean; defaultOpen?: boolean } & PropsWithChildren
> = ({ children, isActive, defaultOpen }) => {
    const { state, setOpen } = useSidebar();
    const [openCollapse, setOpenCollapse] = useState(false);

    useEffect(() => {
        if (state == "collapsed" && !isActive) {
            setOpenCollapse(false);
        }
    }, [state]);

    useEffect(() => {
        if (defaultOpen && isActive) {
            setOpenCollapse(true);
        }
    }, [defaultOpen, isActive]);

    return (
        <Collapsible
            className="group/collapsible"
            open={openCollapse}
            onOpenChange={(open) => {
                if (open && state === "collapsed") {
                    setOpen(true);
                }
                setOpenCollapse(open);
            }}
        >
            <SidebarMenuItem>{children}</SidebarMenuItem>
        </Collapsible>
    );
};

const tabs = [
    "generalsearch",
    "dashboard",
    "personnel",
    "personnel.teaching",
    "personnel.non-teaching",
    "personnel.tardiness",
    "myapprovals",
    "myapprovals.leave",
    "myapprovals.pds",
    "myapprovals.saln",
    "myapprovals.sr",
    "myreports",
    "myreports.lp",
    "myreports.ipcr",
    "myreports.saln",
    "myreports.coc",
    "myreports.logs",
    "leave",
    "saln",
    "sr",
    "tardiness",
    "pds",
    "personnel.archive",
    "myapprovals.locatorslip",
    "locatorslip"
] as const;

const AuthTabs: React.FC<{
    tab: (typeof tabs)[number];
    children: React.ReactNode;
}> = (props) => {
    const role = usePage().props.auth.user.role;
    const isAuthorized = useMemo(() => {
        const allowedtabs = {
            hr: [...tabs.slice(0, 17), tabs[22]],
            principal: [
                ...tabs.slice(0, 5),
                tabs[6],
                tabs[7],
                tabs[17],
                tabs[18],
                tabs[19],
                tabs[21],
                tabs[23],
            ],
            teaching: [tabs[1], ...tabs.slice(17, 22), tabs[24]],
            "non-teaching": [tabs[1], ...tabs.slice(17, 22), tabs[24]],
        };
        return allowedtabs[role].includes(props.tab);
    }, []);

    if (isAuthorized) return props.children;
    else return null;
};

export default SideNavigationBar;
