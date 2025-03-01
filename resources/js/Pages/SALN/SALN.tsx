import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PAGINATEDDATA, User } from "@/Types";
import React, { Fragment, useMemo, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import Empty from "@/Components/Empty";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { dataSaln, getRecord, SALNTYPE } from "./Types/type";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { format } from "date-fns";
import { Edit, Eye } from "iconsax-react";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";
import { cn } from "@/Lib/utils";

const SALN: React.FC<{ saln: PAGINATEDDATA<SALNTYPE> }> = (props) => {
    return (
        <PaginateProvider<SALNTYPE> pageValue={props.saln} url={route("saln")}>
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<SALNTYPE>();
    const [status, setStatus] = useState("pending");
    const { setProcess } = useProcessIndicator();
    const { width } = useWindowSize();
    const { state } = useSidebar();

    const data = useMemo((): dataSaln[] => {
        if (page) return getRecord(page.data);

        return [];
    }, [page]);

    const columns = {
        collapsed: `1fr 1fr 1fr 10rem 7rem`,
        expanded: (width >= 768 && width <= 960) || (width <= 640) ? (width <= 456 ? `1fr 7rem`:`1fr 10rem 7rem`): `1fr 1fr 1fr 10rem 7rem`
    }[state]

    return (
        <div className="mx-auto max-w-6xl">
            <Header
                title="SALN"
                children="(SALN) Statement of Assests, Liabilities, and Networth"
            />

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex max-sm:flex-col sm:items-center my-5"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="disapproved">Disapproved</TabsTrigger>
                </TabsList>

                <Button
                    className="ml-auto max-sm:mt-4"
                    onClick={() => {
                        router.get(
                            route("saln.create"),
                            {},
                            {
                                onBefore: () => setProcess(true),
                            }
                        );
                    }}
                >
                    Add SALN
                </Button>
            </Tabs>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="saln"
                    columns={columns}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div className={cn(state === "expanded" && "[@media(min-width:768px)_and_(max-width:960px)]:!hidden", "max-sm:!hidden")}>Assets</div>
                                <div className={cn(state === "expanded" && "[@media(min-width:768px)_and_(max-width:960px)]:!hidden", "max-sm:!hidden")}>Liabilities</div>
                                <div className="max-xs:!hidden">Networth</div>
                                <div>As of</div>
                                <div className="justify-center">Action</div>
                            </TableHeader>
                            {data.length === 0 ? (
                                <Empty
                                    src={empty}
                                    label={`No ${status} SALN.`}
                                />
                            ) : (
                                data.map((salndata, index) => (
                                    <TableRow
                                        key={index}
                                        style={{ gridTemplateColumns: column }}
                                    >
                                        <div className={cn(state === "expanded" && "[@media(min-width:769px)_and_(max-width:960px)]:!hidden", "max-sm:!hidden")}>
                                            &#8369;{" "}
                                            {Number(
                                                salndata?.assets
                                            ).toLocaleString()}
                                        </div>
                                        <div className={cn(state === "expanded" && "[@media(min-width:769px)_and_(max-width:960px)]:!hidden", "max-sm:!hidden")}>
                                            &#8369;{" "}
                                            {Number(
                                                salndata?.liability
                                            ).toLocaleString()}
                                        </div>
                                        <div className="max-xs:!hidden">
                                            &#8369;{" "}
                                            {Number(
                                                salndata?.networth
                                            ).toLocaleString()}
                                        </div>
                                        <div>
                                            {format(
                                                salndata?.asof,
                                                "MMM dd, y"
                                            )}
                                        </div>
                                        <div className="gap-3 justify-center">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="size-7"
                                                onClick={() =>
                                                    router.get(
                                                        route("saln.view", [
                                                            salndata.id,
                                                        ]),
                                                        {},
                                                        {
                                                            onBefore: () =>
                                                                setProcess(
                                                                    true
                                                                ),
                                                        }
                                                    )
                                                }
                                            >
                                                <Eye />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="size-7"
                                                onClick={() =>
                                                    router.get(
                                                        route("saln.create", [
                                                            salndata.id,
                                                        ]),
                                                        {},
                                                        {
                                                            onBefore: () =>
                                                                setProcess(
                                                                    true
                                                                ),
                                                        }
                                                    )
                                                }
                                            >
                                                <Edit />
                                            </Button>
                                        </div>
                                    </TableRow>
                                ))
                            )}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <div className="">
                <PaginationData />
            </div>
        </div>
    );
};

export default SALN;
