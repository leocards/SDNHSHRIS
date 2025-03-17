import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { PAGINATEDDATA } from "@/Types";
import React, { Fragment, HTMLAttributes, useState } from "react";
import empty from "@/Assets/empty-file.svg";
import Empty from "@/Components/Empty";
import NewCertificate from "./NewCertificate";
import { Button } from "@/Components/ui/button";
import { DocumentUpload, Eye } from "iconsax-react";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/Lib/utils";
import NewCOC from "./NewCOC";
import ViewCertificate from "./ViewCertificate";
import { usePage } from "@inertiajs/react";
import { FilterButton, FilterItem } from "@/Components/ui/menubar";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";

export type CERTIFICATEAPPROVALTYPE = "pending" | "approved" | "invalid";

export type SERVICERECORDDETIALSTYPE = {
    name: string;
    from: string;
    to: string | null;
};

export type SERVICERECORDTYPE = {
    id: number;
    user?: { id: number, name: string, avatar: string }
    type: "certificate" | "coc";
    details: SERVICERECORDDETIALSTYPE;
    status: CERTIFICATEAPPROVALTYPE;
    created_at: string;
};

const ServiceRecord: React.FC<{ sr: PAGINATEDDATA<SERVICERECORDTYPE> }> = (
    props
) => {
    return (
        <PaginateProvider<SERVICERECORDTYPE>
            pageValue={props.sr}
            url={route("sr")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const role = usePage().props.auth.user.role
    const { page, onQuery } = usePagination<SERVICERECORDTYPE>();
    const [status, setStatus] = useState("pending");
    const [newCertificate, setNewCertificate] = useState(false);
    const [newcoc, setNewcoc] = useState(false);
    const [viewCertificate, setViewCertificate] = useState(false)
    const [selected, setSelected] = useState<number|null>(null)
    const [type, setType] = useState<"All" | "COC" | "Certificate">("All");
    const {width} = useWindowSize()

    return (
        <div className="w-full">
            <Header title="Service Record" children="Service Record" />

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex max-lg:flex-col lg:items-center my-5"
                onValueChange={(value) => {
                    setStatus(value);
                    onQuery({ status: value });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60 mr-auto">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="invalid">Invalid</TabsTrigger>
                </TabsList>

                <div className="flex max-lg:mt-4 max-lg:ml-auto">
                    {role != "teaching" && <FilterButton className="mr-4" isDirty={type !== "All"} filter={type} align="end" onClearFilter={() => {
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
                    </FilterButton>}

                    {(role === "non-teaching" || role === "principal") && <Button onClick={() => setNewcoc(true)}>
                        <DocumentUpload />
                        <span>COC</span>
                    </Button>}

                    <Button
                        className="ml-4"
                        onClick={() => setNewCertificate(true)}
                    >
                        <DocumentUpload />
                        <span>Certificate</span>
                    </Button>
                </div>
            </Tabs>

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="sr"
                    length={7}
                    columns={width > 1024 ? `1fr 1fr 1fr 6rem` : width <= 639? `1fr 6rem`:`1fr 1fr 6rem`}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Cartificate name</div>
                                <div className="max-sm:!hidden">Type</div>
                                <div className="[@media(max-width:1024px)]:!hidden">Date modified</div>
                                <div className="justify-center">Actions</div>
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
                                        setSelected(sr.id)
                                        setViewCertificate(true)
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

            <NewCertificate show={newCertificate} onClose={setNewCertificate} />

            <NewCOC show={newcoc} onClose={setNewcoc} />

            <ViewCertificate srid={selected} show={viewCertificate} onClose={setViewCertificate} />
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
    return (
        <TableRow {...props} className={cn("cursor-default", props.className)}>
            <div>{sr.details.name}</div>
            <div className={cn(sr.type === "coc" ? "uppercase" : "capitalize", "max-sm:!hidden")}>
                {sr.type}
            </div>
            <div className="[@media(max-width:1024px)]:!hidden">{format(sr.created_at, "MMM dd, y")}</div>
            <div className="justify-center">
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
