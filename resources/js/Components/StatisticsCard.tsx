import { cn } from "@/Lib/utils";
import { PropsWithChildren } from "react";

const StatisticsCard: React.FC<
    PropsWithChildren & {
        className?: string;
    }
> = ({ children, className }) => {
    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-tl text-primary-foreground dark:text-white/90",
                className
            )}
        >
            {children}
        </div>
    );
};

export default StatisticsCard
