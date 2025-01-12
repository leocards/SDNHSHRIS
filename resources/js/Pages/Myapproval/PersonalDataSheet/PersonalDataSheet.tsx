import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { APPROVALTYPE, PAGINATEDDATA } from "@/Types";
import React, { Fragment, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import Empty from "@/Components/Empty";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { format } from "date-fns";
import ViewPds from "@/Pages/PDS/ViewPds";

type PDSTYPE = {
    id: number;
    user: {
        id: number;
        name: string;
        avatar: string;
    };
    status: APPROVALTYPE;
    updated_at: string;
};

const PersonalDataSheet: React.FC<{ pds: PAGINATEDDATA<PDSTYPE> }> = (
    props
) => {
    return (
        <PaginateProvider<PDSTYPE>
            pageValue={props.pds}
            url={route("myapproval.pds")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<PDSTYPE>();
    const [status, setStatus] = useState("pending");
    const [viewpds, setViewpds] = useState(false);
    const [userid, setUserid] = useState<number | null>(null);

    return (
        <div className="mx-auto max-w-3xl">
            <Header title="PDS" children="(PDS) Personal Data Sheet" />

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
                    <TabsTrigger value="disapproved">Disapproved</TabsTrigger>
                </TabsList>
            </Tabs>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="pds"
                    columns={["1fr", "10rem"]}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div>Date modified</div>
                            </TableHeader>
                            {page?.data?.length === 0 && (
                                <Empty
                                    src={empty}
                                    label={`No ${status} Personal Data Sheet.`}
                                />
                            )}
                            {page?.data?.map((pds, index) => (
                                <TableRow
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                    role="button"
                                    onClick={() => {
                                        setUserid(pds.user.id)
                                        setViewpds(true)
                                    }}
                                >
                                    <div className="gap-2">
                                        <ProfilePhoto src={pds?.user?.avatar} />
                                        <div className="line-clamp-1 break-words">
                                            {pds?.user?.name}
                                        </div>
                                    </div>
                                    <div>
                                        {format(
                                            new Date(pds?.updated_at),
                                            "MMM dd, yyyy"
                                        )}
                                    </div>
                                </TableRow>
                            ))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />

            <ViewPds userid={userid} show={viewpds} onClose={setViewpds} />
        </div>
    );
};

export default PersonalDataSheet;
