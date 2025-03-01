import Header from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { ArrowRight2, Printer } from "iconsax-react";
import React, { Fragment, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { SALNTPRINTYPE } from "./Types/type";
import SALNPage1 from "./Print/SALNPage1";
import SALNPage2 from "./Print/SALNPage2";
import SALNSeparatePage from "./Print/SALNSeparatePage";
import { useSidebar } from "@/Components/ui/sidebar";
import { cn } from "@/Lib/utils";

type Props = SALNTPRINTYPE & {};

const ViewSaln = ({ pages, saln, declarant, spouse, address, user }: Props) => {
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef,
        bodyClass: "margin-0",
    });
    const { state } = useSidebar();

    return (
        <div>
            <Header title="SALN View">
                <div className="flex items-center gap-1">
                    SALN <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    View
                </div>
            </Header>

            <div className="my-5">
                <Button
                    className=""
                    variant="outline"
                    onClick={() => handlePrint()}
                >
                    <Printer /> <span>Print</span>
                </Button>
            </div>

            <div
                className={cn(
                    "overflow-x-auto mx-auto flex flex-col p-4 bg-gray-200 dark:bg-zinc-800 rounded-md",
                    state === "expanded"
                        ? "max-w-[18rem] [@media(min-width:436px)_and_(max-width:718px)]:max-w-sm [@media(min-width:556px)_and_(max-width:718px)]:max-w-lg [@media(min-width:718px)_and_(max-width:768px)]:max-w-2xl [@media(min-width:769px)_and_(max-width:815px)]:max-w-sm [@media(min-width:815px)_and_(max-width:979px)]:max-w-lg [@media(min-width:980px)_and_(max-width:1149px)]:max-w-2xl [@media(min-width:1150px)]:max-w-4xl"
                        : "max-w-[18rem] [@media(min-width:427px)_and_(max-width:569px)]:max-w-sm [@media(min-width:570px)_and_(max-width:779px)]:max-w-lg [@media(min-width:780px)_and_(max-width:957px)]:max-w-2xl [@media(min-width:958px)]:max-w-full"
                )}
                style={{
                    scrollbarColor:
                        "hsl(var(--foreground)) transparent !important",
                }}
            >
                <div ref={contentRef} className="space-y-3 print:space-y-0 mx-auto">
                    {pages.map((page, index) =>
                        index === 0 ? (
                            <Fragment key={index}>
                                <SALNPage1
                                    pagecount={{
                                        page: 1,
                                        totalPage: pages?.length + 1,
                                    }}
                                    saln={saln}
                                    declarant={declarant}
                                    page={page}
                                    spouse={spouse}
                                    user={user}
                                    address={address}
                                />
                                <SALNPage2
                                    pagecount={{
                                        page: 2,
                                        totalPage: pages.length + 1,
                                    }}
                                    saln={saln}
                                    declarant={declarant}
                                    page={page}
                                    spouse={spouse}
                                    address={address}
                                />
                            </Fragment>
                        ) : (
                            <SALNSeparatePage
                                pagecount={{
                                    page: index + 2,
                                    totalPage: pages.length + 1,
                                }}
                                saln={saln}
                                declarant={declarant}
                                page={page}
                                spouse={spouse}
                                user={user}
                                address={address}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewSaln;
