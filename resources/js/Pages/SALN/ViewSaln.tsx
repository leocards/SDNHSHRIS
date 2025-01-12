import Header from "@/Components/Header";
import { Button } from "@/Components/ui/button";
import { ArrowRight2, Printer } from "iconsax-react";
import React, { Fragment, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { SALNTPRINTYPE } from "./Types/type";
import SALNPage1 from "./Print/SALNPage1";
import SALNPage2 from "./Print/SALNPage2";
import SALNSeparatePage from "./Print/SALNSeparatePage";

type Props = SALNTPRINTYPE & {};

const ViewSaln = ({ pages, saln, declarant, spouse, address, user }: Props) => {
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef,
        bodyClass: "margin-0",
    });

    return (
        <div>
            <Header title="SALN View">
                <div className="flex items-center gap-1">
                    SALN <ArrowRight2 className="size-4 [&>path]:stroke-[3]" />{" "}
                    View
                </div>
            </Header>

            <div className="my-5">
                <Button className="" variant="outline" onClick={()=>handlePrint()}>
                    <Printer /> <span>Print</span>
                </Button>
            </div>

            <div className="overflow-y-auto rounded-scrollbar flex flex-col items-center p-4 bg-gray-200 rounded-md">
                <div ref={contentRef} className="space-y-3 print:space-y-0">
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
