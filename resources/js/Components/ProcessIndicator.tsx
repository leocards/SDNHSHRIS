import React from "react";
import { useProcessIndicator } from "./Provider/process-indicator-provider";
import { cn } from "@/Lib/utils";

const ProcessIndicator = () => {
    const { process, label } = useProcessIndicator();

    return process && (
        <div className={cn("fixed top-0 left-0 z-[99] w-full h-full bg-black bg-opacity-70 flex items-center justify-center text-primary-foreground dark:text-foreground")}>
            <div className="flex flex-col">
                <span className="loading loading-dots loading-md mx-auto"></span>
                <div>{label}</div>
            </div>
        </div>
    );
};

export default ProcessIndicator;
