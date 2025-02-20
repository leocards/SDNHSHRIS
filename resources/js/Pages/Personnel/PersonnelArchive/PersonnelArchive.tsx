import Header, { TableHeader, TableRow } from "@/Components/Header";
import {
    PaginateProvider,
    usePagination,
} from "@/Components/Provider/paginate-provider";
import { useProcessIndicator } from "@/Components/Provider/process-indicator-provider";
import TableDataSkeletonLoader from "@/Components/TableDataSkeletonLoader";
import { ProfilePhoto } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { PaginationData } from "@/Components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { TooltipLabel } from "@/Components/ui/tooltip";
import { PAGINATEDDATA, User } from "@/Types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Eye } from "iconsax-react";
import { Fragment } from "react";
import empty from "@/Assets/empty-personnel.svg";

type PersonnelProps = {};

const Personnel: React.FC<
    PersonnelProps & { personnels: PAGINATEDDATA<User> }
> = (props) => {
    return (
        <PaginateProvider<User>
            pageValue={props.personnels}
            url={route("personnel.archive")}
        >
            <Main />
        </PaginateProvider>
    );
};

const Main = () => {
    const { page, onQuery } = usePagination<User>();
    const { setProcess } = useProcessIndicator()

    return (
        <div className="max-w-4xl mx-auto">
            <Header
                title="Personnel Archive"
                className="mb-2"
                children="Personnel Archive"
            />

            <div className="flex size-fit mb-5 mt-4">
                <Tabs
                    defaultValue="retired"
                    className="overflow-hidden grow flex items-center"
                    onValueChange={(status) => {
                        onQuery({ status });
                    }}
                >
                    <TabsList className="w-fit rounded [&>button]:rounded-sm h-fit [&>button]:py-1.5 bg-primary/15 text-primary/60">
                        <TabsTrigger value="retired">Retired</TabsTrigger>
                        <TabsTrigger value="resigned">Resigned</TabsTrigger>
                        <TabsTrigger value="transferred">
                            Transferred
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                {/* <div className="grow w-px mx-3.5 bg-border"></div> */}
            </div>

            <Card className="min-h-[28rem] relative">
                <TableDataSkeletonLoader
                    data="personnels"
                    columns={["minmax(5rem,1fr)", "7rem", "10rem", "5rem"]}
                    length={9}
                >
                    {(column) => (
                        <Fragment>
                            <TableHeader
                                style={{ gridTemplateColumns: column }}
                            >
                                <div>Name</div>
                                <div>Status</div>
                                <div>Date</div>
                                <div className="justify-center">View</div>
                            </TableHeader>
                            {page?.data.length === 0 && (
                                <div className="flex flex-col items-center absolute inset-0 justify-center">
                                    <img
                                        className="size-24 opacity-40 dark:opacity-65"
                                        src={empty}
                                    />
                                    <div className="text-sm font-medium text-foreground/50 mt-1 text-center">
                                        No available personnel archive.
                                    </div>
                                </div>
                            )}
                            {page?.data.map((personnel, index) => (
                                <TableRow
                                    style={{ gridTemplateColumns: column }}
                                    key={index}
                                >
                                    <div className="gap-2">
                                        <ProfilePhoto src={personnel.avatar} />
                                        <div className="line-clamp-1">
                                            {personnel.name}
                                        </div>
                                    </div>
                                    <div className="capitalize text-center">
                                        {personnel.status}
                                    </div>
                                    <div className="text-center">
                                        {format(
                                            personnel.status_updated_at!,
                                            "LLLL d, y"
                                        )}
                                    </div>
                                    <div className="justify-center">
                                        <TooltipLabel label="View">
                                            <Button size="icon" variant={"outline"} onClick={() => {
                                                router.get(route('personnel.archive.view', [personnel.id]), {}, { onBefore: () => setProcess(true)})
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

export default Personnel;
