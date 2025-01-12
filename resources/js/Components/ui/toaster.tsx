import { useToast } from "@/Hooks/use-toast";
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/Components/ui/toast";
import { InfoCircle, MessageNotif, Notification, Danger } from "iconsax-react";
import { Info, PartyPopper } from "lucide-react";
import { cn } from "@/Lib/utils";

export function Toaster() {
    const { toasts } = useToast();

    const statusIcon = {
        error: <InfoCircle variant="Linear" className="size-4 [&>path]:stroke-[2.5]" />,
        success: <PartyPopper className="size-4" strokeWidth={2.4} />,
        info: <Info className="size-4" strokeWidth={2.4} />,
        warning: <Danger variant="Linear" className="size-4 [&>path]:stroke-[2.5]" />,
        notification: <Notification variant="Linear" className="size-4 [&>path]:stroke-[2.5]" />,
        message: <MessageNotif className="size-4 [&>path]:stroke-[2.5]" />,
    }

    const titleColor = {
        error: "text-destructive",
        success: "text-green-500 dark:text-green-700",
        info: "text-indigo-500 dark:text-indigo-700",
        warning: "text-amber-500 dark:text-amber-700",
        notification: "text-fuchsia-500 dark:text-fuchsia-700",
        message: "text-violet-500 dark:text-violet-700",
    }

    const toastColor = {
        error: "ring-destructive border-destructive",
        success: "ring-green-500 dark:ring-green-700 border-green-500 dark:border-green-700",
        info: "ring-indigo-500 dark:ring-indigo-700 border-indigo-500 dark:border-indigo-700",
        warning: "ring-amber-500 dark:ring-amber-700 border-amber-500 dark:border-amber-700",
        notification: "ring-fuchsia-500 dark:ring-fuchsia-700 border-fuchsia-500 dark:border-fuchsia-700",
        message: "ring-violet-500 dark:ring-violet-700 border-violet-500 dark:border-violet-700",
    }

    return (
        <ToastProvider>
            {toasts.map(function ({
                id,
                title,
                description,
                action,
                ...props
            }) {
                return (
                    <Toast key={id} {...props} className={cn("ring-[1.5px]", toastColor[props.status])}>
                        <div className="grid gap-1">
                            <div className={cn("flex gap-2 items-center", titleColor[props.status])}>
                                {statusIcon[props.status]}
                                {title && <ToastTitle>{title}</ToastTitle>}
                            </div>
                            {description && (
                                <ToastDescription>
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose className={cn(toastColor[props.status])} />
                    </Toast>
                );
            })}
            <ToastViewport className="fixed top-0 right-0 flex flex-col space-y-2 p-2" />
        </ToastProvider>
    );
}
