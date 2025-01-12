import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type Props = {
    isDownload: boolean;
    setIsDownload: (bool: boolean) => void;
    checkIfDownLoad: (className: string, ifFalse?: string) => string
}

const initialState: Props = {
    isDownload: false,
    setIsDownload: () => null,
    checkIfDownLoad: () => '',
};

const PDSPDFIsDownloadProviderContext = createContext<Props>(initialState);

export const PDSPDFIsDownloadProvider = ({children, initialValue = false}: { initialValue?: boolean } & PropsWithChildren) => {
    const [download, setDownload] = useState(initialValue)

    const value = {
        isDownload: download,
        setIsDownload: (bool: boolean) => setDownload(bool),
        checkIfDownLoad: (className: string, ifFalse?: string): string =>
            download ? className : !!ifFalse ? ifFalse : ""
    }

    return (
        <PDSPDFIsDownloadProviderContext.Provider value={value}>
            {children}
        </PDSPDFIsDownloadProviderContext.Provider>
    )
}

export const useIsDownloadChecker = () => {
    const context = useContext(PDSPDFIsDownloadProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a PDSPDFIsDownloadProviderContext");

    return context;
}
