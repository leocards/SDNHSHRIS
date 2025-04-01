import { PropsWithChildren, useEffect, useState } from "react";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "../ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import { ArrowDown2 } from "iconsax-react";
import { cn } from "@/Lib/utils";
import AuthTabs from "./AuthTabs";
import { SideBarTabsPorps } from "./SideBarTabs";

const CollapsibleSidebarTabs: React.FC<
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

type CollapsibleSidebarTriggerProps = {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
};
const CollapsibleSidebarTrigger = ({
    label,
    icon,
    active
}: CollapsibleSidebarTriggerProps) => {
    const { state, isMobile } = useSidebar();

    return (
        <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={label} isActive={active} isNav={false}>
                {icon}
                <span
                    className={cn(
                        state == "collapsed" && !isMobile && "hidden",
                        "text-nowrap"
                    )}
                >
                    {label}
                </span>

                {state == "expanded" && (
                    <ArrowDown2 className="!size-4 ml-auto group-data-[state=open]:rotate-90 transition-all duration-150 ease-in-out" />
                )}
            </SidebarMenuButton>
        </CollapsibleTrigger>
    );
};

type CollapsibleSidebarContentProps = PropsWithChildren;
const CollapsibleSidebarContent = ({
    children,
}: CollapsibleSidebarContentProps) => {
    return (
        <CollapsibleContent>
            <SidebarMenuSub>{children}</SidebarMenuSub>
        </CollapsibleContent>
    );
};

type CollapsibleSidebarSubTabsProps = SideBarTabsPorps;
const CollapsibleSidebarSubTabs = ({
    icon, label, active, tab, onRoute
}: CollapsibleSidebarSubTabsProps) => {
    return (
        <AuthTabs tab={tab}>
            <SidebarMenuSubItem>
                <SidebarMenuSubButton
                    className="cursor-pointer"
                    onClick={() => onRoute()}
                    isActive={active}
                >
                    {icon}
                    <span>{label}</span>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        </AuthTabs>
    );
};

export default CollapsibleSidebarTabs;
export {
    CollapsibleSidebarTrigger,
    CollapsibleSidebarContent,
    CollapsibleSidebarSubTabs,
};
