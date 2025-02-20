import { cn } from "@/Lib/utils";
import { PropsWithChildren } from "react";

const StatisticsCard: React.FC<
    PropsWithChildren & {
        className?: string;
        iconClass: string;
        label: string;
        data: string | number;
    }
> = ({ children, label, data, className, iconClass }) => {

    return (
        <div
            className={cn(
                "flex max-smflex-col items-center gap-3 p-3 rounded-xl bg-gradient-to-tl text-primary-foreground dark:text-white/90",
                className,
            )}
        >
            <div className={cn(iconClass, "size-10 sm:size-12 shrink-0")}>{children}</div>
            <div className="relative z-10">
                <div
                    className={cn(
                        "text-sm font-semibold",
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
