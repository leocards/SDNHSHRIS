import Header, { TableHeader, TableRow } from "@/Components/Header";
import React, {
    ChangeEvent,
    Fragment,
    useEffect,
    useRef,
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
    LEAVETYPEKEYS,
    LEAVETYPES,
    LEAVETYPESOBJ,
} from "@/Pages/Leave/Types/leavetypes";
import { Input } from "@/Components/ui/input";
import { Eye, SearchNormal1 } from "iconsax-react";
import { Button } from "@/Components/ui/button";
import { EllipsisVertical, X } from "lucide-react";
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
import { useDebouncedFunction } from "@/Hooks/useDebounce";

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
    const [search, setSearch] = useState("");
    const searchRef = useRef<HTMLInputElement | null>(null);
    const { setProcess } = useProcessIndicator();
    const [loading, setLoading] = useState(false); // loading state when on search
    const [status, setStatus] = useState("pending");
    const [filter, setFilter] = useState("");
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "name",
        order: "asc",
    });

    const debouncedSearch = useDebouncedFunction((value: string) => {
        onQuery({ status, filter, sort, order, search: value });
    }, 700);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/\s+/g, " ");

        setSearch(input);

        debouncedSearch(input);
    };

    const clearSearch = () => {
        searchRef.current && searchRef.current.focus();
        setSearch("");
        debouncedSearch("");
    };

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

            <div className="flex mb-4">
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

                <div className="ml-auto relative max-w-96 w-full">
                    <Input
                        className="w-full px-10 pl-9 formInput h-9"
                        value={search}
                        placeholder="Search name"
                        ref={searchRef}
                        onChange={onSearch}
                    />
                    <SearchNormal1 className="size-4 absolute top-1/2 -translate-y-1/2 left-2.5 opacity-45" />
                    {search !== "" && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-1/2 -translate-y-1/2 right-1 size-7"
                            onClick={clearSearch}
                        >
                            <X className="size-5" />
                        </Button>
                    )}
                </div>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="leaves"
                    columns={[
                        ...Array.from({ length: 5 }).map(
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
                                <div>Name</div>
                                <div>Type</div>
                                <div>Date</div>
                                <div>Principal Status</div>
                                <div>HR Status</div>
                                <div className="justify-center"></div>
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
                                        <ProfilePhoto src={leave?.avatar} />
                                        <div className="line-clamp-1 break-words">
                                            {leave?.user?.name}
                                        </div>
                                    </div>
                                    <div>{LEAVETYPESOBJ[leave?.type]}</div>
                                    <div>
                                        {format(leave?.created_at, "MMM dd, y")}
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
