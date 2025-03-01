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
import { Button } from "@/Components/ui/button";
import { Eye } from "iconsax-react";
import SearchInput from "@/Components/SearchInput";
import useWindowSize from "@/Hooks/useWindowResize";

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
    const { width } = useWindowSize()

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

            <div className="mb-4">
                <SearchInput onSearch={(search) => {
                    onQuery({ status, search });
                }} />
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="pds"
                    columns={`1fr ${width > 520 ? "10rem":""} 5rem`}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div className="[@media(max-width:520px)]:!hidden">Date modified</div>
                                <div className="justify-center">View</div>
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
                                >
                                    <div className="gap-2">
                                        <ProfilePhoto src={pds?.user?.avatar} />
                                        <div className="line-clamp-1 break-words">
                                            {pds?.user?.name}
                                        </div>
                                    </div>
                                    <div className="[@media(max-width:520px)]:!hidden">
                                        {format(
                                            new Date(pds?.updated_at),
                                            "MMM dd, yyyy"
                                        )}
                                    </div>
                                    <div className="justify-center">
                                        <Button
                                            size={"icon"}
                                            variant={"outline"}
                                            onClick={() => {
                                                setUserid(pds.user.id);
                                                setViewpds(true);
                                            }}
                                        >
                                            <Eye />
                                        </Button>
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
