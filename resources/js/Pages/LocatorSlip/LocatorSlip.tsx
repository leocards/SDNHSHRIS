import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import SearchInput from "@/Components/SearchInput";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Card } from "@/Components/ui/card";
import {
    FilterButton,
    FilterItem,
    MenubarLabel,
    SortButton,
    SortItem,
} from "@/Components/ui/menubar";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { APPROVALTYPE, PAGINATEDDATA, User } from "@/Types";
import React, { Fragment, useEffect, useState } from "react";
import Empty from "@/Components/Empty";
import empty from "@/Assets/empty-file.svg";
import { Add, Eye } from "iconsax-react";
import { Button } from "@/Components/ui/button";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { cn } from "@/Lib/utils";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { format } from "date-fns";
import { router, usePage } from "@inertiajs/react";
import NewLocatorSlip from "./NewLocatorSlip";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { PaginationData } from "@/Components/ui/pagination";
import { InclusiveDateInterface } from "../Leave/Types/Methods";

export type LOCATORSLIPTYPE = {
    id: number;
    user: User;
    dateoffiling: string;
    purposeoftravel: string;
    type: "business" | "time";
    destination: string;
    agenda: {
        date: string;
        dateTo: null|string;
        time: string;
        inclusivedates: InclusiveDateInterface[];
    };
    status: APPROVALTYPE;
    memo: string | null;
    approved_at: string | null;
};

type LocatorSlipProps = {};

const LocatorSlip: React.FC<
    LocatorSlipProps & { locatorslips: PAGINATEDDATA<LOCATORSLIPTYPE> }
> = (props) => {
    return (
        <PaginateProvider<LOCATORSLIPTYPE>
            pageValue={props.locatorslips}
            url={route("myapproval.locatorslip")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<LOCATORSLIPTYPE>();
    const { role, name, avatar } = usePage().props.auth.user;
    const { setProcess } = useProcessIndicator();

    const [applyLs, setApplyLs] = useState(false);
    const [status, setStatus] = useState("pending");
    const [filter, setFilter] = useState("all");
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "date",
        order: "desc",
    });

    const Columns = `1fr 1fr 1fr 5rem`;

    return (
        <div>
            <Header title="Locator Slip">Locator Slip</Header>

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex flex-col my-5"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value, filter });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="disapproved">Disapproved</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="flex max-sm:flex-col max-sm:gap-4 mb-4">
                <div className="flex gap-4">
                    <FilterButton
                        isDirty={filter != "all"}
                        onClearFilter={() => setFilter("all")}
                    >
                        <FilterItem
                            value={"all"}
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
                            All
                        </FilterItem>
                        <FilterItem
                            value={"business"}
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
                            Official Business
                        </FilterItem>
                        <FilterItem
                            value={"time"}
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
                            Official Time
                        </FilterItem>
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

                {role === "principal" ? (
                    <div className="ml-auto relative sm:max-w-64 lg:max-w-96 w-full">
                        <SearchInput
                            placeholder="Search name"
                            onSearch={(search) =>
                                onQuery({ status, filter, sort, order, search })
                            }
                        />
                    </div>
                ) : (
                    <Button
                        className="ml-auto"
                        onClick={() => {
                            setApplyLs(true);
                        }}
                    >
                        <Add /> <span className="max-sm:hidden">Apply</span>
                    </Button>
                )}
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="locatorslips"
                    columns={Columns}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div>Type</div>
                                <div>Date of filing</div>
                                <div></div>
                            </TableHeader>
                            {page?.data.length === 0 ? (
                                <Empty
                                    src={empty}
                                    label={`No ${status} locator slip application.`}
                                />
                            ) : (
                                page?.data.map((ls, index) => (
                                    <TableRow
                                        key={index}
                                        style={{
                                            gridTemplateColumns: column,
                                        }}
                                    >
                                        <div className="gap-2">
                                            <ProfilePhoto
                                                src={
                                                    role === "principal"
                                                        ? ls.user?.avatar
                                                        : avatar
                                                }
                                            />
                                            <div className="line-clamp-1 break-words">
                                                {role === "principal"
                                                    ? ls.user?.name
                                                    : name}
                                            </div>
                                        </div>
                                        <div
                                            className="data-[sidebarstate=expanded]:[@media(max-width:1000px)]:!hidden"
                                            // data-sidebarstate={state}
                                        >
                                            {ls.type === "business"
                                                ? "Official Business"
                                                : "Official Time"}
                                        </div>
                                        <div
                                            className={cn(
                                                "data-[sidebarstate=expanded]:[@media(max-width:1080px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:930px)]:!hidden"
                                            )}
                                            // data-sidebarstate={state}
                                        >
                                            {format(new Date(), "MMM d, y")}
                                        </div>
                                        <div className="justify-center">
                                            <TooltipLabel label="View details">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-7"
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                role ===
                                                                    "principal"
                                                                    ? "myapproval.locatorslip.view"
                                                                    : "locatorslip.view",
                                                                [ls.id]
                                                            ),
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
                                            </TooltipLabel>
                                        </div>
                                    </TableRow>
                                ))
                            )}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />

            <NewLocatorSlip show={applyLs} onClose={() => setApplyLs(false)} />
        </div>
    );
};

export default LocatorSlip;
