import React, { forwardRef, PropsWithChildren } from "react";

type Props = PropsWithChildren & {
    page: {
        page: number,
        totalPage: number
    }
}

const SALNPDFFormat = forwardRef<HTMLDivElement, Props>((props, ref) => {
    return (
        <div
            ref={ref}
            className="w-[8.5in] h-[13in] shrink-0 font-bookman bg-white dark:bg-white/50 dark:text-black p-8 bre ak-before-page"
        >
            <style>
                {`
                    @media print {
                        body {
                            overflow: hidden;
                            height: fit-content;
                            margin: 0px !important;
                        }
                        @page {
                            size: 8.5in 13in;
                        }
                    }
                `}
            </style>
            {props.children}

            <div className="text-center italic text-[10pt] mt-3 text-black/40">Page {props.page.page??1} of {props.page.totalPage??2}</div>
        </div>
    );
});

export default SALNPDFFormat;
