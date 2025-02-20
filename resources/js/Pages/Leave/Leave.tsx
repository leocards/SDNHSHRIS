import Header, { TableHeader, TableRow } from "@/Components/Header";
import React, { Fragment, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card } from "@/Components/ui/card";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { PAGINATEDDATA } from "@/Types";
import { PaginationData } from "@/Components/ui/pagination";
import {
    FilterButton,
    FilterItem,
    MenubarLabel,
    SortButton,
    SortItem,
} from "@/Components/ui/menubar";
import {
    LEAVETYPES,
    LEAVETYPESOBJ,
} from "@/Pages/Leave/Types/leavetypes";
import { Eye } from "iconsax-react";
import { Button } from "@/Components/ui/button";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import empty from "@/Assets/empty-file.svg";
import { TooltipLabel } from "@/Components/ui/tooltip";
import Empty from "@/Components/Empty";
import { router, usePage } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { APPLICATIONFORLEAVETYPES } from "./PDF/type";
import { cn } from "@/Lib/utils";
import { format } from "date-fns";

type LEAVETYPE = APPLICATIONFORLEAVETYPES & {
    created_at: string;
    updated_at: string;
};

type LeaveProps = {};

const Leave: React.FC<LeaveProps & { leaves: PAGINATEDDATA<LEAVETYPE> }> = (
    props
) => {
    return (
        <PaginateProvider<LEAVETYPE>
            pageValue={props.leaves}
            url={route("leave")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main: React.FC<LeaveProps> = ({}) => {
    const { page, onQuery } = usePagination<LEAVETYPE>();
    const { setProcess } = useProcessIndicator();
    const role = usePage().props.auth.user.role
    const [status, setStatus] = useState("pending");
    const [filter, setFilter] = useState("");
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "name",
        order: "asc",
    });

    return (
        <div>
            <Header title={role == "principal" ? "My Leave" : "Leave"}>{role == "principal" && "My"} Leave</Header>

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex items-center mb-5 mt-4"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value, filter, sort, order });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="disapproved">Disapproved</TabsTrigger>
                </TabsList>

                <Button
                    className="ml-auto"
                    onClick={() =>
                        router.get(route("leave.apply"), undefined, {
                            onBefore: () => setProcess(true),
                        })
                    }
                >
                    Apply for Leave
                </Button>
            </Tabs>

            <div className="flex gap-4 mb-4">
                <FilterButton isDirty={!!filter}>
                    <MenubarLabel>Leave types</MenubarLabel>
                    {LEAVETYPES.map((lt, index) => (
                        <FilterItem
                            key={index}
                            value={lt}
                            activeFilter={filter}
                            onClick={(value) => {
                                setFilter(value);
                                onQuery({
                                    status,
                                    filter: value,
                                    sort,
                                    order,
                                });
                            }}
                        >
                            {lt}
                        </FilterItem>
                    ))}
                </FilterButton>
                <SortButton
                    order={order}
                    onOrderChange={(value) => {
                        setSortOrder({ sort, order: value });
                        onQuery({ status, filter, sort, order: value });
                    }}
                >
                    <MenubarLabel>Sort by</MenubarLabel>
                    <SortItem
                        value="name"
                        activeSort={sort}
                        onClick={(value) => {
                            setSortOrder({ sort: value, order });
                            onQuery({ status, filter, sort: value, order });
                        }}
                        children="Name"
                    />
                    <SortItem
                        value="leave"
                        activeSort={sort}
                        onClick={(value) => {
                            setSortOrder({ sort: value, order });
                            onQuery({ status, filter, sort: value, order });
                        }}
                        children="Leave type"
                    />
                    <SortItem
                        value="date"
                        activeSort={sort}
                        onClick={(value) => {
                            setSortOrder({ sort: value, order });
                            onQuery({ status, filter, sort: value, order });
                        }}
                        children="Date created"
                    />
                </SortButton>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="leaves"
                    columns={[
                        ...Array.from({ length: 4 }).map(
                            () => "minmax(6rem,1fr)"
                        ),
                        "5rem",
                    ]}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Type</div>
                                <div>Date</div>
                                <div>HR Status</div>
                                <div>Principal Status</div>
                                <div className="justify-center">Action</div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <Empty
                                    src={empty}
                                    label={`No ${status} leave application.`}
                                />
                            )}
                            {page?.data.map((leave, index) => (
                                <TableRow
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                >
                                    <div>{LEAVETYPESOBJ[leave?.type]}</div>
                                    <div>{format(leave?.created_at, 'MMM dd, y')}</div>
                                    <div
                                        className={cn(
                                            "capitalize",
                                            {
                                                pending: "text-amber-600",
                                                approved: "text-green-600",
                                                disapproved: "text-destructive",
                                            }[leave?.hrstatus]
                                        )}
                                    >
                                        {leave?.hrstatus}
                                    </div>
                                    <div
                                        className={cn(
                                            "capitalize",
                                            {
                                                pending: "text-amber-600",
                                                approved: "text-green-600",
                                                disapproved: "text-destructive",
                                            }[leave?.principalstatus]
                                        )}
                                    >
                                        {leave?.principalstatus}
                                    </div>
                                    <div className="justify-center">
                                        <TooltipLabel label="View details">
                                            <Button variant="outline" size="icon" className="size-7" onClick={() => {
                                                router.get(route('leave.view', [leave?.id]), {}, {
                                                    onBefore: () =>  setProcess(true)
                                                })
                                            }}>
                                                <Eye />
                                            </Button>
                                        </TooltipLabel>
                                    </div>
                                </TableRow>
                            ))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />
        </div>
    );
};

export default Leave;
