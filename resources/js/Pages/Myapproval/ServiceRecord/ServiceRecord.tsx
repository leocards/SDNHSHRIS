import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PAGINATEDDATA, User } from "@/Types";
import React, { Fragment, HTMLAttributes, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import Empty from "@/Components/Empty";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Button } from "@/Components/ui/button";
import { DocumentUpload, Eye } from "iconsax-react";
import { SERVICERECORDTYPE } from "@/Pages/ServiceRecord/ServiceRecord";
import TypographySmall from "@/Components/Typography";
import { cn } from "@/Lib/utils";
import { format } from "date-fns";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { ProfilePhoto } from "@/Components/ui/avatar";
import ViewCertificate from "@/Pages/ServiceRecord/ViewCertificate";
import {
    FilterButton,
    FilterItem,
    MenubarLabel,
} from "@/Components/ui/menubar";
import SearchInput from "@/Components/SearchInput";
import { useSidebar } from "@/Components/ui/sidebar";
import useWindowSize from "@/Hooks/useWindowResize";

const ServiceRecord: React.FC<{ sr: PAGINATEDDATA<SERVICERECORDTYPE> }> = (
    props
) => {
    return (
        <PaginateProvider<SERVICERECORDTYPE>
            pageValue={props.sr}
            url={route("myapproval.sr")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<SERVICERECORDTYPE>();
    const [status, setStatus] = useState("pending");
    const [type, setType] = useState<"All" | "COC" | "Certificate">("All");
    const [viewCertificate, setViewCertificate] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const { width } =useWindowSize()

    const responsiveTableColumns = {
        expanded: `1fr ${(width <= 915 && width >= 768) || width <= 610 ? `` : `1fr`} ${width <= 460 ? '' : '7rem'} ${width <= 1070 ? `` : `11rem`} 5rem`,
        collapsed: `1fr 1fr 7rem 11rem 5rem`
    }[useSidebar().state]

    return (
        <div className="w-full">
            <Header title="Service Record" children="Service Record" />

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex items-center justify-between my-5"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value, type });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="invalid">Invalid</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <FilterButton isDirty={type !== "All"} filter={type} align="end" onClearFilter={() => {
                        setType("All");
                        onQuery({
                            status,
                            type: "All",
                        });
                    }}>
                        <FilterItem
                            value="All"
                            activeFilter={type}
                            onClick={(value) => {
                                setType(value as "All" | "COC" | "Certificate");
                                onQuery({
                                    status,
                                    type: value,
                                });
                            }}
                        >
                            All
                        </FilterItem>
                        <FilterItem
                            value="Certificate"
                            activeFilter={type}
                            onClick={(value) => {
                                setType(value as "All" | "COC" | "Certificate");
                                onQuery({
                                    status,
                                    type: value,
                                });
                            }}
                        >
                            Certificate
                        </FilterItem>
                        <FilterItem
                            value="COC"
                            activeFilter={type}
                            onClick={(value) => {
                                setType(value as "All" | "COC" | "Certificate");
                                onQuery({
                                    status,
                                    type: value,
                                });
                            }}
                        >
                            COC
                        </FilterItem>
                    </FilterButton>
                </div>

                <div>
                    <SearchInput
                        onSearch={(search) => {
                            onQuery({ status, type, search})
                        }}
                    />
                </div>
            </div>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="sr"
                    length={7}
                    columns={responsiveTableColumns}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Personnel name</div>
                                <div className="[@media(max-width:611px)]:!hidden [@media(min-width:768px)_and_(max-width:915px)]:!hidden">Cartificate name</div>
                                <div className="[@media(max-width:461px)]:!hidden">Type</div>
                                <div className="[@media(max-width:1070px)]:!hidden">Date modified</div>
                                <div>Actions</div>
                            </TableHeader>

                            {page?.data.length === 0 && (
                                <Empty
                                    src={empty}
                                    label={`No ${status} service record.`}
                                />
                            )}

                            {page?.data.map((sr, index) => (
                                <ServiceRecordCard
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                    sr={sr}
                                    onView={() => {
                                        setSelected(sr.id);
                                        setViewCertificate(true);
                                    }}
                                />
                            ))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <div className="">
                <PaginationData />
            </div>

            <ViewCertificate
                srid={selected}
                show={viewCertificate}
                onClose={setViewCertificate}
            />
        </div>
    );
};

interface ServiceRecordCardProps extends HTMLAttributes<HTMLDivElement> {
    sr: SERVICERECORDTYPE;
    onView: CallableFunction;
}

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({
    sr,
    onView,
    ...props
}) => {
    const {state} = useSidebar()
    return (
        <TableRow {...props} className={cn("cursor-default", props.className)}>
            <div className="items-center gap-2">
                <ProfilePhoto src={sr?.user?.avatar} />
                <span className="line-clamp-1">{sr.user?.name}</span>
            </div>
            <div className={cn(state === "collapsed" ? "" : "[@media(max-width:611px)]:!hidden [@media(min-width:768px)_and_(max-width:915px)]:!hidden")}>{sr.details.name}</div>
            <div className={cn(sr.type === "coc" ? "uppercase" : "capitalize", state === "collapsed" ? "" : "[@media(max-width:461px)]:!hidden")}>
                {sr.type}
            </div>
            <div className={(state === "collapsed" ? "" : "[@media(max-width:1070px)]:!hidden")}>
                <span className="line-clamp-1">
                    {format(sr.created_at, "MMM dd, y")}
                </span>
            </div>
            <div>
                <TooltipLabel label="View" className="mx-auto">
                    <Button
                        size="icon"
                        variant="outline"
                        className="size-7"
                        onClick={() => onView()}
                    >
                        <Eye />
                    </Button>
                </TooltipLabel>
            </div>
        </TableRow>
    );
};

export default ServiceRecord;
