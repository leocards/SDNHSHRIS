import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/Lib/utils";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";
import { TooltipLabel } from "./tooltip";
import { ArrowSwapVertical, Filter } from "iconsax-react";
import { Checkbox } from "./checkbox";

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Root
        ref={ref}
        className={cn(
            "flex h-9 w-fit items-center rounded-md bg-background shadow-sm",
            className
        )}
        {...props}
    />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> &
        VariantProps<typeof buttonVariants> & {
            buttonSize?: string;
        }
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex select-none items-center rounded-md px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            className
        )}
        asChild
        {...props}
    >
        <Button
            className={cn(props.buttonSize)}
            variant={props.variant || "outline"}
            size={props.size}
        >
            {props.children}
        </Button>
    </MenubarPrimitive.Trigger>
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <MenubarPrimitive.SubTrigger
        ref={ref}
        className={cn(
            "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            inset && "pl-8",
            className
        )}
        autoFocus={false}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.SubContent
        ref={ref}
        className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
    (
        {
            className,
            align = "start",
            alignOffset = -4,
            sideOffset = 8,
            ...props
        },
        ref
    ) => (
        <MenubarPrimitive.Portal>
            <MenubarPrimitive.Content
                ref={ref}
                align={align}
                alignOffset={alignOffset}
                sideOffset={sideOffset}
                onCloseAutoFocus={(e) => e.preventDefault()}
                hideWhenDetached
                autoFocus={false}
                className={cn(
                    "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className
                )}
                {...props}
            />
        </MenubarPrimitive.Portal>
    )
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-[1.15rem] [&_svg]:stroke-[1.5]",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <MenubarPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <MenubarPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </MenubarPrimitive.ItemIndicator>
        </span>
        {children}
    </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <MenubarPrimitive.RadioItem
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <MenubarPrimitive.ItemIndicator>
                <Circle className="h-4 w-4 fill-current" />
            </MenubarPrimitive.ItemIndicator>
        </span>
        {children}
    </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "ml-auto text-xs tracking-widest text-muted-foreground",
                className
            )}
            {...props}
        />
    );
};
MenubarShortcut.displayname = "MenubarShortcut";

type FilterButtonProps = React.PropsWithChildren & {
    isDirty: boolean;
    align?: "start" | "center" | "end";
    onClearFilter?: CallableFunction;
    filter?: string;
    withClear?: boolean;
    contentClass?: string;
    tooltipLabel?: string;
    filterValueClass?: string;
    disabled?: boolean;
    className?: string;
};

const FilterButton = React.forwardRef<HTMLDivElement, FilterButtonProps>(
    (
        {
            isDirty,
            align = "start",
            children,
            filter,
            withClear = true,
            contentClass,
            tooltipLabel = "Filter",
            onClearFilter,
            filterValueClass,
            className,
            disabled
        },
        ref
    ) => {
        return (
            <Menubar ref={ref} className="shadow-none m-0">
                <MenubarMenu>
                    <TooltipLabel label={tooltipLabel} className={cn(className)}>
                        <MenubarTrigger className="relative h- pr-3.5 max-w-40" disabled={disabled}>
                            <Filter className="[&>path]:stroke-[2]" />
                            <span className={cn("line-clamp-1 max-sm:!hidden", filterValueClass)}>{filter ? filter : "Filter"}</span>
                            {isDirty && (
                                <div className="size-2 absolute top-1 right-1 bg-primary rounded-full" />
                            )}
                        </MenubarTrigger>
                    </TooltipLabel>
                    <MenubarContent
                        align={align}
                        className={cn("pr-0 min-w-36", contentClass)}
                    >
                        <div className="max-h-52 overflow-y-auto pr-1">
                            {children}
                        </div>
                        {withClear && (
                            <>
                                <MenubarSeparator />
                                <MenubarItem
                                    className="w-fit px-4 py-1 cursor-pointer ml-auto mr-1 text-sm font-medium"
                                    onClick={() =>
                                        onClearFilter &&
                                        onClearFilter(undefined)
                                    }
                                >
                                    Clear
                                </MenubarItem>
                            </>
                        )}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        );
    }
);

const FilterItem: React.FC<
    React.PropsWithChildren & {
        value: string;
        className?: string;
        activeFilter?: string;
        onClick: (value: string) => void;
    }
> = ({ value, className, activeFilter, children, onClick }) => {

    const itemRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            // Scroll to the selected item when it's mounted
            if (activeFilter === value && itemRef.current) {
                itemRef.current.scrollIntoView({
                    block: "nearest",
                    inline: "nearest",
                });
            }
        }, [activeFilter]);

    return (
        <MenubarItem
            ref={itemRef}
            className={cn("gap-2 items-center", className)}
            onClick={() => onClick(value)}
        >
            <Checkbox checked={activeFilter === value} />
            <span className="line-clamp-1">{children}</span>
        </MenubarItem>
    );
};

type SortButtonProps = React.PropsWithChildren & {
    order: "asc" | "desc";
    align?: "start" | "center" | "end";
    onOrderChange: (order: "asc" | "desc") => void;
};

const SortButton = React.forwardRef<HTMLDivElement, SortButtonProps>(
    ({ order, align = "start", children, onOrderChange }, ref) => {
        return (
            <Menubar ref={ref} className="shadow-none">
                <MenubarMenu>
                    <TooltipLabel label="Sort">
                        <MenubarTrigger className="relative pr-3.5">
                            <ArrowSwapVertical className="[&>path]:stroke-[2]" />
                            <span className="max-sm:hidden">Sort</span>
                        </MenubarTrigger>
                    </TooltipLabel>
                    <MenubarContent align={align} className="min-w-36">
                        {children}
                        <MenubarSeparator />
                        <MenubarLabel>Order by</MenubarLabel>
                        <MenubarItem
                            onClick={() => onOrderChange("asc")}
                            className="gap-2"
                        >
                            <Checkbox checked={order === "asc"} />
                            <span>Ascending</span>
                        </MenubarItem>
                        <MenubarItem
                            onClick={() => onOrderChange("desc")}
                            className="gap-2"
                        >
                            <Checkbox checked={order === "desc"} />
                            <span>Descending</span>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        );
    }
);

const SortItem: React.FC<
    React.PropsWithChildren & {
        value: string;
        className?: string;
        activeSort?: string;
        onClick: (value: string) => void;
    }
> = ({ value, className, activeSort, children, onClick }) => {
    return (
        <MenubarItem
            className={cn("gap-2 items-center", className)}
            onClick={() => onClick(value)}
        >
            <Checkbox checked={activeSort === value} />
            <span className="line-clamp-1">{children}</span>
        </MenubarItem>
    );
};

export {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarLabel,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarPortal,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarGroup,
    MenubarSub,
    MenubarShortcut,
    FilterButton,
    FilterItem,
    SortButton,
    SortItem,
};
