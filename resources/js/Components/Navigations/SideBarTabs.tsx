import React from "react";
import AuthTabs, { AuthTabsProps } from "./AuthTabs";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { cn } from "@/Lib/utils";

export type SideBarTabsPorps = Omit<AuthTabsProps, 'children'> & {
    icon: React.ReactNode;
    active: boolean;
    onRoute: CallableFunction;
    label: string;
}

const SideBarTabs: React.FC<SideBarTabsPorps> = ({ icon, tab, label, active, onRoute }) => {
    const { state, isMobile } = useSidebar();

    return (
        <AuthTabs tab={tab}>
            <SidebarMenuItem>
                <SidebarMenuButton
                    tooltip={label}
                    isActive={active}
                    onClick={() => onRoute()}
                >
                    {icon}
                    <span
                        className={cn(
                            state == "collapsed" && !isMobile && "hidden"
                        )}
                    >
                        {label}
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </AuthTabs>
    );
};

export default SideBarTabs;
