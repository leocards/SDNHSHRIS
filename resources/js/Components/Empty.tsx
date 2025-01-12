import React from "react";

const Empty: React.FC<{ src: string; label: string }> = ({ src, label }) => {
    return (
        <div className="flex flex-col items-center absolute inset-0 justify-center">
            <img className="size-24 opacity-40 dark:opacity-65" src={src} />
            <div className="text-sm font-medium text-foreground/50 mt-1">
                {label}
            </div>
        </div>
    );
};

export default Empty;
