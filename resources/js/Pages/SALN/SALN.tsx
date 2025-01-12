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

    const data = useMemo((): dataSaln[] => {
        if (page) return getRecord(page.data);

        return [];
    }, [page]);

    return (
        <div className="mx-auto max-w-6xl">
            <Header
                title="SALN"
                children="(SALN) Statement of Assests, Liabilities, and Networth"
            />

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex items-center my-5"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>

                <Button
                    className="ml-auto"
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
                    Upload SALN
                </Button>
            </Tabs>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="saln"
                    columns={["1fr", "1fr", "1fr", "10rem", "7rem"]}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Assets</div>
                                <div>Liabilities</div>
                                <div>Networth</div>
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
                                        <div>
                                            &#8369;{" "}
                                            {Number(
                                                salndata?.assets
                                            ).toLocaleString()}
                                        </div>
                                        <div>
                                            &#8369;{" "}
                                            {Number(
                                                salndata?.liability
                                            ).toLocaleString()}
                                        </div>
                                        <div>
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
