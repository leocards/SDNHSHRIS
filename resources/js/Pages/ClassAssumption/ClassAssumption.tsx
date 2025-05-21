import Header, { TableHeader, TableRow } from "@/Components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Fragment, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import ActionHeader from "./ActionHeader";
import { ClassAssumptionDetailsList, CLASSASSUMPTIONTYPE } from "./type";
import { APPROVALTYPE, PAGINATEDDATA } from "@/Types";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import NewClassAssumption from "./NewClassAssumption";
import { ProfilePhoto } from "@/Components/ui/avatar";
import useWindowSize from "@/Hooks/useWindowResize";
import { useSidebar } from "@/Components/ui/sidebar";
import { Edit, Eye } from "iconsax-react";
import { cn } from "@/Lib/utils";
import { Button } from "@/Components/ui/button";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import Empty from "@/Components/Empty";
import empty from "@/Assets/empty-file.svg";

type ClassAssumptionProps = {
    classassumptions: PAGINATEDDATA<CLASSASSUMPTIONTYPE>;
};

const ClassAssumption: React.FC<ClassAssumptionProps> = (props) => {
    const { url } = usePage();

    return (
        <PaginateProvider<CLASSASSUMPTIONTYPE>
            pageValue={props.classassumptions}
            url={route(url.startsWith("/myapproval")?"myapproval.classassumption":"classassumption")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<CLASSASSUMPTIONTYPE>();
    const { url } = usePage();
    const { setProcess } = useProcessIndicator()
    const isApprovalPage = url.startsWith("/myapproval");

    const [status, setStatus] = useState<APPROVALTYPE>("pending");
    const [filter, setFilter] = useState("all");
    const [{ sort, order }, setSortOrder] = useState<{
        sort?: any;
        order: "asc" | "desc";
    }>({
        sort: "date",
        order: "desc",
    });

    const [showNewCA, setShowNewCA] = useState(false);
    const [showNewCAType, setShowNewCAType] = useState<"business" | "sick">(
        "business"
    );
    const [selectedCA, setSelectedCA] = useState<CLASSASSUMPTIONTYPE | null>(null);

    const Columns = isApprovalPage ? `1fr 1fr 6rem` : `1fr 10rem`;

    return (
        <div>
            <Header title="Class Assumption">Class Assumption</Header>

            <Tabs
                defaultValue="pending"
                className="overflow-hidden grow flex flex-col my-5"
                onValueChange={(value) => {
                    setStatus(value as APPROVALTYPE);
                    onQuery({ status: value, filter });
                }}
            >
                <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="disapproved">Disapproved</TabsTrigger>
                </TabsList>
            </Tabs>

            <ActionHeader
                status={status}
                onAdd={(add) => {
                    setShowNewCAType(add);
                    setShowNewCA(true);
                }}
            />

            <Card className="min-h-[27rem] relative">
                <TableDataSkeletonLoader
                    data="classassumptions"
                    columns={Columns}
                    length={8}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                {isApprovalPage && <div>Name</div>}
                                <div
                                    className={cn(
                                        isApprovalPage && "max-sm:!hidden"
                                    )}
                                >
                                    Type
                                </div>
                                <div className="justify-center">Action</div>
                            </TableHeader>

                            {page?.data.length === 0 ? (
                                <Empty
                                    src={empty}
                                    label={`No ${status} class assumption.`}
                                />
                            ) : (page?.data?.map((data, index) => (
                                <TableRow
                                    key={index}
                                    style={{ gridTemplateColumns: column }}
                                >
                                    {isApprovalPage && (
                                        <div className="gap-2">
                                            <ProfilePhoto
                                                src={data.user.avatar}
                                            />
                                            <div className="line-clamp-1 break-words">
                                                {data.user.name}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            isApprovalPage && "max-sm:!hidden"
                                        )}
                                    >
                                        <span className="line-clamp-1">
                                            {
                                                ClassAssumptionDetailsList[
                                                    data.details.details.catype
                                                ][
                                                    data.details.details
                                                        .type as keyof (typeof ClassAssumptionDetailsList)[typeof data.details.details.catype]
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <div className="gap-2 justify-center">
                                        <Button
                                            className="size-7"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                router.get(
                                                    route(
                                                        isApprovalPage
                                                            ? "myapproval.classassumption.view"
                                                            : "classassumption.view",
                                                        [data.id]
                                                    ), {},
                                                    {
                                                        onBefore: () => setProcess(true)
                                                    }
                                                )
                                            }
                                        >
                                            <Eye />
                                        </Button>
                                        {(!isApprovalPage && data.status !== "approved") && (
                                            <Button
                                                className="size-7"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedCA(data)
                                                    setShowNewCAType(
                                                        data.details.details
                                                            .catype
                                                    );
                                                    setShowNewCA(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                        )}
                                    </div>
                                </TableRow>
                            )))}
                        </Fragment>
                    )}
                </TableDataSkeletonLoader>
            </Card>

            <PaginationData />

            <NewClassAssumption
                show={showNewCA}
                onClose={() => {
                    setShowNewCA(false);
                    setSelectedCA(null);
                }}
                type={showNewCAType}
                ca={selectedCA}
            />
        </div>
    );
};

export default ClassAssumption;
