import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PAGINATEDDATA, User } from "@/Types";
import React, { Fragment, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import Empty from "@/Components/Empty";
import { SALNTYPE } from "@/Pages/SALN/Types/type";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Button } from "@/Components/ui/button";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import TypographySmall from "@/Components/Typography";
import { useToast } from "@/Hooks/use-toast";

type HRSALNTYPE = SALNTYPE & {
    user: User;
};

const SALN: React.FC<{ saln: PAGINATEDDATA<HRSALNTYPE> }> = (props) => {
    return (
        <PaginateProvider<HRSALNTYPE>
            pageValue={props.saln}
            url={route("myapproval.saln")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<HRSALNTYPE>();
    const [status, setStatus] = useState("pending");
    const { setProcess } = useProcessIndicator();
    const { toast } = useToast();

    const onApprove = (id: number) => {
        router.post(
            route("myapproval.saln.approval", [id]),
            {},
            {
                onBefore: () => setProcess(true),
                onSuccess: (page) => {
                    toast({
                        title: page.props.flash.title,
                        description: page.props.flash.message,
                        status: page.props.flash.status,
                    })
                }
            }
        );
    };

    return (
        <div className="mx-auto max-w-4xl">
            <Header
                title="SALN"
                children="(SALN) Statement of Assests, Liabilities, and Networth"
            />

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex flex-col my-5"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>
            </Tabs>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="saln"
                    columns={["1fr", "10rem", "8rem"]}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div>As of</div>
                                <div></div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <Empty
                                    src={empty}
                                    label={`No ${status} SALN.`}
                                />
                            )}
                            {page?.data.map((data, index) => (
                                <TableRow
                                    style={{ gridTemplateColumns: column }}
                                >
                                    <div>{data.user.full_name}</div>
                                    <div>{format(data.asof, "MMM dd, y")}</div>
                                    <div className="justify-center">
                                        {data.status === "approved" ? (
                                            <TypographySmall className="text-green-600 capitalize">
                                                {data.status}
                                            </TypographySmall>
                                        ) : (
                                            <Button
                                                className="bg-green-600 hover:bg-green-500"
                                                onClick={() => onApprove(data.id)}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                    </div>
                                </TableRow>
                            ))}
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
