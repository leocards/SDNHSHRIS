import { cn } from "@/Lib/utils";
import { PropsWithChildren } from "react";
import { useSidebar } from "./ui/sidebar";

const StatisticsCard: React.FC<
    PropsWithChildren & {
        className?: string;
        iconClass: string;
        label: string;
        data: string | number;
    }
> = ({ children, label, data, className, iconClass }) => {
    const { state, isMobile } = useSidebar();

    return (
        <div
            className={cn(
                "flex max-smflex-col items-center gap-3 p-3 rounded-xl bg-gradient-to-tl text-primary-foreground dark:text-white/90",
                state === "collapsed" || isMobile ? "[@media(max-width:1031px)]:px-5" : "[@media(max-width:1300px)]:px-5",
                className,
            )}
        >
            <div className={cn(iconClass, "size-10 sm:size-12 shrink-0")}>{children}</div>
            <div className="relative z-10">
                <div
                    className={cn(
                        "text-base font-semibold max-sm:hidden",
                        state === "collapsed" ? "[@media(max-width:1031px)]:hidden" : "[@media(max-width:1300px)]:hidden"
                    )}
                >
                    {label}
                </div>
                <div className="text-xl font-medium">{data}</div>
            </div>
        </div>
    );
};

export default StatisticsCard;
