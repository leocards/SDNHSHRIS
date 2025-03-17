import Header, { TableHeader, TableRow } from "@/Components/Header";
import React, {
    Fragment,
    useState,
} from "react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Card } from "@/Components/ui/card";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { PAGINATEDDATA, User } from "@/Types";
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
import { ProfilePhoto } from "@/Components/ui/avatar";
import { TooltipLabel } from "@/Components/ui/tooltip";
import Empty from "@/Components/Empty";
import { router, usePage } from "@inertiajs/react";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import { APPLICATIONFORLEAVETYPES } from "@/Pages/Leave/PDF/type";
import { format } from "date-fns";
import { cn } from "@/Lib/utils";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";
import SearchInput from "@/Components/SearchInput";

type LEAVETYPE = APPLICATIONFORLEAVETYPES & {
    user: User;
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
            url={route("myapproval.leave")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main: React.FC<LeaveProps> = ({}) => {
    const { page, onQuery } = usePagination<LEAVETYPE>();
    const { role } = usePage().props.auth.user;
    const { width } = useWindowSize()
    const { state } = useSidebar()

    const { setProcess } = useProcessIndicator();
    const [status, setStatus] = useState("pending");
    const [filter, setFilter] = useState("");
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "name",
        order: "asc",
    });

    const Columns = {
        collapsed: width <= 1000 ? (width <= 929 ? (width <= 474 ? `minmax(6rem,1fr) 5rem` : `${Array(2).fill('minmax(6rem,1fr)').join(' ')} 5rem`) : `${Array(4).fill('minmax(6rem,1fr)').join(' ')} 5rem`) : `${Array(5).fill('minmax(6rem,1fr)').join(' ')} 5rem`,
        expanded: width <= 1080 ? (width <= 1000 ? (width <= 474 ? `minmax(6rem,1fr) 5rem` : `${Array(2).fill('minmax(6rem,1fr)').join(' ')} 5rem`) : `${Array(3).fill('minmax(6rem,1fr)').join(' ')} 5rem`) : `${Array(5).fill('minmax(6rem,1fr)').join(' ')} 5rem`
    }[state]

    return (
        <div>
            <Header title="Leave">Leave</Header>

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex flex-col my-5"
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
            </Tabs>

            <div className="flex max-sm:flex-col max-sm:gap-4 mb-4">
                <div className="flex gap-4">
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

                <div className="ml-auto relative sm:max-w-64 lg:max-w-96 w-full">
                    <SearchInput
                        placeholder="Search name"
                        onSearch={(search) => onQuery({ status, filter, sort, order, search })}
                    />
                </div>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="leaves"
                    columns={Columns}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div className="[@media(max-width:475px)]:!hidden" data-sidebarstate={state}>Type</div>
                                {width > 1000 && <div className="data-[sidebarstate=expanded]:[@media(max-width:1000px)]:!hidden" data-sidebarstate={state}>Date Created</div>}
                                <div className="data-[sidebarstate=expanded]:[@media(max-width:1080px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:930px)]:!hidden" data-sidebarstate={state}>HR Status</div>
                                <div className="data-[sidebarstate=expanded]:[@media(max-width:1080px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:930px)]:!hidden" data-sidebarstate={state}>Principal Status</div>
                                <div className="justify-center">View</div>
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
                                    <div className="gap-2">
                                        <ProfilePhoto src={leave?.user.avatar} />
                                        <div className="line-clamp-1 break-words">
                                            {leave?.user?.name}
                                        </div>
                                    </div>
                                    <div className="[@media(max-width:475px)]:!hidden" data-sidebarstate={state}>{LEAVETYPESOBJ[leave?.type]}</div>
                                    {width > 1000 && <div className="data-[sidebarstate=expanded]:[@media(max-width:1000px)]:!hidden" data-sidebarstate={state}>
                                        {format(leave?.created_at, "MMM dd, y")}
                                    </div>}
                                    <div
                                        className={cn(
                                            "capitalize",
                                            {
                                                pending: "text-amber-600",
                                                approved: "text-green-600",
                                                disapproved: "text-destructive",
                                            }[leave?.hrstatus],
                                            "data-[sidebarstate=expanded]:[@media(max-width:1080px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:930px)]:!hidden"
                                        )}
                                        data-sidebarstate={state}
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
                                            }[leave?.principalstatus],
                                            "data-[sidebarstate=expanded]:[@media(max-width:1080px)]:!hidden data-[sidebarstate=collapsed]:[@media(max-width:930px)]:!hidden"
                                        )}
                                        data-sidebarstate={state}
                                    >
                                        {leave?.principalstatus}
                                    </div>
                                    <div className="justify-center">
                                        <TooltipLabel label="View details">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => {
                                                    router.get(
                                                        route(
                                                            role === "hr" ||
                                                                role ===
                                                                    "principal"
                                                                ? "myapproval.leave.view"
                                                                : "leave.view",
                                                            [leave?.id]
                                                        ),
                                                        {},
                                                        {
                                                            onBefore: () =>
                                                                setProcess(
                                                                    true
                                                                ),
                                                        }
                                                    );
                                                }}
                                            >
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
