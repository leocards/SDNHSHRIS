import { cn } from "@/Lib/utils";
import { Head } from "@inertiajs/react";
import React, { PropsWithChildren } from "react";

const Header: React.FC<{
    className?: string;
    children?: React.ReactNode;
    title?: string;
}> = ({
    children,
    className = "",
    title
}) => {
    return (
        <>
            {title && <Head title={title} />}
            <div className={cn("text-lg sm:text-xl font-semibold w-fit text-secondary-foreground", className)}>{children}</div>
        </>
    );
};

export const TableHeader: React.FC<PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({
    children, ...props
}) => {
    return (
        <div {...props} className={cn("grid min-h-12 [&>div]:p-2 [&>div]:flex [&>div]:items-center items-center border-b border-border font-medium text-muted-foreground/90", props.className)}>
            {children}
        </div>
    )
}

export const TableRow: React.FC<PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({
    children, ...props
}) => {
    return (
        <div {...props} className={cn("grid [&>div]:p-2 [&>div]:flex [&>div]:items-center hover:bg-accent/40", props.className)}>
            {children}
        </div>
    )
}

export default Header;
