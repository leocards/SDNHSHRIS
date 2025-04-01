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
    DocumentCopy,
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
import SideBarTabs from "./SideBarTabs";
import AuthTabs from "./AuthTabs";
import CollapsibleSidebarTabs, {
    CollapsibleSidebarContent,
    CollapsibleSidebarSubTabs,
    CollapsibleSidebarTrigger,
} from "./CollapsibleSidebarTabs";

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
                <SidebarTrigger
                    className="absolute top-2 -right-4 bg-background z-40 text-foreground"
                    icon={<X />}
                />
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
                                state == "collapsed" && !isMobile && "hidden"
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
                    <SideBarTabs
                        tab="generalsearch"
                        label="General Search"
                        icon={
                            <SearchNormal1
                                variant={
                                    url.startsWith("/general-search")
                                        ? "Bulk"
                                        : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/general-search")}
                        onRoute={() => navigateTo(route("general-search"))}
                    />

                    <SideBarTabs
                        tab="dashboard"
                        label="Dashboard"
                        icon={
                            <Home2
                                variant={
                                    url.startsWith("/dashboard")
                                        ? "Bulk"
                                        : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/dashboard")}
                        onRoute={() => navigateTo(route("dashboard"))}
                    />

                    <AuthTabs tab="personnel">
                        <CollapsibleSidebarTabs
                            isActive={url.startsWith("/personnel")}
                            defaultOpen={url.startsWith("/personnel")}
                        >
                            <CollapsibleSidebarTrigger
                                label="Personnel"
                                icon={
                                    <Profile2User
                                        variant={
                                            url.startsWith("/personnel")
                                                ? "Bulk"
                                                : "Linear"
                                        }
                                    />
                                }
                                active={url.startsWith("/personnel")}
                            />
                            <CollapsibleSidebarContent>
                                <CollapsibleSidebarSubTabs
                                    tab="personnel.teaching"
                                    label="Teaching"
                                    icon={
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
                                    }
                                    onRoute={() =>
                                        navigateTo(
                                            route("personnel", ["teaching"])
                                        )
                                    }
                                    active={
                                        url.startsWith("/personnel/r/teaching") ||
                                        url.startsWith(
                                            "/personnel/create/teaching"
                                        )
                                    }
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="personnel.non-teaching"
                                    label="Non-teaching"
                                    icon={
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
                                    }
                                    onRoute={() =>
                                        navigateTo(
                                            route("personnel", ["non-teaching"])
                                        )
                                    }
                                    active={
                                        url.startsWith(
                                            "/personnel/r/non-teaching"
                                        ) ||
                                        url.startsWith(
                                            "/personnel/create/non-teaching"
                                        )
                                    }
                                />

                                <CollapsibleSidebarSubTabs
                                    tab="personnel.tardiness"
                                    label="Tardiness"
                                    icon={
                                        <UserTick
                                            variant={
                                                url.startsWith(
                                                    "/personnel/tardiness"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("personnel.tardiness"))
                                    }
                                    active={url.startsWith(
                                        "/personnel/tardiness"
                                    )}
                                />

                                <CollapsibleSidebarSubTabs
                                    tab="personnel.archive"
                                    label="Personnel Archive"
                                    icon={
                                        <ArchiveBox
                                            variant={
                                                url.startsWith(
                                                    "/personnel/personnel-archive"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("personnel.archive"))
                                    }
                                    active={url.startsWith(
                                        "/personnel/personnel-archive"
                                    )}
                                />
                            </CollapsibleSidebarContent>
                        </CollapsibleSidebarTabs>
                    </AuthTabs>

                    <AuthTabs tab="myapprovals">
                        <CollapsibleSidebarTabs
                            isActive={url.startsWith("/myapproval")}
                            defaultOpen={url.startsWith("/myapproval")}
                        >
                            <CollapsibleSidebarTrigger
                                label="My Approval"
                                icon={
                                    <TaskSquare
                                        variant={
                                            url.startsWith("/myapproval")
                                                ? "Bulk"
                                                : "Linear"
                                        }
                                    />
                                }
                            />
                            <CollapsibleSidebarContent>
                                <CollapsibleSidebarSubTabs
                                    tab="myapprovals.leave"
                                    label="Leave"
                                    icon={
                                        <DocumentForward
                                            variant={
                                                url.startsWith(
                                                    "/myapproval/leave"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myapproval.leave"))
                                    }
                                    active={url.startsWith("/myapproval/leave")}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myapprovals.locatorslip"
                                    label="Locator Slip"
                                    icon={
                                        <DocumentText1
                                            variant={
                                                url.startsWith(
                                                    "/myapproval/locatorslip"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(
                                            route("myapproval.locatorslip")
                                        )
                                    }
                                    active={url.startsWith(
                                        "/myapproval/locatorslip"
                                    )}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myapprovals.pds"
                                    label="Personal Data Sheet"
                                    icon={
                                        <DocumentText
                                            variant={
                                                url.startsWith(
                                                    "/myapproval/pds"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myapproval.pds"))
                                    }
                                    active={url.startsWith("/myapproval/pds")}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myapprovals.saln"
                                    label="SALN"
                                    icon={
                                        <Receipt1
                                            variant={
                                                url.startsWith(
                                                    "/myapproval/saln"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myapproval.saln"))
                                    }
                                    active={url.startsWith("/myapproval/saln")}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myapprovals.sr"
                                    label="Service Record"
                                    icon={
                                        <ChartSuccess
                                            variant={
                                                url.startsWith(
                                                    "/myapproval/service-record"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myapproval.sr"))
                                    }
                                    active={url.startsWith(
                                        "/myapproval/service-record"
                                    )}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myapprovals.classassumption"
                                    label="Class Assumption"
                                    icon={
                                        <DocumentCopy
                                            variant={
                                                url.startsWith(
                                                    "/myapproval/classassumption"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myapproval.classassumption"))
                                    }
                                    active={url.startsWith(
                                        "/myapproval/classassumption"
                                    )}
                                />
                            </CollapsibleSidebarContent>
                        </CollapsibleSidebarTabs>
                    </AuthTabs>

                    <AuthTabs tab="myreports">
                        <CollapsibleSidebarTabs
                            isActive={url.startsWith("/myreports")}
                            defaultOpen={url.startsWith("/myreports")}
                        >
                            <CollapsibleSidebarTrigger
                                label="My Reports"
                                icon={
                                    <Chart2
                                        variant={
                                            url.startsWith("/myreports")
                                                ? "Bulk"
                                                : "Linear"
                                        }
                                    />
                                }
                            />
                            <CollapsibleSidebarContent>
                                <CollapsibleSidebarSubTabs
                                    tab="myreports.lp"
                                    label="List of Personnel"
                                    icon={
                                        <Profile2User
                                            variant={
                                                url.startsWith(
                                                    "/myreports/list-of-personnel"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myreports.lp"))
                                    }
                                    active={url.startsWith(
                                        "/myreports/list-of-personnel"
                                    )}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myreports.ipcr"
                                    label="IPCR"
                                    icon={
                                        <FavoriteChart
                                            variant={
                                                url.startsWith(
                                                    "/myreports/ipcr"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myreports.ipcr"))
                                    }
                                    active={url.startsWith("/myreports/ipcr")}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myreports.saln"
                                    label="SALN"
                                    icon={
                                        <Receipt1
                                            variant={
                                                url.startsWith(
                                                    "/myreports/saln"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myreports.saln"))
                                    }
                                    active={url.startsWith("/myreports/saln")}
                                />
                                <CollapsibleSidebarSubTabs
                                    tab="myreports.logs"
                                    label="Logs"
                                    icon={
                                        <Note
                                            variant={
                                                url.startsWith(
                                                    "/myreports/logs"
                                                )
                                                    ? "Bulk"
                                                    : "Linear"
                                            }
                                        />
                                    }
                                    onRoute={() =>
                                        navigateTo(route("myreports.logs"))
                                    }
                                    active={url.startsWith("/myreports/logs")}
                                />
                            </CollapsibleSidebarContent>
                        </CollapsibleSidebarTabs>
                    </AuthTabs>

                    <SideBarTabs
                        tab="pds"
                        label="Personal Data Sheet"
                        icon={
                            <DocumentText
                                variant={
                                    url.startsWith("/pds") ? "Bulk" : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/pds")}
                        onRoute={() => navigateTo(route("pds"))}
                    />

                    <SideBarTabs
                        tab="sr"
                        label="Service Record"
                        icon={
                            <ChartSuccess
                                variant={
                                    url.startsWith("/sr") ? "Bulk" : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/service-record")}
                        onRoute={() => navigateTo(route("sr"))}
                    />

                    <SideBarTabs
                        tab="tardiness"
                        label="Tardiness"
                        icon={
                            <UserTick
                                variant={
                                    url.startsWith("/tardiness")
                                        ? "Bulk"
                                        : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/tardiness")}
                        onRoute={() => navigateTo(route("tardiness"))}
                    />

                    <SideBarTabs
                        tab="leave"
                        label={`${
                            props.auth.user.role === "principal" ? "My" : ""
                        } Leave`}
                        icon={
                            <DocumentForward
                                variant={
                                    url.startsWith("/leave") ? "Bulk" : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/leave")}
                        onRoute={() => navigateTo(route("leave"))}
                    />

                    <SideBarTabs
                        tab="locatorslip"
                        label={`${
                            props.auth.user.role === "principal" ? "My" : ""
                        } Locator Slip`}
                        icon={
                            <DocumentText1
                                variant={
                                    url.startsWith("/locatorslip")
                                        ? "Bulk"
                                        : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/locatorslip")}
                        onRoute={() => navigateTo(route("locatorslip"))}
                    />

                    <SideBarTabs
                        tab="classassumption"
                        label={`Class Assumption`}
                        icon={
                            <DocumentCopy
                                variant={
                                    url.startsWith("/classassumption")
                                        ? "Bulk"
                                        : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/classassumption")}
                        onRoute={() => navigateTo(route("classassumption"))}
                    />

                    <SideBarTabs
                        tab="saln"
                        label="SALN"
                        icon={
                            <Receipt1
                                variant={
                                    url.startsWith("/saln") ? "Bulk" : "Linear"
                                }
                            />
                        }
                        active={url.startsWith("/saln")}
                        onRoute={() => navigateTo(route("saln"))}
                    />
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
};

export default SideNavigationBar;
