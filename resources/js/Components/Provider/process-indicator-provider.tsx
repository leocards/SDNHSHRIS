import { router } from "@inertiajs/react";
import React, { createContext, PropsWithChildren, useEffect } from "react";

type ProcessIndicatorState = {
    loader?: React.ReactNode | string;
    setLoader?: (loader: React.ReactNode | string) => void;

    label: string;
    setLabel: (label: string) => void;

    process: boolean;
    setProcess: (process: boolean) => void;
};

export const ProcessIndicatorContext = createContext<ProcessIndicatorState>({
    loader: <span className="loading loading-dots loading-md mx-auto"></span>,
    label: "Processing...",
    setLabel: () => {},

    process: false,
    setProcess: () => {},
});

export const ProcessIndicatorProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [process, setProcess] = React.useState(false);
    const [loader, setLoader] = React.useState<React.ReactNode | string>(<span className="loading loading-dots loading-md mx-auto"></span>);
    const [label, setLabel] = React.useState<string>("Processing...");

    useEffect(() => {
        const removeNavigateListener = router.on('navigate', (event) => {
            setProcess(false)
            setLabel("Processing...")
        })

        const removeFinishListener = router.on('finish', (event) => {
            setProcess(false)
            setLabel("Processing...")
        })

        return () => {
            removeNavigateListener()
            removeFinishListener()
        }
    }, [])

    return (
        <ProcessIndicatorContext.Provider
            value={{
                process,
                setProcess,

                loader,
                setLoader,

                label,
                setLabel,
            }}
        >
            {children}
        </ProcessIndicatorContext.Provider>
    );
};

export const useProcessIndicator = () => {
    const context = React.useContext(ProcessIndicatorContext);

    if (!context) {
        throw new Error("useProcessIndicator must be used within a ProcessIndicatorProvider");
    }

    return context;
};
