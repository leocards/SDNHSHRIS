import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/Lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

type PopoverState = {
    open: boolean
    setOpen: (open: boolean) => void
    close: () => void
}

const initialState = {
    open: false,
    setOpen: () => null,
    close: () => null,
}

const PopoverContextProvider = React.createContext<PopoverState>(initialState)

const PopoverProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [open, setOpen] = React.useState(false);

    const value = {
        open,
        setOpen,
        close: () => setOpen(false)
    }

    return (
        <PopoverContextProvider.Provider value={value}>
            {children}
        </PopoverContextProvider.Provider>
    )
}

const usePopover = () => {
    const context = React.useContext(PopoverContextProvider);

    if (context === undefined)
        throw new Error("usePopover must be used within a PopoverProvider");

    return context;
}

const PopoverContainer: React.FC<{ children: (props: { open: boolean; close?: () => void }) => React.ReactNode }> = ({ children, ...props }) => {
    const { open, setOpen, close } = usePopover()

    return (
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
            {children({ open, close })}
        </PopoverPrimitive.Root>
    )
}

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { PopoverProvider, usePopover, Popover, PopoverContainer, PopoverTrigger, PopoverContent, PopoverAnchor };
