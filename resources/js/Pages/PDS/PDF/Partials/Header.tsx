import { cn } from "@/Lib/utils";
import { useIsDownloadChecker } from "@/Components/Provider/pds-downloader-provider";
import { PropsWithChildren } from "react";

const Header = () => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div className="relative">
            <div
                className={cn(
                    "font-calibri font-extrabold italic leading-[.80rem] absolute px-px left-0",
                    checkIfDownLoad("-top-2", "-top-0")
                )}
            >
                <div className="text-[11px]">CS Form No. 212</div>
                <div className="text-[9px]">Revised 2017</div>
            </div>

            <div className="font-arial-black text-[22px] pt-3 text-center pb-2">
                PERSONAL DATA SHEET
            </div>

            <div
                className={cn(
                    "font-arial italic font-bold text-[8pt] mt-2",
                    checkIfDownLoad("px-px")
                )}
            >
                <div className={cn("leading-3", checkIfDownLoad("-mt- mb-1"))}>
                    WARNING: Any misrepresentation made in the Personal Data
                    Sheet and the Work Experience Sheet shall cause the filing
                    of administrative/criminal case/s against the person
                    concerned.
                </div>

                <div
                    className={cn(
                        "text-[7.5pt]",
                        checkIfDownLoad("-mt-1", "pt-px")
                    )}
                >
                    READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA
                    SHEET (PDS) BEFORE ACCOMPLISHING THE PDS FORM.
                </div>
            </div>
            <div
                className={cn(
                    "text-[8pt] flex justify-between h-5",
                    checkIfDownLoad("mt-1")
                )}
            >
                <div
                    className={cn(
                        "border-b-2 border-black grow leading-3 pt-px flex",
                        checkIfDownLoad("-mt-1 px-px", "pt-0.5")
                    )}
                >
                    Print legibly. Tick appropriate boxes ({" "}
                    <div
                        className={cn(
                            "border border-black size-2.5",
                            checkIfDownLoad("mt-1.5", "mt-px")
                        )}
                    ></div>{" "}
                    ) and use separate sheet if necessary. Indicate N/A if not
                    applicable.{" "}
                    <span className="font-bold">DO NOT ABBREVIATE.</span>
                </div>

                <div className="flex text-[7pt]">
                    <div className="border-2 border-black bg-[#969696] pr-3">
                        <div className={cn(checkIfDownLoad("-mt-1.5"))}>
                            1. CS ID No.
                        </div>
                    </div>
                    <div className="border-2 border-x-0 border-black w-[12rem] text-right">
                        <div className={cn(checkIfDownLoad("-mt-1.5 pr-px"))}>
                            (Do not fill up. For CSC use only)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SubHeader = ({
    title,
    subtitle,
    customHeight,
    className,
}: {
    title: string;
    subtitle?: string | React.ReactNode;
    customHeight?: string;
    className?: string;
}) => {
    const { checkIfDownLoad } = useIsDownloadChecker();

    return (
        <div
            className={cn(
                "border-2 border-black border-x-0 bg-[#969696] text-white italic font-semibold tracking-wider text-[9.4pt]",
                checkIfDownLoad((customHeight??"h-[22px]")),
                className
            )}
        >
            <div className={cn("", checkIfDownLoad("-mt-2"))}>{title}</div>

            {subtitle}
        </div>
    );
};

export const TextCenter = ({
    children,
    ...props
}: { className?: string } & PropsWithChildren) => {
    return (
        <div
            {...props}
            className={cn("flex items-center justify-center", props.className)}
        >
            {children}
        </div>
    );
};

export default Header;
