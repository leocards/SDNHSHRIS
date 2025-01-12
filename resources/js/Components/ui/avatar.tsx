import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/Lib/utils";
import { User } from "iconsax-react";

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex size-9 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const ProfilePhoto: React.FC<{
    className?: string
    src?: string
    active?: boolean
    statusPosition?: {right: number, bottom: number, size?: number}
    fallbackSize?: number
}> = ({
    src,
    active,
    className,
    statusPosition = { right: -1, bottom: 4, size: 10 },
    fallbackSize = 20
}) => {
    const position = {bottom: statusPosition.bottom, right: statusPosition.right, width: `${statusPosition.size}px`, height: `${statusPosition.size}px` }

    return (
        <div className={cn("size-fit relative")}>
            <Avatar className={cn(className)}>
                <AvatarImage src={src} alt="profile" />
                <AvatarFallback>
                    <User size={fallbackSize} />
                </AvatarFallback>
            </Avatar>

            {active && (
                <div className={cn("size-2.5 shrink-0 rounded-full bg-green-500 ring-[1.5px] ring-background absolute z-10")} style={position}></div>
            )}
        </div>
    )
}

export { Avatar, AvatarImage, AvatarFallback, ProfilePhoto };
