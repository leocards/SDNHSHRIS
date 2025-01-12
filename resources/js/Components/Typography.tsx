import { cn } from "@/Lib/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function TypographySmall({
    children,
    className,
    ...props
}: PropsWithChildren & HTMLAttributes<HTMLUnknownElement>) {
    return (
        <small
            {...props}
            className={cn("text-sm font-medium leading-none", className)}
        >
            {children}
        </small>
    );
}

export function TypographyLarge({
    ...props
}: PropsWithChildren & HTMLAttributes<HTMLUnknownElement>) {
    return (
        <div
            {...props}
            className={cn("text-lg font-semibold", props.className)}
        />
    );
}

export function TypographyStatus({
    status = 'pending',
    ...props
}: PropsWithChildren & HTMLAttributes<HTMLUnknownElement> & {
    status: "pending"|"approved"|"disapproved"|"invalid"
}) {
    return (
        <TypographySmall {...props} children={props.children} className={cn(props.className, {
            pending: "text-amber-600",
            approved: "text-green-600",
            disapproved: "text-destructive",
            invalid: "text-destructive",
        }[status])} />
    )
}
